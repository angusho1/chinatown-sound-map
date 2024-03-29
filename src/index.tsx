import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { setupStore } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from "react-router-dom";
import App from 'app/App';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from 'AuthConfig';

/**
* MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
* For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
*/
export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}
 
msalInstance.addEventCallback((event: any) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS) &&
      event.payload.account
  ) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Provider store={setupStore()}>
      <MantineProvider withCSSVariables theme={{
        primaryColor: 'pink',
        primaryShade: 7
      }}>
        <BrowserRouter>
          <App instance={msalInstance} />
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
