import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";
import SoundRecordingCategory from "models/SoundRecordingCategory.model";
import { NetworkRequestStatus } from "types/state/state.types";
import { getSoundRecordingCategories, submitRecording } from "./submissionsAPI";

export interface SubmissionState {
    status: NetworkRequestStatus;
    categories: SoundRecordingCategory[];
    categoriesStatus: NetworkRequestStatus;
}

const initialState: SubmissionState = {
    status: 'idle',
    categories: [],
    categoriesStatus: 'idle',
}

export const createSubmission = createAsyncThunk('submissions/createSubmission', 
    async (submission: SoundClipSubmission) => {
        const res: SubmissionResponse = await submitRecording(submission);
        return res;
    }
);

export const fetchCategories = createAsyncThunk('soundClips/getCategories',
    async () => {
        const res: SoundRecordingCategory[] = await getSoundRecordingCategories();
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
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesStatus = 'pending';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categoriesStatus = 'succeeded'
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.categoriesStatus = 'failed';
            })
    }
});

export const selectSubmissionStatus = (state: RootState) => state.submissions.status;
export const selectCategories = (state: RootState) => state.submissions.categories;
export const selectGetCategoriesStatus = (state: RootState) => state.submissions.categoriesStatus;

export const { resetSubmission } = submissionSlice.actions;

export default submissionSlice.reducer;
