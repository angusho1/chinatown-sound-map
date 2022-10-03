import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import SoundClip from 'models/SoundClip.model';
import SoundRecording from 'models/SoundRecording.model';
import { NetworkRequestStatus } from 'types/state/state.types';
import { getSoundClips, getSoundRecordings } from './soundClipAPI';

export interface SoundClipState {
    soundClips: SoundClip[];
    soundRecordings: SoundRecording[];
    status: NetworkRequestStatus;
}

const initialState: SoundClipState = {
    soundClips: [],
    soundRecordings: [],
    status: 'idle'
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

export default soundClipSlice.reducer;