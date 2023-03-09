import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import SoundRecording from 'models/SoundRecording.model';
import { SetImageFilePayload, SetSoundRecordingFilePayload } from 'types/actions/sound-recording-actions.types';
import { SoundRecordingFileData, SoundRecordingFileMap, SoundRecordingImageMap } from 'types/state/sound-recording-state.types';
import { NetworkRequestStatus } from 'types/state/state.types';
import { getSoundRecordings } from './soundClipAPI';

export interface SoundClipState {
    soundRecordings: SoundRecording[];
    soundRecordingFiles: SoundRecordingFileMap;
    soundRecordingImageFiles: SoundRecordingImageMap;
    soundRecordingStatus: NetworkRequestStatus;
    selectedSoundRecording: SoundRecording | null;
    isDetailedViewOpen: boolean;
}

const initialState: SoundClipState = {
    soundRecordings: [],
    soundRecordingStatus: 'idle',
    soundRecordingFiles: {},
    soundRecordingImageFiles: {},
    selectedSoundRecording: null,
    isDetailedViewOpen: false,
}

export const fetchSoundRecordings = createAsyncThunk('soundClips/fetchSoundRecordings',
    async () => {
        const res: SoundRecording[] = await getSoundRecordings();
        return res;
    }
);

export const soundClipSlice = createSlice({
    name: 'soundClips',
    initialState,
    reducers: {
        setSoundRecordingFile(state, action: PayloadAction<SetSoundRecordingFilePayload>) {
            const { recordingId, fileName, objectUrl } = action.payload;
            state.soundRecordingFiles[recordingId] = {
                fileName,
                objectUrl
            };
        },
        cacheSoundRecordingImageFile(state, action: PayloadAction<SetImageFilePayload>) {
            const { fileName, recordingId, uniqueFileName, objectUrl } = action.payload;
            const files = state.soundRecordingImageFiles[recordingId];
            const fileDataObject: SoundRecordingFileData = { fileName, objectUrl };
            if (!files) {
                state.soundRecordingImageFiles[recordingId] = {
                    [uniqueFileName]: fileDataObject,
                };
            } else {
                files[uniqueFileName] = fileDataObject;
            }
        },
        setSelectedSoundRecording(state, action: PayloadAction<SoundRecording | null>) {
            state.selectedSoundRecording = action.payload;
        },
        toggleDetailedView(state, action: PayloadAction<boolean>) {
            state.isDetailedViewOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSoundRecordings.pending, (state) => {
                state.soundRecordingStatus = 'pending';
            })
            .addCase(fetchSoundRecordings.fulfilled, (state, action) => {
                state.soundRecordingStatus = 'succeeded';
                state.soundRecordings = action.payload;
            });
    }
});

export const selectSoundRecordings = (state: RootState) => state.soundClips.soundRecordings;
export const selectSoundRecordingStatus = (state: RootState) => state.soundClips.soundRecordingStatus;
export const selectSoundRecordingFiles = (state: RootState) => state.soundClips.soundRecordingFiles;
export const selectSoundRecordingFileById = (state: RootState, recordingId: string | undefined) => recordingId ? state.soundClips.soundRecordingFiles[recordingId] : null;
export const selectSoundRecordingImageById = (state: RootState, recordingId: string | undefined) => recordingId ? state.soundClips.soundRecordingImageFiles[recordingId] : null;
export const selectCurrentSoundRecording = (state: RootState) => state.soundClips.selectedSoundRecording;
export const selectIsDetailedViewOpen = (state: RootState) => state.soundClips.isDetailedViewOpen;

export const { setSoundRecordingFile, setSelectedSoundRecording, cacheSoundRecordingImageFile, toggleDetailedView } = soundClipSlice.actions;

export default soundClipSlice.reducer;