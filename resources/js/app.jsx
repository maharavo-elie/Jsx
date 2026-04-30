import React from 'react';
import ReactDOM from 'react-dom/client';
import BanqueApp from './components/banqueApp'
import Dashboard from './components/dashboard';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
      <BanqueApp />
  </React.StrictMode>
);
