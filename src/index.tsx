import React from 'react';
import App from './component/App'
import './style/main.scss'

import { createRoot } from 'react-dom/client'

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<App />);
