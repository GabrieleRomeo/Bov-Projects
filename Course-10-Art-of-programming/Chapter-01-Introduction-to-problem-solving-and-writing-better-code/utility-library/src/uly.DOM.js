import { types as TYPES } from './uly.functional';
import ULYF from './uly.functional';

'use strict';

const { curry } = ULYF;
const d = {};


/**
 * Queries the DOM looking for the first HTML element
 * that matches the CSS query
 *
 * @param {string} selector A valid CSS selector
 * @param {string} [context] The ancestor where to start the research from
 *
 * @returns {object} The HTML object or null
 */

d.$ = (selector, context) => (context || document).querySelector(TYPES.str(selector));


/**
 * Queries the DOM looking for all the HTML elements
 * that match the CSS query
 *
 * @param {string} selector A valid CSS selector
 * @param {string} [context] The ancestor where to start the research from
 *
 * @returns {object} The HTML object or null
 */

d.$$ = (selector, context) => (context || document).querySelectorAll(TYPES.str(selector));

/**
 * Find the nearest ancestor that matches any CSS selector with respect
 * to a given element
 *
 * @param {HTMLNode} elem The HTML element to start from
 * @param {string} select The ancestor where to start the research from
 *
 * @returns {object} The HTML object or null
 */

d.getAncestorBySelector = (elem, selector) => {
    // Element.matches polyfill
  if (!Object.prototype.matches) {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (i >= 0 && matches.item(i) !== this) {
            --i;
          }
          return i > -1;
        };
    }
  }

  // Get closest match
  for ( ; TYPES.HTMLNode(elem) && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches(TYPES.str(selector)) ) {
      return elem;
    }
  }

  return null;
};


/**
 * Return document.documentElement for Chrome and Safari, document.body otherwise
 * @return {Node}      document.documentElement or document.body
 */

d.getBody = () => {
  let body;
  document.documentElement.scrollTop += 1;
  body = ( document.documentElement.scrollTop !== 0 ) ?
                            document.documentElement  :
                            document.body;
  document.documentElement.scrollTop -= 1;
  return body;
};

/**
 * Get the element's distance from the top of the page
 * @param  {Node}  elem  The element
 * @return {Number}      An integer representing the distance from the of the page
 */
d.getElemDistanceFromTop = function(elem) {
  let location = 0;
  if ( TYPES.HTMLNode(elem).offsetParent ) {
    do {
      location += elem.offsetTop;
      elem = elem.offsetParent;
    } while ( elem );
  }
  return location >= 0 ? location : 0;
};

/**
 * Get all siblings of an element (if any)
 * @param  {String}  selector A valid CSS selector
 * @return {Array}   An array containing the siblings
 */
d.getSiblingsBySelector = (selector) => {
  const siblings = [];
  const elem = document.querySelector(TYPES.str(selector));
  let sibling = elem.parentNode.firstChild;

  // Get siblings
  for ( ; sibling; sibling = sibling.nextSibling ) {
    if ( sibling.nodeType === 1 && sibling !== elem ) {
      siblings.push( sibling );
    }
  }

  return siblings;
};

/**
 * Insert a new node after an existing node in the DOM
 * @param  {Node}  newNode The element you wish to insert
 * @param  {Node}  refNode The existing node in the DOM
 * @return {Node}  The element that was inserted
 */
d.insertAfter = (newNode, refNode) => {
  const p = refNode.parentNode;
  return p.insertBefore(TYPES.HTMLNode(newNode), TYPES.HTMLNode(refNode.nextSibling));
};

/**
 * Swap the position of two DOM elements
 * @param  {Node}  nodeA The first node
 * @param  {Node}  nodeB The second node
 * @return {Boolean}  It returns true if the swap was successful
 *                    and false otherwise
 */
d.swapElements = (nodeA, nodeB) => {
  const parentA = TYPES.HTMLNode(nodeA).parentNode;
  const parentB = TYPES.HTMLNode(nodeB).parentNode;
  let success = null;

  try {
    parentA.replaceChild(nodeB.cloneNode(true), nodeA);
    parentB.replaceChild(nodeA.cloneNode(true), nodeB);
    success = true;
  } catch (e) {
    success = false;
  }

  return success;
};

/**
 * Remove a number of elements from the page entirely
 * @param  {String}  selector A valid CSS selector
 * @return {Array}   An array containing the removed elements
 */
d.removeAll = (selector) => {
  const elements = Array.from(d.$$(selector) || []);
  elements.forEach((element) => element.parentNode.removeChild(element));
  return elements;
};

/**
 * Get the values a calculated CSS property for an element after applying
 * the active stylesheets
 * @param  {Node}   element The element for which to get the computed style
 * @return {CSSStyleDeclaration }
 */
d.getComputed = (element) => (property) => {
  return window.getComputedStyle(TYPES.HTMLNode(element), null)
               .getPropertyValue(TYPES.str(property));
};

/**
 * Get ViewPort's Info
 */
d.getViewPortInfo = () => {
  const body = d.getBody();
  const width = Math.max(body.clientWidth, window.innerWidth || 0);
  const height = Math.max(body.clientHeight, window.innerHeight || 0);
  return {
    height,
    width,
  };
};

/**
 * Get Page's Info
 */
d.getPageInfo = () => {
  const body = document.body;
  const html = document.documentElement;
  const height = Math.max(body.scrollHeight, body.offsetHeight,
                          html.clientHeight, html.scrollHeight,
                          html.offsetHeight);
  const width = Math.max(body.scrollWidth, body.offsetWidth,
                          html.clientWidth, html.scrollWidth,
                          html.offsetWidth);

  return {
    height,
    width,
  };
};

/**
 * Get Element's Info
 */
d.getElemInfo = (element) => TYPES.HTMLNode(element).getBoundingClientRect();


// export public functions
export default { ...d };