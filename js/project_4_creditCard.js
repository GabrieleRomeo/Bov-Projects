'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var valid = validator,
        $     = valid.$;

    var cardList      = $('#list-card').children;
    var selectedCard  = $('#selectedCard');
    var form          = $('#cardForm');

    var inputs = {
        cardNumber: valid.getNode($('#cardNumber')),
        expM:       valid.getNode($('#expirationMonth'), 'expirationMonth'),
        expY:       valid.getNode($('#expirationYear'), 'expirationYear'),
        fullName:   valid.getNode($('#fullName')),
        csv:        valid.getNode($('#csvNumber'), 'csvNumber')
    }

    /*
     * For each card type, defines an Event Listener which will be triggered
     * at every click.
     */

    for (var c in cardList) {
        if (cardList.hasOwnProperty(c)) {
            (function(node){
                node.addEventListener('click', function(event) {
                    resetClass('active');
                    toggleClass(this, 'active');
                });
            })(cardList[c].firstElementChild);
        }
    }

    /*
     * For each input, defines a particular Validator function that must
     * be satisfied to proceed further.
     */

    inputs.cardNumber.setConstraint('The Card Number must be a non-empty ' +
                                 'string of sixteen alphanumeric characters');
    inputs.cardNumber.setValidator(function(elem){

        var value  = elem.node.value;

        try {
            if (!valid.isCreditCard(value)) {
                elem.node.setCustomValidity(elem.constr.value);
            } else {
                elem.resetCustomValidity();
            }
        } catch (err) {
            elem.node.setCustomValidity(elem.constr.value);
        }
    });

    inputs.expM.setConstraint('Please select the Expiration Month');
    inputs.expM.setValidator(function(elem) {

        var node   = elem.node;

        if (valid.isEmpty(node.options[node.selectedIndex].value)) {
            node.setCustomValidity(elem.constr.value);
        } else {
            elem.resetCustomValidity();
        }
    });

    inputs.expY.setConstraint('Please select the Expiration Year');
    inputs.expY.setValidator(function(elem) {

        var node = elem.node;

        if (valid.isEmpty(node.options[node.selectedIndex].value)) {
            node.setCustomValidity(elem.constr.value);
        } else {
            elem.resetCustomValidity();
        }
    });

    inputs.fullName.setConstraint('The Full Name must be a non-empty ' +
                                  'string of at least two words');
    inputs.fullName.setValidator(function(elem){

        var value  = elem.node.value;

        try {
            if (valid.lessWordsThan(value, 1)) {
                elem.node.setCustomValidity(elem.constr.value);
            } else {
                elem.resetCustomValidity();
            }
        } catch (err) {
            elem.node.setCustomValidity(elem.constr.value);
        }
    });

    inputs.csv.setConstraint('Please provide a valid CVC/CCV number \n' +
                             'The last 3 digits on back of the card');
    inputs.csv.setValidator(function(elem){

        var value  = elem.node.value;

        try {
            if (valid.isLength(value, 2) || isNaN(value)) {
                elem.node.setCustomValidity(elem.constr.value);
            } else {
                elem.resetCustomValidity();
            }
        } catch (err) {
            elem.node.setCustomValidity(elem.constr.value);
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
                    input.setInvalidClass();
                    input.constr.check();
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

    //////////////////////// Helper functions \\\\\\\\\\\\\\\\\\\\\\\\

    function toggleClass(node, className) {
        if (valid.contains(node.className, [className])) {
            node.className = node.className.split(className).join('').trim();
            return;
        }

        node.className = node.className + ' ' + className;
        selectedCard.value = node.getAttribute('id');
    }

    function resetClass(className) {
        var node = $('#' + selectedCard.value);

        if (node) {
            toggleClass(node, className);
            return;
        }
    }
});