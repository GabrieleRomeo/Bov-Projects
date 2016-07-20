'use strict';

document.addEventListener('DOMContentLoaded', function (e) {

      var valid = Validators;
      var form  = $('#shippingForm');
      var same  = $('#use_B_address');


    var inputs = {
        S_firstName: valid.getNode($('#S_firstName'), 'firstName'),
        S_lastName:  valid.getNode($('#S_lastName'),  'lastName'),
        S_address:   valid.getNode($('#S_address')),
        S_city:      valid.getNode($('#S_city')),
        S_country:   valid.getNode($('#S_country')),
        B_firstName: valid.getNode($('#B_firstName'), 'firstName'),
        B_lastName:  valid.getNode($('#B_lastName'), 'lastName'),
        B_address:   valid.getNode($('#B_address')),
        B_city:      valid.getNode($('#B_city')),
        B_country:   valid.getNode($('#B_country'))
    }

      var firstNameValidator = (function(elem){

          var constr = elem.constr;
          var value  = elem.node.value;

          if (valid.isLength(value, 2)) {
                elem.node.setCustomValidity(constr.value);
          } else {
                elem.resetCustomValidity();
          }

      });

      var lastNameValidator = (function(elem){

          var constr = elem.constr;
          var value  = elem.node.value;

          if (valid.isLength(value, 2)) {
                elem.node.setCustomValidity(constr.value);
          } else {
                elem.resetCustomValidity();
          }

      });

      var addressValidator = (function(elem){

          var constr = elem.constr;
          var value  = elem.node.value;

          try {
              if (!valid.moreWordsThan(value, 2)) {
                  elem.node.setCustomValidity('A valid address is composed ' + 
                                              'at least two words');
              } else {
                  elem.resetCustomValidity();
              }
          } catch (err) {}

      });

      var cityValidator = (function(elem){

          var constr = elem.constr;
          var value  = elem.node.value;

          try { 
              if (valid.isLength(value, 2)) {
                  elem.node.setCustomValidity('The minimum length of this ' + 
                                              'field should be at least of ' + 
                                              ' three characters');
              } else {
                  elem.resetCustomValidity();
              }
          } catch (err) {
                elem.node.setCustomValidity(constr.value);
          }

      });

      var countryValidator = (function(elem){

          var constr = elem.constr;
          var value  = elem.node.value;

          try {
            if (valid.isLength(value, 2)) {
                  elem.node.setCustomValidity('The minimum length of this ' + 
                                              'field should be at least of ' + 
                                              ' three characters');
            } else {
                elem.resetCustomValidity();
            }
          } catch (err) {
                elem.node.setCustomValidity(constr.value);
          }

      });

      /*
       * For each input, defines a particular Validator function that must 
       * be satisfied to proceed further. 
       */

      inputs.S_firstName.setValidator(firstNameValidator);
      inputs.B_firstName.setValidator(firstNameValidator);

      inputs.S_lastName.setValidator(lastNameValidator);
      inputs.B_lastName.setValidator(lastNameValidator);


      inputs.S_address.setValidator(addressValidator);
      inputs.B_address.setValidator(addressValidator);

      inputs.S_city.setValidator(cityValidator);
      inputs.B_city.setValidator(cityValidator);


      inputs.S_country.setValidator(countryValidator);
      inputs.B_country.setValidator(countryValidator);


      /* Sets an initial custom validity for every input 
       * All the indicated inputs are not valid by default
       */

      for (var input in inputs) {
        if (inputs.hasOwnProperty(input)) {
          if (inputs[input].constr.isRequired) {
            inputs[input].node.setCustomValidity(
                                              inputs[input].constr.constrValue);
          }

          // Using a closure, it defines a custom event listener for every
          // single inputs object
          (function(input) {
            input.node.addEventListener('change', function (event) {

                var constr  = input.constr;
                var id      = input.node.getAttribute('id');
                var billInp = id.replace(/S/,'B');

                input.setInvalidClass();
                constr.check();

                if (id.indexOf('S_') === 0) { 
                    /* Every time the checkbox is checked, it copies the value 
                     * of the current 'shipping' input into the corresponding 
                     * billing input
                     */
                    if (same.checked) {
                      $('#' + billInp).value = input.node.value;
                    }
                }
            })
          })(inputs[input]);
        }
      }

      // Copies the billing info into the corresponding shipping inputs
      same.addEventListener('change', function (event) {

        var _self = this;

          // Sets the change event for all the radio buttons
          var newObject = Object.keys(inputs).map(function(elem) {

              var billInp = elem.replace(/S/,'B');

              if (_self.checked && !valid.isEmpty(inputs[elem].node.value)) {
                  $('#' + billInp).value = inputs[elem].node.value;
              } else {
                  $('#' + billInp).value = '';
              }
          });

          if (this.checked) {

          }
      });

      form.addEventListener('submit', function (event) {

      // Check the inputs validity. If at least one input is invalid, stop
      // the form
      for (var input in inputs) {
          if (inputs.hasOwnProperty(input)) {
              if (!inputs[input].node.validity.valid) {
                  event.preventDefault();
              }
          }
      }

      }, false);

  /********************************************************
   *                                                      *
   *                UTILITY FUNCTION                      *
   *                                                      *
   *******************************************************/

    function $(selector) {
        return document.querySelector(selector);
    }

});