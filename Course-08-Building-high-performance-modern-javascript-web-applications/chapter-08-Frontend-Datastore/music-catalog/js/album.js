let albumDB = (function() {
    'use strict';

    let aDB = {};
    let datastore = null;
    const dbName = 'albumsDB';

    const indexedDB = window.indexedDB      ||
                    window.mozIndexedDB     ||
                    window.webkitIndexedDB;
    // Firefox does not prefix
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

    let searchInput = document.querySelector('#searchInput');
    let viewComponent = document.querySelector('.c-views');
    const isVisibleClass = 'is-visible';


    /********************************************************************
     *
     *                      Utility Functions
     *
     ********************************************************************/

    function status(msg, extraClass) {

        let statusLine = document.querySelector('.statusLine');

        if (!statusLine) {
            statusLine = document.createElement('DIV');
            statusLine.setAttribute('class', 'statusLine');

            if (extraClass) {
                statusLine.classList.add(extraClass);
            }

            document.body.appendChild(statusLine);
        }

        if (msg) {
            statusLine.innerHTML = msg.toString();
        } else {
            document.body.removeChild(statusLine);
        }

    }

    function debounce(fn, delay) {
        let timer = null;
        return function () {
            let args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(this, args);
            }, delay);
        };
    }

    /**
     * When the Db is empty the system imports a list of albums from
     * freemusicarchive.org
     */
    function importAlbums() {

        const URL = 'https://freemusicarchive.org/api/get/albums.json?api_key=JZLCCHD6Y8PC7NPF';

        let promise = new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            const isAsynchronous = false;

            xhr.onload = () => {
                resolve(xhr.response);
            };

            xhr.onerror = (error) => {
                reject(error);
            };

            xhr.open('GET', URL, isAsynchronous);
            status('Loading remote Albums from freemusicarchive.org');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send();
        });

        return promise;
    }

    /**
     * Open a connection to the datastore. If the datastore is new,
     * initialize it
     */
    aDB.open = function(callback) {
        // Database version
        const version = 1;

        // Request a connection to the datastore
        let request = indexedDB.open(dbName, version);

        // Handle upgrades
        request.onupgradeneeded = function(event) {

            let db = event.target.result;

            event.target.transaction.onerror = aDB.onerror;

            // Import the albums
            let albums = importAlbums();

            albums.then(function(result) {

                let albumsObj = JSON.parse(result);
                let dataset   = albumsObj && albumsObj.dataset || null;
                let arrayList = dataset && Array.from(dataset) || [];

                status('Importing Albums');

                // Delete the old datastore.
                if (db.objectStoreNames.contains('albums')) {
                    db.deleteObjectStore('albums');
                }

                // Create a new datastore.
                let store = db.createObjectStore('albums', {
                    keyPath: 'album_id'
                });

                store.transaction.oncomplete = function () {
                    // start a new transaction
                    let transaction = db.transaction('albums', 'readwrite'),
                        objectStore = transaction.objectStore('albums');

                    arrayList.forEach((album) => {
                        //write to the object store
                        objectStore.add(album);
                    });

                    status('');
                };

            },
            (error) => {
                status(error, 'error');
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

        const db = datastore;
        const transaction = db.transaction(['albums'], 'readwrite');
        const objStore = transaction.objectStore('albums');

        let keyRange = IDBKeyRange.lowerBound(0);
        let cursorRequest = objStore.openCursor(keyRange);

        let albums = [];

        status('Fetching Albums');

        transaction.oncomplete = function() {
            callback(albums);
        };

        cursorRequest.onsuccess = function(event) {

            let result = event.target.result;

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

        const db = datastore;
        const transaction = db.transaction(['albums'], 'readwrite');
        const objStore = transaction.objectStore('albums');

        let cursorRequest = objStore.openCursor();

        let albums = [];

        status('Searching Albums');

        transaction.oncomplete = function() {
            callback(albums);
        };

        cursorRequest.onsuccess = function(event) {

            let result = event.target.result;

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
        status(error.message, 'error');
    };


    // Set the right checkbox view and load initial data
    aDB.init = function() {

        let view = getCurrentViewType();
        let checkBox = document.getElementById(view);

        // Initialize the right checkbox for the view
        checkBox.checked = true;

        // Open the connection with the DB and referesh the view
        aDB.open(refreshView);
    };

    /**
     * Initialize a basic table used by the table view
     */
    function initTableView() {

        const baseTable = document.createElement('TABLE');
        const baseTableH = document.createElement('THEAD');
        const baseTableB = document.createElement('TBODY');
        const baseTableR = document.createElement('TR');

        let baseTableHContent = '<tr>';
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

        const article = document.createElement('ARTICLE');
        const divImg = document.createElement('DIV');
        const header  = document.createElement('HEADER');
        const h2  = document.createElement('H2');
        const date  = document.createElement('p');
        const body = document.createElement('DIV');
        const footer = document.createElement('FOOTER');
        const albumlink = document.createElement('A');
        const artistlink = document.createElement('A');
        const showMLink = document.createElement('A');


        let backImg =  'background: rgb(254, 255, 245)  ';
        backImg += 'url("' + album.album_image_file +'")';
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
        h2.textContent = album.album_title.replace(/\"/g, '');
        date.textContent = album.album_date_created;
        body.innerHTML = album.album_information;
        albumlink.textContent = 'Album Site';
        albumlink.setAttribute('href', album.album_url);
        albumlink.setAttribute('title', 'Album WebSite');
        artistlink.textContent = 'Artist';
        artistlink.setAttribute('href', album.artist_url);
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

        let rowCount = table.rows.length;

        let row = table.insertRow(rowCount++);

        let titleCell = row.insertCell(0);
        let dateCell  = row.insertCell(1);
        let infoCell  = row.insertCell(2);
        let albumURLCell  = row.insertCell(3);
        let artistURLCell  = row.insertCell(4);

        let albumlink = document.createElement('A');
        let artistlink = document.createElement('A');

        albumlink.textContent = 'Album Site';
        infoCell.classList.add('h-text--left');
        albumlink.setAttribute('href', album.album_url);
        albumlink.setAttribute('title', 'Album WebSite');
        artistlink.textContent = 'Artist';
        artistlink.setAttribute('href', album.artist_url);
        artistlink.setAttribute('title', 'Artist WebSite');

        titleCell.innerHTML = album.album_title.replace(/\"/g, '');
        dateCell.innerHTML = album.album_date_created;
        infoCell.innerHTML = album.album_information;
        albumURLCell.appendChild(albumlink);
        artistURLCell.appendChild(artistlink);

        return table;
    }

    /**
     * Render the album list
     */
    function renderList(albums) {

        let layout = document.querySelector('.l-album');
        let fragment;
        let view = getCurrentViewType();
        let tableElement;

        if (albums.length === 0) {
            let result  = '<div class="c-album__body"';
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
            let item = event.target;
            let article = event.target.parentNode.parentNode;

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
        const viewType = event.target.id;
        localStorage.setItem('viewType', viewType);
        refreshView();
    });

    // Return public API
    return {
        init: aDB.init
    };
}());