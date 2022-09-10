import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import SoundClip from 'features/sound-clips/SoundClip';
import { getSoundClips } from './soundClipAPI';

export interface SoundClipState {
    soundClips: SoundClip[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: SoundClipState = {
    soundClips: [],
    status: 'idle'
}

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
                state.status = 'loading';
            })
            .addCase(fetchSoundClips.fulfilled, (state, action) => {
                state.status = 'idle';
                state.soundClips = action.payload;
            });
    }
});

export const selectSoundClips = (state: RootState) => state.soundClips.soundClips;

export default soundClipSlice.reducer;