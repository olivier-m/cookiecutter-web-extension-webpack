'use strict';

import * as settings_json from '../settings.json';
export const settings = settings_json;

const defaults = Object.keys(settings).reduce((p, c) => {
  p[c] = settings[c].default;
  return p;
}, {});


export const getSettings = function() {
  return new Promise((resolve) => {
    chrome.storage.local.get('settings', function(result) {
      if (typeof result.settings !== 'undefined') {
        resolve(Object.assign({}, defaults, result.settings));
      }
      else {
        resolve(Object.assign({}, defaults));
      }
    });
  });
};
