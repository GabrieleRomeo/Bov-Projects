import { types as TYPES } from './uly.functional';
import ULYF from './uly.functional';
import ULYD from './uly.DOM';

'use strict';

const a = {};

const easings = {
  'linear': (t) => {
    return t;
  },
  'easeInQuad': (t) => {
    return t * t;
  },
  'easeOutQuad': (t) => {
    return t * (2 - t);
  },
  'easeInOutQuad': (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  'easeInCubic': (t) => {
    return t * t * t;
  },
  'easeOutCubic': (t) => {
    return (--t) * t * t + 1;
  },
  'easeInOutCubic': (t) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  'easeInQuart': (t) => {
    return t * t * t * t;
  },
  'easeOutQuart': (t) => {
    return 1 - (--t) * t * t * t;
  },
  'easeInOutQuart': (t) => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  'easeInQuint': (t) => {
    return t * t * t * t * t;
  },
  'easeOutQuint': (t) => {
    return 1 + (--t) * t * t * t * t;
  },
  'easeInOutQuint': (t) => {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }
};

/**
 * Get an easing function
 * @param  {String} [easingName]  The easing function's name you are looking for
 * @return {Function} The easing function (if any) or linear (default)
 */
a.getEasing = (easingName = 'linear') => easings[TYPES.str(easingName)];

/**
 * Scroll the window to the element position
 * @param  {Node}   element An HTML node towards which you wish to scroll
                            the window
 * @param  {Object}  options Animation's options (easing type and duration)
 * @param {Function} callback An optional callback
 */

a.scrollTo = (element, options, callback) => {
  options = options || {};
  callback = callback && TYPES.fun(callback);

  let body = ULYD.getBody();
  const start = body.scrollTop;
  const startTime = Date.now();
  const elementTop = ULYD.getElemDistanceFromTop(TYPES.HTMLNode(element));
  const elementH = Math.ceil(ULYD.getElemInfo(element).height / 10) * 10;
  const viewPortHeight = ULYD.getViewPortInfo().height;
  const pageHeight = ULYD.getPageInfo().height;
  const easingName = options.ease;
  const duration = options.duration || 200;
  let destination = elementTop;

  if ((pageHeight - elementH - viewPortHeight) < 0) {
    destination = (pageHeight - (ULYD.getElemDistanceFromTop(element) - elementH / 2)) - 1;
  }

  function scroll() {
    const now = Date.now();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = a.getEasing(easingName)(time);

    body.scrollTop = (timeFunction * (destination - start)) + start;

    console.log(Math.ceil(body.scrollTop), destination);

    if ( Math.ceil(body.scrollTop)  === destination) {
      if (callback) {
        callback();
      }
      return;
    }
    // Invoke the scroll function at constant rate
    requestAnimationFrame(scroll);
  }
  // Call scroll to start the scrolling
  scroll();
};


export default { ...a };