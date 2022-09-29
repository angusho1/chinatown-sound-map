import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";
import { submitRecording } from "./submissionsAPI";

export type SubmissionStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

export interface SubmissionState {
    status: SubmissionStatus
}

const initialState: SubmissionState = {
    status: 'idle'
}

export const createSubmission = createAsyncThunk('submissions/createSubmission', async (submission: SoundClipSubmission) => {
    const res: SubmissionResponse = await submitRecording(submission);
    return res;
}
);

export const submissionSlice = createSlice({
    name: 'submissions',
    initialState,
    reducers: {
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
            });
    }
});

export const selectSubmissionStatus = (state: RootState) => state.submissions.status;

export default submissionSlice.reducer;
