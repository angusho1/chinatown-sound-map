import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";
import SoundRecordingTag from "models/SoundRecordingTag.model";
import { NetworkRequestStatus } from "types/state/state.types";
import { getSoundRecordingTags, submitRecording } from "./submissionsAPI";

export interface SubmissionState {
    status: NetworkRequestStatus;
    tags: SoundRecordingTag[];
    tagsStatus: NetworkRequestStatus;
}

const initialState: SubmissionState = {
    status: 'idle',
    tags: [],
    tagsStatus: 'idle',
}

export const createSubmission = createAsyncThunk('submissions/createSubmission', 
    async (submission: SoundClipSubmission) => {
        const res: SubmissionResponse = await submitRecording(submission);
        return res;
    }
);

export const fetchTags = createAsyncThunk('soundClips/getTags',
    async () => {
        const res: SoundRecordingTag[] = await getSoundRecordingTags();
        return res;
    }
);

export const submissionSlice = createSlice({
    name: 'submissions',
    initialState,
    reducers: {
        resetSubmission: (state) => {
            state.status = 'idle'
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSubmission.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(createSubmission.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(createSubmission.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchTags.pending, (state) => {
                state.tagsStatus = 'pending';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tagsStatus = 'succeeded'
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state) => {
                state.tagsStatus = 'failed';
            })
    }
});

export const selectSubmissionStatus = (state: RootState) => state.submissions.status;
export const selectTags = (state: RootState) => state.submissions.tags;
export const selectGetTagsStatus = (state: RootState) => state.submissions.tagsStatus;

export const { resetSubmission } = submissionSlice.actions;

export default submissionSlice.reducer;
