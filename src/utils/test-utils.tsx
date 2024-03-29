import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import type { AppStore, RootState } from '../app/store';
// As a basic setup, import your same slice reducers
import soundRecordingReducer from '../features/sound-recordings/soundRecordingSlice';
import submissionReducer from '../features/submissions/submissionsSlice';
import audioReducer from '../features/audio/audioSlice';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  route?: string;
  history?: any;
};

export const renderWithProviders = (ui: React.ReactElement,
    {
      preloadedState = {},
      // Automatically create a store instance if no store was passed in
      store = configureStore({
        reducer: {
          soundRecordings: soundRecordingReducer,
          submissions: submissionReducer,
          audio: audioReducer,
        }, 
        preloadedState 
      }),
      route = '/',
      history = createMemoryHistory({initialEntries: [route]}),
      ...renderOptions
    }: ExtendedRenderOptions = {}
  ) => {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
};

// test utils file
export const renderWithRouter = (ui: JSX.Element, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)

  return {
    user: userEvent.setup(),
    ...render(ui, {wrapper: BrowserRouter}),
  }
}

export const customRender = (ui: React.ReactElement,
    {
      preloadedState = {},
      // Automatically create a store instance if no store was passed in
      route = '/',
      store = configureStore({
        reducer: {
          soundRecordings: soundRecordingReducer,
          submissions: submissionReducer,
          audio: audioReducer,
        }, 
        preloadedState 
      }),
      ...renderOptions
    }: ExtendedRenderOptions = {}
  ) => {

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  window.history.pushState({}, 'Test page', route)

  // Return an object with the store and all of RTL's query functions
  return { 
    store, 
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }) 
  };
};