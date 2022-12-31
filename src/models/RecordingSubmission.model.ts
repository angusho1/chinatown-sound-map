import { RecordingLocation } from "./RecordingLocation.model";
import SoundRecordingCategory from "./SoundRecordingCategory.model";

export default interface SoundClipSubmission {
    title: string;
    recording: File;
    location: RecordingLocation;
    email: string;
    description?: string;
    author?: string;
    date?: Date;
    images?: File[];
    categories: SoundRecordingCategory[];
}

export interface SubmissionResponse {
    message: string;
    error?: string;
}