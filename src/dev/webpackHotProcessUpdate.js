import styledLog, { joinStyledLogs } from '../utils/styled-log';
import { options, FLAG, HMR_DOCS_URL, failureStatuses, applyOptions } from './wepbackHotConstants';
import { forEach } from '../utils/object-utils';

let mostRecentCompilationHash = null;

export function updateMostRecentCompilationHash(hash) {
  mostRecentCompilationHash = hash
}

// Is there a newer version of this code available?
export function isUpdateAvailable() {
  /* globals __webpack_hash__ */
  // __webpack_hash__ is the hash of the current compilation.
  // It's a global variable injected by Webpack.
  return mostRecentCompilationHash !== __webpack_hash__;
}

export function isHashUpToDate(hash) {
  /* globals __webpack_hash__ */
  return hash === __webpack_hash__
}

// Webpack disallows updates in other states.
export function canApplyUpdates() {
  return module.hot.status() === 'idle';
}

export function processUpdate(hash, moduleMap) {
  if (!module.hot) {
    // HotModuleReplacementPlugin is not in Webpack configuration.
    window.location.reload();
    return;
  }

  if (!isHashUpToDate(hash) && canApplyUpdates()) {
    check()
  }

  function check() {
    function handleApplyUpdates(err, updatedModules) {
      if (err || !updatedModules) {
        if (options.warn) {
          console.warn(...joinStyledLogs(FLAG, "Cannot find update (Full reload needed)"));
          console.warn(...joinStyledLogs(FLAG, "(Probably because of restarting the server)"));
        }
        return;
      }

      function applyCallback(applyErr, renewedModules) {
        if (applyErr) {
          return handleError(applyErr);
        }

        if (!isHashUpToDate(hash)) {
          return check();
        }

        logUpdates(updatedModules, renewedModules);
      }

      let applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }
    }

    // https://webpack.github.io/docs/hot-module-replacement.html#check
    const result = module.hot.check(false, handleApplyUpdates);

    // Webpack 2 returns a Promise instead of invoking a callback
    if (result && result.then) {
      result.then(
        updatedModules => handleApplyUpdates(null, updatedModules),
        err => handleApplyUpdates(err)
      );
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    const unacceptedModules = updatedModules.filter(moduleId => {
      return renewedModules && renewedModules.indexOf(moduleId) < 0
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(...joinStyledLogs(
          FLAG,
          "The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + HMR_DOCS_URL + " for more details."
        ));

        forEach(unacceptedModules, moduleId => {
          console.warn(...joinStyledLogs(FLAG, moduleMap[moduleId]))
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log(...joinStyledLogs(FLAG, 'Nothing hot updated.'))
      } else {
        console.log(...joinStyledLogs(FLAG, 'Updated modules:'))
        forEach(renewedModules, moduleId => {
          console.log(...joinStyledLogs('\t', styledLog.grey(moduleMap[moduleId])));
        })
      }
    }
  }
}

export function handleError(err) {
  if (module.hot.status() in failureStatuses) {
    if (options.warn) {
      console.warn(...joinStyledLogs(FLAG, "Cannot check for update (Full reload needed)"));
      console.warn(...joinStyledLogs(FLAG, `${err.stack || err.message}`));
    }
    performReload();
    return;
  }
  if (options.warn) {
    console.warn(...joinStyledLogs(FLAG, `Update check failed: ${err.stack || err.message}`));
  }
}

export function performReload() {
  if (options.reload) {
    if (options.warn) console.warn(...joinStyledLogs(FLAG, "Reloading page"));
    window.location.reload();
  }
}
