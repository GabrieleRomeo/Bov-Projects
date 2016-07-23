'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var valid = validator,
        $     = valid.$;
    var form  = doc.getElementById('scheduleForm');

    var inputs = {
        evtName:  valid.getNode(doc.getElementById('evtName')),
        date:     valid.getNode(doc.getElementById('date')),
        timezone: valid.getNode(doc.getElementById('timezone')),
        contact:  valid.getNode(doc.getElementById('contact')),
        email:    valid.getNode(doc.getElementById('email'))
    }

      /*
       * For each input, defines a particular Validator function that must
       * be satisfied to proceed further.
       */

    inputs.evtName.setConstraint('The Event Name must be a non-empty ' +
                                   'string of at least four characters');
    inputs.evtName.setValidator(function(elem){

        var constr = elem.constr;
        var value  = elem.node.value;

        try {
            if (valid.isLength(value, 3)) {
                elem.node.setCustomValidity(constr.value);
            } else {
                elem.resetCustomValidity();
            }
        } catch (err) {
            elem.node.setCustomValidity(constr.value);
        }
    });

    inputs.date.setValidator(function(elem){

        var constr = elem.constr;
        var value  = elem.node.value;

        try {
            if (!valid.isDate(value)) {
                elem.node.setCustomValidity('Please provide a valid date');
            } else if (valid.isBeforeToday(value)) {
                elem.node.setCustomValidity('The specified date is before ' +
                                            'today');
            } else {
                elem.resetCustomValidity();
            }
        } catch (err) {
            elem.node.setCustomValidity(constr.value);
        }
    });

    inputs.timezone.setConstraint('Please, select at least one Time-zone');
    inputs.timezone.setValidator(function(elem) {
        var constr = elem.constr;
        var node   = elem.node;

        if (valid.isEmpty(node.options[node.selectedIndex].value)) {
            node.setCustomValidity(constr.value);
        } else {
            elem.resetCustomValidity();
        }
    });

    inputs.contact.setConstraint('Please provide a valid Italian phone number');
    inputs.contact.setValidator(function(elem){
        var constr = elem.constr;
        var value  = elem.node.value;

        try {
            if (!valid.isPhoneNumber(value)) {
                elem.node.setCustomValidity(constr.value);
            } else {
                elem.resetCustomValidity();
            }
        } catch (err) {
            elem.node.setCustomValidity(err);
        }
    });

    inputs.email.setConstraint('Please provide a valid email');
    inputs.email.setValidator(function(elem){

        var constr = elem.constr;
        var value  = elem.node.value;

        try {
            if (!valid.isEmailAddress(value)) {
                elem.node.setCustomValidity(constr.value);
            } else {
                elem.resetCustomValidity();
            }
        } catch (err) {
            elem.node.setCustomValidity(err);
        }
    });

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
                    input.setInvalidClass();
                    constr.check();
                })
            })(inputs[input]);
        }
    }


    form.addEventListener('submit', function (event) {
        // Check the inputs validity. If at least one input is invalid, stop
        // the event propagation
        for (var input in inputs) {
            if (inputs.hasOwnProperty(input)) {
                if (!inputs[input].node.validity.valid) {
                    event.preventDefault();
                }
            }
        }
    }, false);
});