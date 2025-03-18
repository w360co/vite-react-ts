import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {rootSlices} from "./store";
import StoreProvider from "./lib/store/StoreProvider.tsx";

const appKey = import.meta.env.VITE_APP_KEY;

const storeConfig = {
    keyName: 'my-app-v1',
    secretKey: appKey ?? 'my-secret-key',
    slices: rootSlices
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <StoreProvider config={storeConfig} >
          <App />
      </StoreProvider>
  </StrictMode>
);
