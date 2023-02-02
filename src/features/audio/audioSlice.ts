import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { SetPositionPayload, SetVolumePayload } from "types/actions/audio-actions.types";

export type PlaybackStatus = 'playing' | 'stopped';

export interface AudioState {
    playbackStatus: PlaybackStatus;
    volumeLevel: number;
    lastUnmutedVolumeLevel: number;
    trackPosition: number;
    scrubbing: boolean;
}

const initialState: AudioState = {
    playbackStatus: 'stopped',
    volumeLevel: 1, 
    lastUnmutedVolumeLevel: 1,
    trackPosition: 0,
    scrubbing: false,
};

const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        stopAudio: (state) => {
            state.playbackStatus = 'stopped';
        },
        playAudio: (state) => {
            state.playbackStatus = 'playing';
        },
        setVolume: (state, action: PayloadAction<SetVolumePayload>) => {
            state.volumeLevel = action.payload.volumeLevel;
        },
        toggleVolume: (state) => {
            if (state.volumeLevel === 0) state.volumeLevel = state.lastUnmutedVolumeLevel;
            else {
                state.lastUnmutedVolumeLevel = state.volumeLevel;
                state.volumeLevel = 0;
            }
        },
        setTrackToPosition: (state, action: PayloadAction<SetPositionPayload>) => {
            state.trackPosition = action.payload.position;
        },
        scrubTrackToPosition: (state, action: PayloadAction<SetPositionPayload>) => {
            state.scrubbing = true;
            state.trackPosition = action.payload.position;
        },
        finishScrub: (state) => {
            state.scrubbing = false;
        },
    },
});

export const selectIsAudioStopped = (state: RootState) => state.audio.playbackStatus === 'stopped';
export const selectVolume = (state: RootState) => {
    return {
        volumeLevel: state.audio.volumeLevel,
        lastUnmutedVolumeLevel: state.audio.lastUnmutedVolumeLevel,
    };
};
export const selectPositionState = (state: RootState) => {
    return {
        trackPosition: state.audio.trackPosition,
        scrubbing: state.audio.scrubbing,
    };
};

export const { stopAudio, playAudio, setVolume, toggleVolume, setTrackToPosition, scrubTrackToPosition, finishScrub } = audioSlice.actions;

export default audioSlice.reducer;
