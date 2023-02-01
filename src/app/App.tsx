import './App.css';
import { AppNavBar, AppNavBarProps } from 'app/components/nav-bar/AppNavBar';
import AppRoutes from './App.routes';
import { EventType, IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { useEffect } from 'react';
import { AudioPlayerProvider } from 'react-use-audio-player';

interface AppProps {
  instance: IPublicClientApplication;
}

function App({ instance }: AppProps) {
  const links: AppNavBarProps["routes"] = [
    {
      url: 'about',
      label: 'About'
    },
    {
      url: 'contribute',
      label: 'Contribute'
    },
    {
      url: 'contact',
      label: 'Contact'
    }
  ]
  
  useEffect(() => {
      const callbackId = instance.addEventCallback((event: any) => {
          if (
              (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
              event.payload.account
          ) {

          }

          if (event.eventType === EventType.LOGIN_FAILURE) {
              // Check for forgot password error
              // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
              if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
                  console.log('Login failure');
              }
          }
      });

      return () => {
          if (callbackId) {
              instance.removeEventCallback(callbackId);
          }
      };
      // eslint-disable-next-line
  }, [instance]);

  return (
    <MsalProvider instance={instance}>
      <div className="App">
        <AudioPlayerProvider>
          <AppNavBar routes={links} />
          <AppRoutes />
        </AudioPlayerProvider>
      </div>
    </MsalProvider>
  );
}

export default App;
