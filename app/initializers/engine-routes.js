import manifest from '../config/asset-manifest';
import jsAssetLoader from 'ember-asset-loader/loaders/js';
import RSVP from 'rsvp';

const ROUTES_FILE_REGEX = /routes([\-][a-z0-9]+)?\.js$/;

function getManifestRoutes() {
  // Array to hold manifest routes
  var manifestRoutes = [];
  // Get bundles from asset manifest
  var manifestBundles = manifest.bundles;
  // Loop through bundles in asset manifest
  for (var bundleKey in manifestBundles) {
    // Get bundle assets
    var bundleAssets = manifestBundles[bundleKey].assets;
    // Loop through assets to find any routes.js files
    bundleAssets.forEach((bundleAsset) => {
      // Check if the asset is a routes.js file
      if (bundleAsset.type === 'js' && ROUTES_FILE_REGEX.test(bundleAsset.uri)) {
        // Asset is a routes.js file, push asset URI into manifestRoutes
        manifestRoutes.push(bundleAsset.uri);
      }
    });
  }
  // Return manifestRoutes
  return manifestRoutes;
}

export function initialize(application) {
  // Get manifest routes
  var manifestRoutes = getManifestRoutes();
  // Return if manifest doesn't have any routes.js files to load
  if (manifestRoutes.length === 0) {
    return;
  }
  // Pause application initialization until engine routes are loaded
  application.deferReadiness();
  // Define manifestRoutePromises, this holds the promises for the routes being
  // loaded
  var manifestRoutePromises = [];
  // Process manifestRoutes
  manifestRoutes.forEach(function(manifestRoute) {
    // Load manifestRoute
    var manifestRoutePromise = jsAssetLoader(manifestRoute);
    // Push manifestRoutePromise into manifestRoutePromises
    manifestRoutePromises.push(manifestRoutePromise);
  });
  // Wait until all of the routes.js files have been loaded until we resume the
  // applications initialization
  RSVP.all(manifestRoutePromises).then(function() {
    application.advanceReadiness();
  });
}

export default {
  name: 'engine-routes',
  initialize
};
