import { RecordingLocation } from "./RecordingLocation.model";

export default interface SoundClipSubmission {
    title: string;
    recording: File;
    location: RecordingLocation;
    email: string;
    description?: string;
    date?: Date;
    images?: File[];
}

export interface SubmissionResponse {
    message: string;
    error?: string;
}