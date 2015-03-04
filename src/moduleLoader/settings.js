/* jshint unused:false */
function settings() {
   'use strict';

   var defaults = {
         defaultScope: 'default',
         attribute: 'modules',
         selector: '[modules]'
      },
      actualSettings = defaults;

   function mergeWith(newSettings) {
      merge(actualSettings, newSettings);
   }


   function get() {
      return actualSettings;
   }

   return {
      get: get,
      mergeWith: mergeWith
   };
}