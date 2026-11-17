import { JSDOM } from 'jsdom';
import { createRoot } from 'react-dom/client';
import React from 'react';

const dom = new JSDOM(`<!DOCTYPE html><div id="root"></div>`, {
  url: "http://localhost:3000",
  runScripts: "dangerously"
});

global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator });
global.getComputedStyle = dom.window.getComputedStyle;
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

// Setup mock for matchMedia
global.window.matchMedia = global.window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

import App from './src/App.tsx';
import { renderToString } from 'react-dom/server';

try {
  console.log('Mounting App in jsdom...');
  console.log('Testing App SSR string: ', !!renderToString(React.createElement(App)));
  
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement);
  
  root.render(React.createElement(App));
  
  setTimeout(() => {
     console.log('App rendered successfully');
  }, 100);
} catch (e) {
  console.error('Runtime error:', e);
}
