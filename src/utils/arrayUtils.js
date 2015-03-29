/**
 * Iterates the array and callback function for each element.
 *
 * @param {Array} array the array to iterate
 * @param {function} callback the callback function:
 *      - first parameter delivers the current index, second the current element
 *      - if the callback function returns true the iteration breaks up immediately
 */
/*exported each */
function each(array, callback) {
   'use strict';

   var index,
      length = array.length,
      element,
      breakLoop;

   for (index = 0; index < length; index++) {
      element = array[index];

      breakLoop = callback(index, element);

      if (breakLoop) {
         break;
      }
   }
}

/**
 * Indicates if the specified element looking for is containing in the specified array.
 * @param array the array to lookup
 * @param elementToSearch the element to lookup
 * @returns {boolean} true if the array contains the element, false if not
 */
/*exported contains */
function contains(array, elementToSearch) {
   'use strict';

   var index,
      length = array.length,
      element,
      isContaining = false;

   for (index = 0; index < length; index++) {
      element = array[index];

      if (element === elementToSearch) {
         isContaining = true;
         break;
      }
   }

   return isContaining;
}

/**
 * Indicates if the passed object is an Array.
 *
 * @param object the object which will be checked to be an Array
 * @returns {boolean} true if the passed object is an Array, false if not
 */
/*exported isArray */
function isArray(object) {
   'use strict';

   return toString.call(object) === '[object Array]';
}