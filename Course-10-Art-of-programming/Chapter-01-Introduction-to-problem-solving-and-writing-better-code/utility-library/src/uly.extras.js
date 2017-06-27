import { types as TYPES } from './uly.functional';
import ULYU from './uly.utilities';
import ULYF from './uly.functional';

'use strict';

const e = {};
const { isArray, indexOf } = ULYU;
const { not } = ULYF;

e.EventEmitter = class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (not(isArray(this.events[event]))) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  removeListener(event, listener) {
    if (isArray(this.events[event])) {
      let idx = indexOf(this.events[event], listener);

      if ( idx > -1 ) {
        this.events[event].splice( idx, 1 );
      }
    }
  }

  emit(event) {
    const args = [].slice.call( arguments, 1 );

    if (isArray(this.events[event])) {
      let listeners = this.events[event].slice();
      let length    = listeners.length;

      for (let i = 0; i < length; i++) {
        listeners[i].apply( this, args );
      }
    }
  }

  once(event, listener) {
    this.on(event, function g() {
      this.removeListener(event, g);
      listener.apply(this, arguments);
    });
  }
};

e.Queue = class Queue extends e.EventEmitter {
  constructor() {
    super();
    this.arr  = [];
  }

  /**
   * Add an item at the end of the queue.
   * It emits the `enqueue` event
   *
   * @param      {Value}  item    The item to be added into the Queue
   */
  enqueue(item) {
    this.arr.push(item);
    this.emit('enqueue', item);
  }

  /**
   * Remove the item at the head of the queue
   * It emits the `dequeue` and the `empty` events
   * @return     {Value}  The first item of the Queue
   */
  dequeue() {
    const item = this.arr.shift();
    this.emit('dequeue', item);
    if (this.isEmpty()) {
      this.emit('empty');
    }
    return item;
  }

  /**
   * Determines if empty.
   *
   * @return     {boolean}  True if empty, False otherwise.
   */
  isEmpty() {
    return this.arr.length === 0;
  }
};

e.Stack = class Stack extends e.EventEmitter {
  constructor() {
    super();
    this.arr  = [];
  }

  /**
   * Add an item onto the Stack
   * It emits the `push` event
   * @param      {Value}  item    The item to be added onto the Stack
   */
  push(item) {
    this.arr.push(item);
    this.emit('push', item);
  }

  /**
   * Remove the last item of the Stack
   * It emits the `pop` and the `empty`  events
   * @return     {Value}  The last item of the Stack
   */
  pop() {
    const item = this.arr.pop();
    this.emit('pop', item);
    if (this.isEmpty()) {
      this.emit('empty');
    }
    return item;
  }

  /**
   * Determines if empty.
   *
   * @return     {boolean}  True if empty, False otherwise.
   */
  isEmpty() {
    return this.arr.length === 0;
  }
};


// export public functions
export default { ...e };