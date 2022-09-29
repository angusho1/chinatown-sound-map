import { configureStore, ThunkAction, Action, PreloadedState, combineReducers } from '@reduxjs/toolkit';
import soundClipReducer from '../features/sound-clips/soundClipSlice';
import submissionReducer from '../features/submissions/submissionsSlice';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  soundClips: soundClipReducer,
  submissions: submissionReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
