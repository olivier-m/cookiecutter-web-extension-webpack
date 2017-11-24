'use strict';

import {settings, getSettings} from '../lib/settings';

const $ = document.querySelector.bind(document);
const $e = document.createElement.bind(document);
const $t = document.createTextNode.bind(document);

const msg = $('#message');

// Set a body class with browser name
if (typeof chrome.runtime.getBrowserInfo === 'undefined') {
  document.body.classList.add('chrome');
} else {
  browser.runtime.getBrowserInfo().then(r => {
    document.body.classList.add(r.name.toLowerCase());
  });
}

var msg_timeout = -1;
const saveSettings = function() {
  window.clearTimeout(msg_timeout);
  msg.style.opacity = 0;

  let obj = {};
  for (let k of Object.keys(settings)) {
    if (settings[k].type == 'checkbox') {
      obj[k] = $(`#${k}`).checked;
    } else if (settings[k].type == 'radio') {
      let el = $(`input[type="radio"][name="${k}"]:checked`);
      if (el) {
        obj[k] = el.value;
      }
    } else {
      obj[k] = $(`#${k}`).value;
    }
  }

  chrome.storage.local.set({
    'settings': obj
  });

  msg.style.opacity = 1;
  msg_timeout = window.setTimeout(() => {
    msg.style.opacity = 0;
  }, 1000);
};

const insertText = function(el, k, setting, value) {
  let label = $e('label');
  label.setAttribute('for', k);
  label.textContent = setting.label;

  let input;
  if (setting.type == 'textarea') {
    input = $e('textarea');
    input.setAttribute('rows', setting.rows || 4);
  }
  else {
    input = $e('input');
    input.setAttribute('type', 'text');
  }
  input.id = k;
  input.value = value;

  el.appendChild(label);
  el.appendChild(input);

  input.addEventListener('change', saveSettings);
};

const insertCheckbox = function(el, k, setting, value) {
  let label = $e('label');
  label.setAttribute('for', k);
  label.textContent = setting.label;

  let input = $e('input');
  input.setAttribute('type', 'checkbox');
  input.id = k;
  input.checked = value;

  el.appendChild($e('span'));
  let c = $e('div');
  c.appendChild(input);
  c.appendChild($t(' '));
  c.appendChild(label);
  el.appendChild(c);

  input.addEventListener('change', saveSettings);
};

const insertRadioChoices = function(el, k, setting, value) {
  let s = $e('label');
  s.textContent = setting.label;

  el.appendChild(s);

  let c = $e('div');
  c.classList.add('radio-container');
  el.appendChild(c);

  for (let name of Object.keys(setting.choices)) {
    let val = setting.choices[name];
    let radio = $e('input');
    let label = $e('label');
    label.classList.add('pointer');

    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', k);
    radio.checked = val == value;
    radio.value = val;

    label.appendChild(radio);
    label.appendChild($t('\u202F' + name));
    c.appendChild(label);
    c.appendChild($t('\u2003'));

    radio.addEventListener('change', saveSettings);
  }
};

const insertSelectChoices = function(el, k, setting, value) {
  let label = $e('label');
  label.setAttribute('for', k);
  label.textContent = setting.label;

  let select = $e('select');
  select.id = k;

  for (let name of Object.keys(setting.choices)) {
    let val = setting.choices[name];
    let option = $e('option');
    option.value = val;
    option.selected = val == value;
    option.appendChild($t(name));
    select.appendChild(option);
  }

  el.appendChild(label);
  el.appendChild(select);

  select.addEventListener('change', saveSettings);
};

getSettings().then(result => {
  let main = $('#options');

  for (let k of Object.keys(settings)) {
    let el = $e('div');
    el.className = 'field';
    main.appendChild(el);

    if (['text', 'textarea'].includes(settings[k].type)) {
      insertText(el, k, settings[k], result[k]);
    }
    else if (settings[k].type == 'checkbox') {
      insertCheckbox(el, k, settings[k], result[k]);
    }
    else if (settings[k].type == 'radio') {
      insertRadioChoices(el, k, settings[k], result[k]);
    }
    else if (settings[k].type == 'select') {
      insertSelectChoices(el, k, settings[k], result[k]);
    }
  }
});
