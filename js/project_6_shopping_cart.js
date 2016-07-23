'use strict';

document.addEventListener('DOMContentLoaded', function () {


var Cart = (function(window) {

    var _win = window,
        _doc = _win.document;

    var addButtons    = _doc.getElementsByClassName('addToCart'),
        cart          = $('#cart'),
        cartTable     = $('#cart-table').childNodes[1],
        cartSubTot    = $('#cartSubTot'),
        cartTotal     = $('#cartTotal'),
        cartShipp     = $('#cartShipping'),
        cartCoupon    = $('#cartCoupon'),
        cartCouponVal = $('#cartCouponVal'),
        cartCouponRow = $('#cartCouponRow'),
        couponMessage = $('#couponMessage'),
        couponButton  = $('#couponButton'),
        couponInput   = $('#couponInput'),
        len           = addButtons.length;

    /* 
     * It represents the database for the current shopping cart  
     */
    var CartDB = {
        currencySymbol: '\u0024',
        shippingCost: 7,
        check: {
            subTotal: 0,
            saving: 0
        },
        promoCodes: {
          applied: null,
          coupons: { 'bigsale': 50, 'promopromo': 16, 'white': 5 },
          types: { '1': 15, '2': 8, '3': 7 },
          products: { 'product-10': 10}
        },
        items: [],
        getItems: function() {
            return this.items;
        },
        getPromoTypes: function() {
          return Utilities.keys(this.promoCodes.types);      
        },
        getPromoType: function(name) {
          return this.promoCodes.types[name];      
        },
        getPromoCode: function(code) {
          return this.promoCodes[code] || void 0;
        },
        getDiscount: function(product) {

          var promos  = this.promoCodes;
          var name    = product.name.toLowerCase();
          var type    = product.type;

          // When a coupon was applied, returns 0 
          if (truthy(promos.applied)) {
              return 0;
          }

          // First, it checks for a promo for the provided product
          // then it looks for its type, in the end returs 0
          return promos.products[name] || promos.types[type] || 0;
        },
        resetCoupon: function() {
          this.promoCodes.applied = null;
        },
        checkCoupon: function(coupon) {

          var promos = this.promoCodes;

          var subTotal     = 0,
              saving       = 0,
              off          = 0,
              couponSaving = 0;

          // if the provided promo does not exist, it returns -1
          if (!existy(promos.coupons[coupon])) {
              // It reset a current promo (if any)
              promos.applied = null;
              return -1;
          }

          /* 
           * It first checks if the coupon makes the total price less than the  
           * total price with the current promo
           */
          off          = promos.coupons[coupon];
          subTotal     = this.getSubTotal();
          saving       = this.getSaving();
          couponSaving = subTotal - calcPercentage(subTotal, off);

          // if the coupon saving is less then the normal saving, it returns 0
          if (couponSaving < saving) return 0;

          // Otherwise, save the current promo
          promos.applied = off;

          // returns its actual coupon's value, in percentage
          return off;
        },
        getCouponOff: function() {
            return this.promoCodes.applied || 0;
        },
        getShippingCost: function() {
          return this.shippingCost;
        },
        setSubTotal: function(subTotal) {
            this.check.subTotal = subTotal;
        },
        getSubTotal: function() {
          return this.check.subTotal;
        },
        setSaving: function(saving) {
            this.check.saving = saving;
        },
        getSaving: function() {
          return this.check.saving;
        }
    };

    /*
     * Product - Constructor function
     * It represents a product and exposes property and utilities methods
     */
    function Product(name, type, unitPrice) {

        this.name       = name;
        this.type       = type;
        this.unitPrice  = unitPrice;
        this.quantity   = 1;

         // Returns the total saving when a product has a promo
        this.getSaving = function() {

            var discount = CartDB.getDiscount(this);
            var subTotal = this.getSubTotal();

            return parseFloat(subTotal - calcPercentage(subTotal, discount));
        };

        // Returns a promo for the current product or 0
        this.getOff = function() {
            return CartDB.getDiscount(this);
        }

        // Returns the new Unit price
        this.getNewPrice = function() {

          var off       = this.getOff();
          var unitPrice = this.unitPrice;

          return parseFloat(calcPercentage(unitPrice, off));
        }

        // Returns the actual subTotal for this product
        this.getSubTotal = function() {
            return parseFloat(this.unitPrice * this.quantity);
        };

        // returns an HTML representation of a product
        this.HTMLrender = function() {

            var name     = Utilities.replaceAll(this.name, '-', ' ');
            var discount = this.getOff();
            var saving   = this.getSaving();
            var newPrice = this.getNewPrice();
            var newSubT  = (this.getSubTotal() - this.getSaving()).toFixed(2);

            var html = '';

            html += '<tr>                                                  ';
            html += '  <td class="table__td--separator" colspan="7"></td>  ';
            html += '</tr>                                                 ';
            html += '<tr>                                                  ';
            html += '  <td class="table__td text-center">                  ';
            html += '    <a src="#">                                       ';
            html += '      <img class="table__img-thumbnail"               ';
            html += '           src="images/64x64.png"                     ';
            html += '           alt="Product Image"                        ';
            html += '          title="Product Image">                      ';
            html += '    </a>                                              ';
            html += '  </td>                                               ';
            html += '  <td class="table__td text-left">                    ';
            html += '    <a href="#'+ this.name + '">' + name +'</a>       ';
            html += '  </td>                                               ';
            html += '  <td class="table__td text-left">                    ';
            html += '    Unit price:                                       ';

            if (truthy(discount)) {
                html += '    <span class="cart-product-discount             ';
                html += '                 cart-product-discount--price">    ';
                html += '      '+ getCurrency(this.unitPrice) +'            ';
                html += '    </span>                                        ';
                html += '    <span>'+ getCurrency(newPrice) +'</span>       ';
                html += '  </td>                                            ';
                html += '  <td class="table__td text-left">                 ';
                html += '    <span class="cart-product-discount">           ';
                html += '      '+ discount +'% off                          ';
                html += '    </span>                                        ';
            } else {
                html += '    <span>'+ getCurrency(this.unitPrice) +'</span> ';
                html += '  </td>                                            ';
                html += '  <td class="table__td text-left"></td>            ';
            }

            html += '  </td>                                               ';
            html += '  <td class="table__td text-left">                    ';
            html += '    <input class="table__input                        ';
            html += '                  table__input--text"                 ';
            html += '           id="input_'+ this.name + '"                ';
            html += '           name="input-'+ this.name + '"              ';
            html += '           type="text"                                ';
            html += '           data-product-name="' + this.name +'"       ';
            html += '           value="' + this.quantity +'">              ';
            html += '  </td>                                               ';
            html += '  <td class="table__td text-left">                    ';
            html += '    <span class="input-group-btn">                    ';
            html += '    <input class="btn btn-red"                        ';
            html += '           id="remove_'+ this.name + '"               ';
            html += '           type="button"                              ';
            html += '           data-product-name="' + this.name +'"       ';
            html += '           value="Remove">                            ';
            html += '    </span>                                           ';
            html += '  </td>                                               ';
            html += '  <td class="table__td text-right">                   ';
            html += '    <span id="partial-'+ this.name + '"               ';
            html += '          name="partial-'+ this.name + '">            ';
            html +=  getCurrency(discount ? newSubT : this.getSubTotal())   ;
            html += '    </span>                                           ';
            html += '  </td>                                               ';
            html += '</tr>                                                 ';

            return html;
        };
    }

    /*
     * The [changeProductQuantity] adds a product in the shopping cart's  
     * database
     */

    var addProduct = function(htmlElement) {

        var name  = htmlElement.getAttribute("data-product-name"),
            type  = htmlElement.getAttribute("data-product-type"),
            price = htmlElement.getAttribute("data-product-price");

        var table = CartDB.items;
        var newP  = new Product(name, type, price);

        // It tries to retrieve the current product from the Db
        var items = filter(table, function(product) {
            return product.name === name;
        });
        
        // The product is not on the list yet, so add it
        if (items.length === 0) {
            table.push(newP);
        } else {
            items[0].quantity += 1; // updates the product's quantity
        }

       rebuildCartUI();
    }

    /*
     * The [changeProductQuantity] is used for updating the product's quantity   
     * for products which are already in the shopping cart 
     */

    var changeProductQuantity = function(name, newQuantity) {

        var table = CartDB.items;

        // Gets the specific product
        var item = filter(table, function(product) {
            return product.name === name;
        });

        // Sets a new quantity value for the product
        item[0].quantity = newQuantity;
        
        // rebuild the cart
        rebuildCartUI();
    }

    /*
     * The [removeProduct] is used for removing a product from the shopping  
     * cart's database 
     */

    var removeProduct = function(name) {

        var db    = CartDB;
        var table = db.items;

        /*
         * Since the [where] function returs a new Array containing only
         * the resulting elements which make the predicate True, we can 
         * exploit this behavior for associate the resulting Array 
         * to the origin
         */

        db.items = Select(/* all */).from(table).where(function(product) {
            return product.name !== name;
        });

        // rebuild the Shopping Cart UI
        rebuildCartUI();
    }

    /*
     * The [rebuildCartUI] Every time something related to products in the  
     * shopping cart is modified, this function rebuilds the table  
     */

    var rebuildCartUI = function() {

        var prodList = CartDB.getItems();
        var subTotal = 0;
        var saving   = 0;

        // add all products to the Cart
        cartTable.innerHTML = map(prodList, function(product) {
            // Updates the bills
            subTotal += product.getSubTotal();
            saving   += product.getSaving();
            return product.HTMLrender();
        }).join('');

        // Update subTotal and saving
        CartDB.setSubTotal(subTotal);
        CartDB.setSaving(saving);

        // Refresh the Cart User Interface
        refreshCartSummary();
    }

    /*
     * The [refreshCartSummary] function is used to refresh the cart summary 
     * It recalculates the amounts every time something changes in the 
     * shopping cart   
     */

    var refreshCartSummary = function() {

        var db = CartDB;

        var subTotal    = db.getSubTotal(),
            saving      = db.getSaving(),
            shipping    = db.getShippingCost(),
            couponOff   = db.getCouponOff(),
            couponValue = 0,
            totalSaving = 0,
            total       = 0;

        // The Cart is empty
        if (subTotal === 0) {
            // We can safely reset a previous coupon (if any)
            db.resetCoupon();

            // Hide Coupon details (if any)
            couponMessage.innerHTML = '';
            toggle(cartCouponRow, 'node');

            // Hide the Shopping Cart
            toggle(cart, 'none');

            return; // Stop
        }     

        // It re-calculates all the amounts for a correct representation
        couponValue = subTotal - calcPercentage(subTotal, couponOff);
        totalSaving = (saving > couponValue) ? saving : couponValue;
        subTotal    = (saving > couponValue) ? subTotal - saving : subTotal;
        total       = subTotal + shipping - couponValue;

        // Adds the amounts formatted with a currency in the Shoppin Cart Table 
        cartSubTot.innerHTML = getCurrency(subTotal);
        cartTotal.innerHTML  = getCurrency(parseFloat(total).toFixed(2));
        cartCouponVal.innerHTML = getCurrency(couponValue.toFixed(2));

        // Toggles the Shopping Cart (if necessary) 
        toggle(cart, 'block');
    }

    /*
     * The [checkCoupon] function applies a coupon code if valid  
     */

    var checkCoupon = function(coupon) {

        var coupon = couponInput.value;
        var off    = CartDB.checkCoupon(coupon);

        // Initial reset
        couponInput.value = '';

        /*
         *  The checkCoupon method returs:
         * 
         *  -1  if the coupon was not found
         *
         *   0  if the coupon does not make the total price less than the 
         *      total price with the current promo 
         *
         *  {n} if the coupon was applied because it fulfills all the 
         *      requirements 
         */

        switch(off) {

            case -1:

                couponMessage.innerHTML = coupon + ' - invalid coupon code';
                break;

            case 0:

                couponMessage.innerHTML = 'The current promo is better ' + 
                                          'than your coupon ' +
                                          '[ <em>' + coupon +'</em> ]';
                break;

            default:

                cartCoupon.innerHTML = off;
                couponMessage.innerHTML = 'coupon [' + coupon + '] -' +
                                           off + '% off';
                rebuildCartUI();
                toggle(cartCouponRow, 'table-row');
                break;
        }
    }

    /*
     * The [toggle] function toggle an element's visibility  
     */

    function toggle(element, visibility) {

        var display     = (window.getComputedStyle(element, null).display);
        var visibility  = visibility || 'block';

        /*
         * If the provided visibility is the same as the current one, 
         * it does nothing
         */ 
        if (element.style.display === visibility) return;

        element.style.display = (display === 'none') ? visibility : 'none';
    }

    /*
     * The [getCurrency] function returns a price formatted with the currency  
     * symbol which is saved in the database (dollar by default)
     */

    function getCurrency(price, separator) {

        var symbol = CartDB.currencySymbol;

        return symbol + currency(price, separator);
    }

    /*
     * The [currency] function returns a price formatted in one of 
     * these ways :
     * In the US, comma (,) is used as the thousand separator
     * In many European countries, dot (.) is used as the thousand separator 
     * and comma (,) is used as the decimal
     */

    function currency(amount, separator) {

        var amnt      = amount.toString();
        var len       = amnt.length;
        var separator = separator || ",";
        var decimal   = "";

        var remainder,
            partial;

        if (amnt.indexOf(".") !== -1) {
            decimal = amnt.substr(amnt.indexOf("."), 3);
            amnt    = amnt.substr(0, amnt.indexOf("."));
            len    -= 3; // remove decimal part from total length
        }

        if (len < 4) {
            return amnt + decimal;
        } else {
            remainder = amnt.substr(0, len - 3);
            partial   = amnt.substr(len - 3, 3);

            return currency(remainder, separator) + separator + partial + decimal;
        }
    }

    /*
     * Given a value and a percentage, the [calcPercentage] function calculates
     * the resulting value
     */

    function calcPercentage(value, percentage) {
        return (value - ((percentage / 100) * value)).toFixed(2);
    }

    /*
     * This function is used for initializing the shopping cart
     */

    function initialize() {

        var productWrapper = $('#products-wrapper');
        // Gets a list of promos for products of a specific type
        var types = CartDB.getPromoTypes();

        // Adds the promo code (if any) to specific products
        types.map(function(type) {

            var off  = CartDB.getPromoType(type);
            var list;

            list = $$('span[data-product-type="'+ type +'"]');

            Array.prototype.map.call(list, function(product) {

                var span = '';
                span += '<span class="product-promo            '; 
                span += '             product-promo--discount">';
                span +=  off + '% off                          ';
                span += '</span>                               ';

              // Select the parent node
              var pNode = product.parentNode.parentNode.nextSibling.nextSibling;

              // Add the SPAN element
              pNode.innerHTML += span;
            });
        });

        /*
         * Since the product list does not change at run-time, adding an
         * event listener to all the 'ADD TO Cart' button is admissible
         */
        while(len--) {
            addButtons[len].addEventListener('click', function(event) {
                addProduct(this.firstChild.nextSibling);
            })
        }

        // Sets a fixed shipping cost
        cartShipp.innerHTML = getCurrency(CartDB.getShippingCost());

        // Adds some event listener
        couponButton.addEventListener('click', checkCoupon, false);
        cartTable.addEventListener('change', changeEvent, false);
        cartTable.addEventListener('click', removeEvent, false);
    }

    /* 
     * This function is used for handling the change event for the input 
     * textbox related to the products' quantity
     *
     *       ^
     *       | 
     *       |  [DOM EVENT BUBBLING]
     *       |
     *    
     *    Thanks to the DOM Event bubbling, I was able to set only one single 
     *    event listener for each HTML textbox which will be dynamically added 
     *    to the Shopping Cart table.
     *
     */
    function changeEvent(evt) {

        var target    = evt.target;
        var name      = target.getAttribute('data-product-name');
        var quantity  = target.value;

        if (evt.target !== evt.currentTarget) {

            // When the target event is not the same as the target event   
            // listener (which I set as the Table-cart Body element)

            if (!Utilities.isInt(quantity) || (quantity < 0)) {
                // restore the default value 
                target.value = target.defaultValue;
                return; // stop
            } else if (quantity === '0') {
                removeProduct(name);
                return; // stop
            }

              changeProductQuantity(name, quantity);
          }
        evt.stopPropagation(); // It stops the bubbling
    }

    /* 
     * This function is used for handling the remove event caught by a remove 
     * button related to a particular product which is already in the shopping
     * cart
     *
     *       ^
     *       | [DOM EVENT BUBBLING]
     *       |
     *       |
     *    
     *    Thanks to the DOM Event bubbling, I was able to set only one single 
     *    event listener for each HTML button which will be dynamically added 
     *    to the Shopping Cart
     *
     */
    function removeEvent(evt) {
        if (evt.target !== evt.currentTarget) {

          // When the target event is not the same as the event listener current 
          // target (which I set as the Table-cart Body element)

            var clickedItem = evt.target.id;
            // The id we are interested in, is of the form: remove_Product-{N}
            var parts = clickedItem.split('_');
            
            if (parts[0] === 'remove') {
                removeProduct(parts[1]); // parts[1] contains the product name
            }
        }
        evt.stopPropagation(); // It stops the bubbling
    }


  /********************************************************
   *                                                      *
   *           HELPERS AND UTILITY FUNCTIONS              *
   *                                                      *
   *******************************************************/

    function $(selector) {
        return _doc.querySelector(selector);
    }

    function $$(selector) {
        return _doc.querySelectorAll(selector);
    }

    function map(array, callback) {

        // holds the result of map operation  
        var result = [];
        var len     = array.length;
        var i;

        for (i = 0; i < len; i++) {
            result.push(callback(array[i], i));
        }

        return result;
    }

    function reduce(array, callback, initialValue) {

        var current = initialValue;

        var len = array.length,
            i;

        for (i = 0; i < len; i++) {
            current = callback(current, array[i]);
        }
        return current;
    };

    function filter(array, callback){

        //holds the result of filter operation  
        var result = [];
        var len     = array.length;
        var i;

        //for each item apply the callback
        for(i = 0; i < len; i++){
          //if callback returns true then add to the result  
          if(callback(array[i])){
              result.push(array[i]);
          }
        }
        return result;
    }

    /*
     *  FUNCTIONAL HELPERS FUNCTIONS
     */

    function truthy(value) { return !!value; }

    function existy(value) { return value != null };

    function notDefined() { return void 0; }

    /*
     * The [first] function gets an Array and an optional index as arguments, 
     * and returns the first element of the Array (or the element at the 
     * provided index, if any). If the provided index is out of range,
     * it returns the entire Array. If the first argument is not an Array, it  
     * returns the first argument provided to the function.
     * 
     */

    function first(array, idx) {

        var idx = idx || 0;

        if (existy(array[idx])) {
            return array[idx];
        } else {
            return Array.prototype.slice.call(arguments)[0];
        }
    }

    /*
     * The [rest] function gets an Array and an optional index as arguments, 
     * and returns the elements of the Array except the first one (or the  
     * element at the provided index, if any). 
     * If the provided index is out of range, it behaves just as the same as if 
     * the optional index had not been provided.
     */

    function rest(array, idx) {

        var a = Array.prototype;
        return a.slice.call(array, (idx >= 1 && idx <= array.length) ? idx : 1);
    }

    /*
     * The [without] function gets an Array and an arbitrary number of other 
     * arguments, and returns a new Array which does not contain the unwanted 
     * elements. If the first argument is not an Array, it returns an empty
     * Array instead.  
     * 
     * Example usage: 
     *
     *    without([1, 2, 3, 4], 1, 3, 7):
     *    >  [2, 4]
     *
     *    without([1, 2, 3, 4], 3);
     *    > [1, 2, 4]
     */

    function without(Array /* args */) {

        var head = Array,
            tail = rest(arguments);

        if (existy(head) && Utilities.isArray(head)) {
            // removes the unwanted elements
            return filter(head, function(item) {
              return tail.indexOf(item) === -1;
            })
        } else {
            return [];
        }
    }

    /*
     * The [cncat] function gets a variable number of arguments and returns   
     * a chain of elements (a.k.a an Array).
     */

    function cncat(/* args */) {
        // Gets the first argument
        var head = first(arguments);

        if (existy(head)) {
            // It merges both the Head and the tail into a new Array
            return [].concat.apply(head, rest(arguments));
        } else {
            return [];
        }
    }

     /*
      * Constructor Function. Like a SQL-like statement, it represents a
      * select action just like that: SELECT keys FROM list.
      *
      * For instance, it can be used as following: 
      *  
      *     Select(["name", "type"]).from(CartDB.productsDb)
      */

     function Select(keys) {
        // It allows us to invoke this function without the 'new' keyword
        if (!(this instanceof Select)) { 
            return new Select(keys); 
        }

        // A list of keys
        this.keys = keys;

        this.from = function(table) { 
            // if table exists, use the Functional Selection function 
            if (truthy(table)) {
                // it uses its homonymous Functional version
                return fSelect(table, this.keys);
            } else {
              return []; // table does not exist
            }
            
        };
     }

    /*
     * This function gets an Array (table) and a list of keys as arguments.
     * It maps each table's object and for each entry, it applies the Utility 
     * pick function for extracting the desired keys.

     * Since the 'pick' function is applied by using the built-in Javascript
     * 'apply' function which expects as its second parameter an Array of
     * arguments, the 'cncat' helper function is used to concatenate the 
     * actual object with the list of keys.
     *
     * The result of fSelect is an Array of objects containing only the wanted 
     * properties 
     */

    // fSelect :: (Array -> Array) -> Array
    function fSelect(table, keys) {
        return  map(table, function(obj) {
            keys = existy(keys) ? keys : Utilities.keys(obj);
            return Utilities.pick.apply(null, cncat(obj, [keys]));
        });
    }

    /*
     * It augments the Array prototype by adding a "where" method into it.
     * This method gets a predicate function as argument and invokes the  
     * its homonymous Functional version
     * In conjunction with the Select object, it allows to query for the 
     * properties of an object in a SQL-like manner.
     * For example the following SQL query:
     *
     * Select name, type from CartDB.productsDb Where name = 'Product-1'
     *
     * Could be translated into:
     *
     *  Select(["name", "type"]).from(CartDB.productsDb).where(function(prod) {
     *      return prod.name === 'Product-1'
     *  })
     *  
     */

    Array.prototype.where = function(pred) {
        return fWhere(this, pred);
    };

    /*
     * This function gets an Array and a predicate function as arguments and 
     * reduces the list. It returns a new partial 'table' Array everytime the 
     * predicate is true, otherwise it removes the current object from the 
     * resulting 'table'
     */

    // fWhere :: (Array -> Function) -> Array
    function fWhere(table, pred) {
        return reduce(table, function(newTable, obj) {
            if (truthy(pred(obj))) {
                return newTable;
            } else {
                return without(newTable, obj);
          }
        }, table);
    };

    // This function ensures that a provided function (fn) will be called 
    // exactly once
    function once(fn) {

      var _once = false;

      return function () {
          return _once ? void 0 : ((_once = true), fn.apply(this, arguments))
      }
    }


    // Public API
    return {
        initialize: once(initialize)
    }

}

)(window);

// Initialize the shopping cart
Cart.initialize();
});