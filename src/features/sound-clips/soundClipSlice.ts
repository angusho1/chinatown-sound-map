import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import SoundClip from 'models/SoundClip.model';
import SoundRecording from 'models/SoundRecording.model';
import { SetSoundRecordingFilePayload } from 'types/actions/sound-recording-actions.types';
import { SoundRecordingFileMap, SoundRecordingImageMap } from 'types/state/sound-recording-state.types';
import { NetworkRequestStatus } from 'types/state/state.types';
import { getSoundClips, getSoundRecordings } from './soundClipAPI';

export interface SoundClipState {
    soundClips: SoundClip[];
    soundRecordings: SoundRecording[];
    soundClipStatus: NetworkRequestStatus;
    soundRecordingFiles: SoundRecordingFileMap;
    soundRecordingImageFiles: SoundRecordingImageMap;
    soundRecordingStatus: NetworkRequestStatus;
    selectedSoundRecording: SoundRecording | null;
}

const initialState: SoundClipState = {
    soundClips: [],
    soundRecordings: [],
    soundRecordingStatus: 'idle',
    soundClipStatus: 'idle',
    soundRecordingFiles: {},
    soundRecordingImageFiles: {},
    selectedSoundRecording: null,
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
        },
        cacheSoundRecordingImageFile(state, action: PayloadAction<SetSoundRecordingFilePayload>) {
            const files = state.soundRecordingImageFiles[action.payload.recordingId];
            const fileSrc = action.payload.fileSrc;
            if (!files) {
                state.soundRecordingImageFiles[action.payload.recordingId] = [fileSrc];
            } else {
                files.push(fileSrc);
            }
        },
        setSelectedSoundRecording(state, action: PayloadAction<SoundRecording | null>) {
            state.selectedSoundRecording = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSoundClips.pending, (state) => {
                state.soundClipStatus = 'pending';
            })
            .addCase(fetchSoundClips.fulfilled, (state, action) => {
                state.soundClipStatus = 'succeeded';
                state.soundClips = action.payload;
            })
            .addCase(fetchSoundRecordings.pending, (state) => {
                state.soundRecordingStatus = 'pending';
            })
            .addCase(fetchSoundRecordings.fulfilled, (state, action) => {
                state.soundRecordingStatus = 'succeeded';
                state.soundRecordings = action.payload;
            });
    }
});

export const selectSoundClips = (state: RootState) => state.soundClips.soundClips;
export const selectSoundClipStatus = (state: RootState) => state.soundClips.soundClipStatus;
export const selectSoundRecordings = (state: RootState) => state.soundClips.soundRecordings;
export const selectSoundRecordingStatus = (state: RootState) => state.soundClips.soundRecordingStatus;
export const selectSoundRecordingFiles = (state: RootState) => state.soundClips.soundRecordingFiles;
export const selectSoundRecordingFileById = (state: RootState, recordingId: string | undefined) => recordingId ? state.soundClips.soundRecordingFiles[recordingId] : null;
export const selectSoundRecordingImageById = (state: RootState, recordingId: string | undefined) => recordingId ? state.soundClips.soundRecordingImageFiles[recordingId] : null;
export const selectCurrentSoundRecording = (state: RootState) => state.soundClips.selectedSoundRecording;

export const { setSoundRecordingFile, setSelectedSoundRecording, cacheSoundRecordingImageFile } = soundClipSlice.actions;

export default soundClipSlice.reducer;