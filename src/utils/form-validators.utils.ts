import { RecordingLocation } from "models/RecordingLocation.model";

export const MAX_TITLE_LEN = 100;
export const MAX_RECORDING_UPLOAD_SIZE = 5 * (10 ** 6);
export const MAX_IMAGE_UPLOAD_SIZE = 3 * (10 ** 6);
export const DEFAULT_SUBMISSION_LOCATION = { lat: 49.279470, lng: -123.099721 };

export const submissionTitleValidator = (value: string): string | null => {
    if (!value) return 'Please give your recording a title';
    if (value.length > MAX_TITLE_LEN) return `Title must ${MAX_TITLE_LEN} characters or less`;
    return null;
}

export const submissionRecordingValidator = (value: File | undefined): string | null => {
    if (value) {
        if (value.size > MAX_RECORDING_UPLOAD_SIZE) return 'File size cannot exceed 5MB';
        return null;
    } else {
        return 'Please choose an audio file';
    }
}

export const submissionEmailValidator = (value: string): string | null => {
    return (/^\S+@\S+$/.test(value) ? null : 'Invalid email');
}

export const submissionLocationValidator = (value: RecordingLocation): string | null => {
    if (value.lat === DEFAULT_SUBMISSION_LOCATION.lat && value.lng === DEFAULT_SUBMISSION_LOCATION.lng) return 'Please choose a location';
    return null;
}

export const submissionImagesValidator = (value: File[]): string | null => {
    if (value.length > 0) {
        for (let image of value) {
            if (image.size > MAX_IMAGE_UPLOAD_SIZE) return 'Image sizes cannot exceed 3MB';
        }
        return null;
    } else {
        return null;
    }
}