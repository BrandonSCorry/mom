/* jshint unused:false */
function partBuilder(partAccess, moduleSystemSettings) {
   'use strict';

   function returnsDescriptor(name) {
      var descriptor = creatorDescriptor(name);
      descriptor.type = 'returns';
      descriptor.scope = 'default';

      descriptor.returns = undefined;

      return descriptor;
   }
   
   
   function createPart(name) {
      var descriptor;

      return {
         settings: addSettings,
         dependencies: addDependencies,
         creator: addCreator,
         returns: addReturns,
         scope: addScope
      };

      function addCreator(creator) {
         getOrInitCreatorDiscriptor().creator = creator;
         save();
      }

      function addReturns(returns) {
         descriptor = returnsDescriptor(name);
         descriptor.returns = returns;
         save();
      }

      function addScope(scope) {

         var descriptor = getOrInitCreatorDiscriptor();

         if (scope !== undefined) {
            descriptor.scope = scope;
         }

         return {
            settings: addSettings,
            dependencies: addDependencies,
            creator: addCreator,
            returns: addReturns
         };
      }

      function addSettings(settings) {
         getOrInitCreatorDiscriptor().settings = settings;

         return {
            dependencies: addDependencies,
            creator: addCreator
         };
      }

      function addDependencies(dependencies) {
         getOrInitCreatorDiscriptor().dependencies = dependencies;

         return {
            settings: addSettings,
            creator: addCreator
         };
      }

      function getOrInitCreatorDiscriptor() {
         if (descriptor === undefined) {
            descriptor = creatorDescriptor(name);
            descriptor.scope = moduleSystemSettings.defaultScope;
         }

         return descriptor;
      }

      function save() {
         partAccess.addPartDescriptor(descriptor);
      }
   }


   return createPart;
}