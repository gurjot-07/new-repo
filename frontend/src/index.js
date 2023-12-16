import App from './App';
import React from 'react';

import { StoreProvider } from './Store';
import { UserProvider } from './components/UserContext';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById('root'));

root.render(
<React.StrictMode>
     <UserProvider>
    <StoreProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StoreProvider>
    </UserProvider>
  </React.StrictMode>
);