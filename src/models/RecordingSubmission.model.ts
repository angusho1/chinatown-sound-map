import { RecordingLocation } from "./RecordingLocation.model";
import SoundRecordingTag from "./SoundRecordingTag.model";

export default interface SoundClipSubmission {
    title: string;
    recording: File;
    location: RecordingLocation;
    email: string;
    description?: string;
    author?: string;
    date?: Date;
    images?: File[];
    tags: SoundRecordingTag[];
    reCaptchaToken: string;
}

export interface SubmissionResponse {
    message: string;
    error?: string;
}