'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var valid  = validator,
        $      = valid.$,
        $$     = valid.$$;

    var signupForm  = $('#questionnaire');
    var options     = $$('[name="option"]');

    var inputs = {
        otherValue: valid.getNode($('#otherValue'))
    };

      // Sets the change event for all the radio buttons
    Object.keys(options).map(function(elem) {
        options[elem].addEventListener('change', function () {

            var input     = inputs.otherValue;
            var classHidd = 'list__input--hidden';
            var re        = new RegExp(classHidd);
            var className = input.node.className.replace(re,'');

        /*
         * When the radio button with ID 'other' is selected we need
         * to set the constraint for the otherValue textbox
         */
            if (this.getAttribute('id') === 'other' && this.checked) {
                input.node.setCustomValidity(input.constr.value);
                input.node.className = className;
            } else {
                if (!valid.contains(input.node.className, ['hidden'])) {
                    input.node.className += ' ' + classHidd;
                    inputs.otherValue.node.value = '';
                    input.resetCustomValidity();
                }
            }
        });
    });

    inputs.otherValue.setValidator(function(elem) {

        var node   = elem.node,
            constr = elem.constr,
            value  = node.value;

        if (valid.isEmpty(value)) {
            node.setCustomValidity(constr.value);
        } else if (!valid.isOfLength(value, 2)) {
            node.setCustomValidity('The length of this field should ' +
                                   'not be lower than two characters');
        }
        else {
            elem.resetCustomValidity();
        }
    });


    inputs.otherValue.node.addEventListener('change', function () {
        var node   = inputs[this.getAttribute('id')];

        node.setInvalidClass();
        node.constr.check();
    });


    signupForm.addEventListener('submit', function (event) {
        // Check the validity. If at least one input is invalid, stop
        // the submit event
        for (var input in inputs) {
            if (inputs.hasOwnProperty(input)) {
                if (!inputs[input].node.validity.valid) {
                    event.preventDefault();
                }
            }
        }
    }, false);
});