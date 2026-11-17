import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App';

try {
  renderToString(React.createElement(App));
  console.log("Render App successful");
} catch (e) {
  console.error("Render App failed", e);
}
