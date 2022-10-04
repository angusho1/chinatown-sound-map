import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import SoundClip from 'models/SoundClip.model';
import SoundRecording from 'models/SoundRecording.model';
import { SetSoundRecordingFilePayload } from 'types/actions/sound-recording-actions.types';
import { SoundRecordingFileMap } from 'types/state/sound-recording-state.types';
import { NetworkRequestStatus } from 'types/state/state.types';
import { getSoundClips, getSoundRecordings } from './soundClipAPI';

export interface SoundClipState {
    soundClips: SoundClip[];
    soundRecordings: SoundRecording[];
    status: NetworkRequestStatus;
    soundRecordingFiles: SoundRecordingFileMap;
}

const initialState: SoundClipState = {
    soundClips: [],
    soundRecordings: [],
    status: 'idle',
    soundRecordingFiles: {}
}

export const fetchSoundRecordings = createAsyncThunk('soundClips/fetchSoundRecordings',
    async () => {
        const res: SoundRecording[] = await getSoundRecordings();
        return res;
    }
);

export const fetchSoundClips = createAsyncThunk('soundClips/fetchSoundClips',
    async () => {
        const res: SoundClip[] = await getSoundClips();
        return res;
    }
);

export const soundClipSlice = createSlice({
    name: 'soundClips',
    initialState,
    reducers: {
        setSoundRecordingFile(state, action: PayloadAction<SetSoundRecordingFilePayload>) {
            state.soundRecordingFiles[action.payload.recordingId] = action.payload.fileSrc;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSoundClips.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(fetchSoundClips.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.soundClips = action.payload;
            })
            .addCase(fetchSoundRecordings.fulfilled, (state, action) => {
                state.soundRecordings = action.payload;
            });
    }
});

export const selectSoundClips = (state: RootState) => state.soundClips.soundClips;
export const selectSoundRecordings = (state: RootState) => state.soundClips.soundRecordings;
export const selectSoundRecordingFiles = (state: RootState) => state.soundClips.soundRecordingFiles;

export const { setSoundRecordingFile } = soundClipSlice.actions;

export default soundClipSlice.reducer;