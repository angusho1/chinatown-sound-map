import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
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
        console.log(res);
        return res;
    }
);

export const soundClipSlice = createSlice({
    name: 'sounds',
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

export const selectSoundClips = (state: RootState) => state.sounds.soundClips;

export default soundClipSlice.reducer;