import { configureStore, ThunkAction, Action, PreloadedState, combineReducers } from '@reduxjs/toolkit';
import soundRecordingReducer from '../features/sound-recordings/soundRecordingSlice';
import submissionReducer from '../features/submissions/submissionsSlice';
import audioReducer from '../features/audio/audioSlice';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  soundRecordings: soundRecordingReducer,
  submissions: submissionReducer,
  audio: audioReducer,
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
