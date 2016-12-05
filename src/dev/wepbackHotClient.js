/*global __resourceQuery __webpack_public_path__*/

import formatWebpackMessages from './formatWebpackMessage';
import ansiHTML from 'ansi-html';
import { AllHtmlEntities } from 'html-entities';
import stripAnsi from 'strip-ansi';
import styledLog, { joinStyledLogs } from '../utils/styled-log';
import { updateMostRecentCompilationHash, processUpdate } from './webpackHotProcessUpdate';
import { options, FLAG, colors } from './wepbackHotConstants';


const entities = new AllHtmlEntities();

let source;
let lastActivity;
let interval;
let overlayDiv;
let lastOnOverlayDivReady = null;
let overlayIframe = null;

// Remember some state related to hot module replacement.
let isFirstCompilation = true;
let hasCompileErrors = false;


ansiHTML.setColors(colors);

const overlay = {

  createIframe(onIframeLoad) {
    const iframe = document.createElement('iframe');
    iframe.id = 'react-dev-utils-webpack-hot-dev-client-overlay';
    iframe.src = 'about:blank';
    iframe.style.position = 'fixed';
    iframe.style.left = 0;
    iframe.style.top = 0;
    iframe.style.right = 0;
    iframe.style.bottom = 0;
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = 9999999999;
    iframe.onload = onIframeLoad;
    return iframe;
  },

  ensureDivExists(onOverlayDivReady) {
    if (overlayDiv) {
      // Everything is ready, call the callback right away.
      onOverlayDivReady(overlayDiv);
      return;
    }

    // Creating an iframe may be asynchronous so we'll schedule the callback.
    // In case of multiple calls, last callback wins.
    lastOnOverlayDivReady = onOverlayDivReady;

    if (overlayIframe) {
      // We're already creating it.
      return;
    }

    // Create iframe and, when it is ready, a div inside it.
    overlayIframe = overlay.createIframe(function onIframeLoad() {
      overlayDiv = overlay.addDivTo(overlayIframe);
      // Now we can talk!
      lastOnOverlayDivReady(overlayDiv);
    });

    // Zalgo alert: onIframeLoad() will be called either synchronously
    // or asynchronously depending on the browser.
    // We delay adding it so `overlayIframe` is set when `onIframeLoad` fires.
    document.body.appendChild(overlayIframe);
  },

  showError(message) {
    overlay.ensureDivExists(function onOverlayDivReady(overlayDiv) {
      // Make it look similar to our terminal.
      overlayDiv.innerHTML =
        '<span style="color: #' +
        colors.red +
        '">Failed to compile.</span><br><br>' +
        ansiHTML(entities.encode(message));
    });
  },

  addDivTo(iframe) {
    const div = iframe.contentDocument.createElement('div');
    div.id = 'react-dev-utils-webpack-hot-dev-client-overlay-div';
    div.style.position = 'fixed';
    div.style.boxSizing = 'border-box';
    div.style.left = 0;
    div.style.top = 0;
    div.style.right = 0;
    div.style.bottom = 0;
    div.style.width = '100vw';
    div.style.height = '100vh';
    div.style.backgroundColor = 'black';
    div.style.color = '#E8E8E8';
    div.style.fontFamily = 'Menlo, Consolas, monospace';
    div.style.fontSize = 'large';
    div.style.padding = '2rem';
    div.style.lineHeight = '1.2';
    div.style.whiteSpace = 'pre-wrap';
    div.style.overflow = 'auto';
    iframe.contentDocument.body.appendChild(div);
    return div;
  },


  destroy() {
    if (!overlayDiv) {
      // It is not there in the first place.
      return;
    }

    // Clean up and reset internal state.
    document.body.removeChild(overlayIframe);
    overlayDiv = null;
    overlayIframe = null;
    lastOnOverlayDivReady = null;
  }
}


function connect() {
  source = new EventSource(options.path);
  lastActivity = new Date();

  // Set event handlers
  source.onopen    = onOpen;
  source.onmessage = onMessage;
  source.onerror   = onError;

  interval = setInterval(() => {
    if ((new Date() - lastActivity) > options.timeout) {
      onError()
    }
  }, options.timeout / 2)
}

function onMessage(e) {
  let message = {}
  try {
    message = JSON.parse(e.data);
  } catch(err) {}

  if (message.hash) {
    updateMostRecentCompilationHash(message.hash)
  }

  if (message.errors && message.errors.length) {
    message.action = 'errors';
  } else if (message.warnings && message.warnings.length) {
    message.action = 'warnings';
  }

  switch (message.action) {
    case 'building':
      console.log()
      console.log(...joinStyledLogs(FLAG, 'Rebuilding'))
      break;
    case "sync":
      isFirstCompilation = false;
      processUpdate(message.hash, message.modules);
      break;
    case 'built':
      handleSuccess(message);
      break;
    case 'warnings':
      handleWarnings(message.warnings);
      break;
    case 'errors':
      handleErrors(message.errors);
      break;
    default:
      // Do nothing.
  }

  lastActivity = new Date();
}

function onOpen() {
  console.log(...joinStyledLogs(FLAG, 'Connected'))
}

function onError(err) {
  clearInterval(interval);
  source.close();
  //connect()
}

function handleSuccess(message) {
  if (!isFirstCompilation) {
    console.log(...joinStyledLogs(FLAG, 'Built in', styledLog.bold.m(`${Date.now() - lastActivity}ms`)))
  }


  clearOutdatedErrors();
  overlay.destroy();

  let isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    processUpdate(message.hash, message.modules);
  }
}

function handleWarnings(warnings) {
  clearOutdatedErrors();
  overlay.destroy();

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  function printWarnings() {
    // Print warnings to the console.
    for (var i = 0; i < warnings.length; i++) {
      console.warn(stripAnsi(warnings[i]));
    }
  }

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    processUpdate();
  } else {
    // Print initial warnings immediately.
    printWarnings();
  }
}

function handleErrors(errors) {
  clearOutdatedErrors();

  isFirstCompilation = false;
  hasCompileErrors = true;

  // "Massage" webpack messages.
  var formatted = formatWebpackMessages({
    errors: errors,
    warnings: []
  });

  // Only show the first error.
  overlay.showError(formatted.errors[0]);

  // Also log them to the console.
  for (var i = 0; i < formatted.errors.length; i++) {
    console.error(stripAnsi(formatted.errors[i]));
  }

  // Do not attempt to reload now.
  // We will reload on next success instead.
}


function clearOutdatedErrors() {
  // Clean up outdated compile errors, if any.
  if (hasCompileErrors && typeof console.clear === 'function') {
    console.clear();
  }
}

if (typeof window !== 'undefined' && typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}
