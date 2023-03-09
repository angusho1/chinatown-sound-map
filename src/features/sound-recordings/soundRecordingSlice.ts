import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import SoundRecording from 'models/SoundRecording.model';
import { SetImageFilePayload, SetSoundRecordingFilePayload } from 'types/actions/sound-recording-actions.types';
import { SoundRecordingFileData, SoundRecordingFileMap, SoundRecordingImageMap } from 'types/state/sound-recording-state.types';
import { NetworkRequestStatus } from 'types/state/state.types';
import { getSoundRecordings } from './soundRecordingAPI';

export interface SoundRecordingState {
    soundRecordings: SoundRecording[];
    soundRecordingFiles: SoundRecordingFileMap;
    soundRecordingImageFiles: SoundRecordingImageMap;
    soundRecordingStatus: NetworkRequestStatus;
    selectedSoundRecording: SoundRecording | null;
    isDetailedViewOpen: boolean;
}

const initialState: SoundRecordingState = {
    soundRecordings: [],
    soundRecordingStatus: 'idle',
    soundRecordingFiles: {},
    soundRecordingImageFiles: {},
    selectedSoundRecording: null,
    isDetailedViewOpen: false,
}

export const fetchSoundRecordings = createAsyncThunk('soundRecordings/fetchSoundRecordings',
    async () => {
        const res: SoundRecording[] = await getSoundRecordings();
        return res;
    }
);

export const soundRecordingSlice = createSlice({
    name: 'soundRecordings',
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

export const selectSoundRecordings = (state: RootState) => state.soundRecordings.soundRecordings;
export const selectSoundRecordingStatus = (state: RootState) => state.soundRecordings.soundRecordingStatus;
export const selectSoundRecordingFiles = (state: RootState) => state.soundRecordings.soundRecordingFiles;
export const selectSoundRecordingFileById = (state: RootState, recordingId: string | undefined) => recordingId ? state.soundRecordings.soundRecordingFiles[recordingId] : null;
export const selectSoundRecordingImageById = (state: RootState, recordingId: string | undefined) => recordingId ? state.soundRecordings.soundRecordingImageFiles[recordingId] : null;
export const selectCurrentSoundRecording = (state: RootState) => state.soundRecordings.selectedSoundRecording;
export const selectIsDetailedViewOpen = (state: RootState) => state.soundRecordings.isDetailedViewOpen;

export const { setSoundRecordingFile, setSelectedSoundRecording, cacheSoundRecordingImageFile, toggleDetailedView } = soundRecordingSlice.actions;

export default soundRecordingSlice.reducer;