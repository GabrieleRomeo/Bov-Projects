var albumDB = (function() {
    'use strict';

    var aDB = {};
    var datastore = null;
    var dbName = 'albumsDB';

    var indexedDB = window.indexedDB        ||
                    window.mozIndexedDB     ||
                    window.webkitIndexedDB;
    // Firefox does not prefix
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

    var searchInput = document.querySelector('#searchInput');
    var viewComponent = document.querySelector('.c-views');
    var isVisibleClass = 'is-visible';


    /********************************************************************
     *
     *                      Utility Functions
     *
     ********************************************************************/
    function status(msg) {

        var statusLine = document.getElementById('statusLine');

        if (!statusLine) {
            statusLine = document.createElement('DIV');
            statusLine.setAttribute('ID', 'statusLine');
            document.body.appendChild(statusLine);
        }

        if (msg) {
            statusLine.innerHTML = msg.toString();
        } else {
            document.body.removeChild(statusLine);
        }

    }

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    /**
     * When the Db is empty the system imports a list of albums from
     * freemusicarchive.org
     */
    function importAlbums(callback) {

        var xhr = new XMLHttpRequest();
        var URL = 'https://freemusicarchive.org/api/get/albums.json?api_key=JZLCCHD6Y8PC7NPF';
        var isAsynchronous = false;

        status('Loading remote Albums from freemusicarchive.org');

        xhr.open('GET', URL, isAsynchronous);
        xhr.setRequestHeader('Accept', 'application/json', isAsynchronous);
        xhr.onerror = status; // Display any error codes

        xhr.onload = function(e) {
            if (xhr.status === 200) {
                var albumsObj = JSON.parse(xhr.responseText);
                var dataset   = albumsObj && albumsObj.dataset || null;
                var albumsArr = dataset && [].slice.call(dataset) || [];
                callback(albumsArr);
            }
        };

        xhr.send();
    }

    /**
     * Open a connection to the datastore. If the datastore is new,
     * initialize it
     */
    aDB.open = function(callback) {
        // Database version
        var version = 1;

        // Request a connection to the datastore
        var request = indexedDB.open(dbName, version);

        // Handle upgrades
        request.onupgradeneeded = function(event) {

            var db = event.target.result;

            event.target.transaction.onerror = aDB.onerror;

            // Import the albums
            importAlbums(function(arrayList) {

                status('Importing Albums');

                // Delete the old datastore.
                if (db.objectStoreNames.contains('albums')) {
                    db.deleteObjectStore('albums');
                }

                // Create a new datastore.
                var store = db.createObjectStore('albums', {
                    keyPath: 'album_id'
                });

                store.transaction.oncomplete = function () {
                    // start a new transaction
                    var transaction = db.transaction('albums', 'readwrite'),
                        objectStore = transaction.objectStore('albums');

                    arrayList.forEach(function(album) {
                        //write to the object store
                        objectStore.add(album);
                    });

                    status('');
                };

            });
        };

        // Handle successful datastore access.
        request.onsuccess = function(e) {

            // Get a reference to the DB.
            datastore = e.target.result;

            callback();
        };

        request.onerror = aDB.onerror;

    };


    // Fetch all of the items in the datastore.
    aDB.fetchAlbums = function(callback) {

        var db = datastore;
        var transaction = db.transaction(['albums'], 'readwrite');
        var objStore = transaction.objectStore('albums');

        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = objStore.openCursor(keyRange);

        var albums = [];

        status('Fetching Albums');

        transaction.oncomplete = function() {
            callback(albums);
        };

        cursorRequest.onsuccess = function(event) {
            var result = event.target.result;

            if (!!result === false) {
                status('');
                return;
            }

            albums.push(result.value);

            result.continue();
        };

        cursorRequest.onerror = aDB.onerror;
    };


    // Fetch a specific album
    aDB.fetchAlbum = function(value, callback) {

        var db = datastore;
        var transaction = db.transaction(['albums'], 'readwrite');
        var objStore = transaction.objectStore('albums');

        var cursorRequest = objStore.openCursor();

        var albums = [];

        status('Searching Albums');

        transaction.oncomplete = function() {
            callback(albums);
        };

        cursorRequest.onsuccess = function(event) {

            var result = event.target.result;

            if (!!result === false) {
                status('');
                return;
            }

            // Seach in the album's title
            if (result.value.album_title &&
                result.value.album_title.indexOf(value) !== -1) {
                albums.push(result.value);
            } else if (result.value.album_information &&
                       result.value.album_information.indexOf(value) !== -1) {
                albums.push(result.value);
            }


            result.continue();
        };

        cursorRequest.onerror = aDB.onerror;
    };

    // Log errors
    aDB.onerror = function(error) {
        console.log(error.message);
    };


    // Set the right checkbox view and load initial data
    aDB.init = function() {

        var view = getCurrentViewType();
        var checkBox = document.getElementById(view);

        // Initialize the right checkbox for the view
        checkBox.checked = true;

        // Open the connection with the DB and referesh the view
        aDB.open(refreshView);
    };

    /**
     * Initialize a basic table used by the table view
     */
    function initTableView() {

        var baseTable = document.createElement('TABLE');
        var baseTableH = document.createElement('THEAD');
        var baseTableB = document.createElement('TBODY');
        var baseTableR = document.createElement('TR');

        var baseTableHContent = '<tr>';
        baseTableHContent += '<th>Title</th>';
        baseTableHContent += '<th>Date of creation</th>';
        baseTableHContent += '<th>Information</th>';
        baseTableHContent += '<th>Album URL</th>';
        baseTableHContent += '<th>Artist URL</th>';
        baseTableHContent += '</tr>';

        baseTable.setAttribute('cellspacing', '0');

        baseTableH.innerHTML = baseTableHContent;
        baseTableB.appendChild(baseTableR);

        baseTable.appendChild(baseTableH);
        baseTable.appendChild(baseTableB);

        return baseTable;
    }

    /**
     * Build the List view dynamically
     */
    function listView(fragment, album) {

        var article = document.createElement('ARTICLE');
        var divImg = document.createElement('DIV');
        var header  = document.createElement('HEADER');
        var h2  = document.createElement('H2');
        var date  = document.createElement('p');
        var body = document.createElement('DIV');
        var footer = document.createElement('FOOTER');
        var albumlink = document.createElement('A');
        var artistlink = document.createElement('A');
        var showMLink = document.createElement('A');


        var backImg =  'background: rgb(254, 255, 245)  ';
            backImg += 'url("' + album["album_image_file"] +'")';
            backImg += ' left top no-repeat; background-size: cover; ';

        // Add classes
        article.classList.add('c-album');
        divImg.classList.add('c-album__divImg');
        divImg.setAttribute('style', backImg);
        h2.classList.add('c-album__title');
        date.classList.add('c-album__date');
        body.classList.add('c-album__body');
        footer.classList.add('c-album__footer');
        showMLink.classList.add('c-album__showMoreLess');

        // Add content
        h2.textContent = album['album_title'].replace(/\"/g, '');
        date.textContent = album['album_date_created'];
        body.innerHTML = album['album_information'];
        albumlink.textContent = 'Album Site';
        albumlink.setAttribute('href', album['album_url']);
        albumlink.setAttribute('title', 'Album WebSite');
        artistlink.textContent = 'Artist';
        artistlink.setAttribute('href', album['artist_url']);
        artistlink.setAttribute('title', 'Artist WebSite');
        showMLink.textContent = 'Show More';
        showMLink.setAttribute('href', '#');
        showMLink.setAttribute('title', 'More Information');

        header.appendChild(divImg);
        header.appendChild(h2);
        header.appendChild(date);
        footer.appendChild(showMLink);
        footer.appendChild(albumlink);
        footer.appendChild(artistlink);
        article.appendChild(header);
        article.appendChild(body);
        article.appendChild(footer);


        fragment.appendChild(article);

        return fragment;
    }

    /**
     * Build the Table view dynamically
     */
    function tableView(table, album) {
        var rowCount = table.rows.length;

        var row = table.insertRow(rowCount++);

        var titleCell = row.insertCell(0);
        var dateCell  = row.insertCell(1);
        var infoCell  = row.insertCell(2);
        var albumURLCell  = row.insertCell(3);
        var artistURLCell  = row.insertCell(4);

        var albumlink = document.createElement('A');
        var artistlink = document.createElement('A');

        albumlink.textContent = 'Album Site';
        infoCell.classList.add('h-text--left');
        albumlink.setAttribute('href', album['album_url']);
        albumlink.setAttribute('title', 'Album WebSite');
        artistlink.textContent = 'Artist';
        artistlink.setAttribute('href', album['artist_url']);
        artistlink.setAttribute('title', 'Artist WebSite');

        titleCell.innerHTML = album['album_title'].replace(/\"/g, '');
        dateCell.innerHTML = album['album_date_created'];
        infoCell.innerHTML = album['album_information'];
        albumURLCell.appendChild(albumlink);
        artistURLCell.appendChild(artistlink);

        return table;
    }

    /**
     * Render the album list
     */
    function renderList(albums) {

        var layout = document.querySelector('.l-album');
        var fragment;
        var view = getCurrentViewType();
        var tableElement;

        if (albums.length === 0) {
            var result  = '<div class="c-album__body"';
            result += 'style="width: 100%;text-align: center;';
            result += 'font-size: 1.2em;">';
            result += 'Sorry! Nothing Found.';
            result += '</div>';

            layout.innerHTML = result;
        } else {
            layout.innerHTML = '';
        }

        if (view === 'tableView') {
            tableElement = initTableView();
            fragment = albums.reduce(tableView, tableElement);
        } else {
            fragment = albums.reduce(listView, document.createDocumentFragment());
        }

        // Append the intended view into the layout
        layout.appendChild(fragment);

        // Check to see if we have to show the 'show more' link
        document.querySelectorAll('.c-album__body').forEach(function(body) {
            if (body.offsetHeight > 750) {
                showMore(body.nextElementSibling.firstChild);
            }
        });
    }

    // Show the 'show more' link when necessary
    function showMore(item) {
        item.classList.add(isVisibleClass);
        item.addEventListener('click', function(event) {
            var item = event.target;
            var article = event.target.parentNode.parentNode;

            if (article.classList.contains('showContent')) {
                article.classList.remove('showContent');
                item.textContent = 'Show More';
            } else {
                article.classList.add('showContent');
                item.textContent = 'Show Less';
            }
            event.preventDefault();
        });
    }

    // Update the album view
    function refreshView(albumList) {
        albumList ? renderList(albumList) : aDB.fetchAlbums(renderList);
    }

    // Return the current view saved into the localstorage
    function getCurrentViewType() {
        return localStorage.getItem('viewType') || 'listView';
    }

    // Add search capability and throttle the amount of times the function
    // runs
    searchInput.addEventListener('keyup', debounce(function(event) {
        aDB.fetchAlbum(event.target.value, refreshView);
    }, 250));

    viewComponent.addEventListener('change', function(event) {
        var viewType = event.target.id;
        localStorage.setItem('viewType', viewType);
        refreshView();
    });

    // Return public API
    return {
        init: aDB.init
    };
}());