import { RecordingLocation } from "models/RecordingLocation.model";
import SoundRecordingTag from "models/SoundRecordingTag.model";

export const MAX_TITLE_LEN = 100;
export const MAX_AUTHOR_NAME_LEN = 100;
export const MAX_DESCRIPTION_LEN = 1000;
export const MAX_RECORDING_UPLOAD_SIZE = 5 * (10 ** 6);
export const MAX_IMAGE_UPLOAD_SIZE = 3 * (10 ** 6);
export const DEFAULT_SUBMISSION_LOCATION = { lat: 49.279470, lng: -123.099721 };
export const MAX_IMAGE_UPLOAD_COUNT = 3;
export const MAX_TAG_LABEL_LENGTH = 40;
export const MAX_NUMBER_TAGS_PER_RECORDING = 5;

export const submissionTitleValidator = (value: string): string | null => {
    if (!value) return 'Please give your recording a title';
    if (value.length > MAX_TITLE_LEN) return `Title cannot exceed ${MAX_TITLE_LEN} characters`;
    return null;
}

export const submissionAuthorNameValidator = (value: string): string | null => {
    if (value.length > MAX_AUTHOR_NAME_LEN) return `Name cannot exceed ${MAX_AUTHOR_NAME_LEN} characters`;
    return null;
}

export const submissionDescriptionValidator = (value: string): string | null => {
    if (value.length > MAX_DESCRIPTION_LEN) return `Description cannot exceed ${MAX_DESCRIPTION_LEN} characters`;
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
    if (value.length > MAX_IMAGE_UPLOAD_COUNT) return `You may only select up to ${MAX_IMAGE_UPLOAD_COUNT} images`;
    if (value.length > 0) {
        for (let image of value) {
            if (image.size > MAX_IMAGE_UPLOAD_SIZE) return 'Image sizes cannot exceed 3MB';
        }
        return null;
    } else {
        return null;
    }
}

export const tagValidator = (value: string): string | null => {
    if (value.length > MAX_TAG_LABEL_LENGTH) return `Tag name cannot exceed ${MAX_TAG_LABEL_LENGTH} characters`;
    if (/^[\p{L}\p{N} -']*$/u.test(value)) return null;
    return 'Tag name contains invalid characters';
}

export const tagsValidator = (value: SoundRecordingTag[]): string | null => {
    if (value.length > MAX_NUMBER_TAGS_PER_RECORDING) return `You cannot add more than ${MAX_NUMBER_TAGS_PER_RECORDING} tags`;
    return null;
}

export const reCaptchaTokenValidator = (value: string | null): string | null => {
    if (!value) return 'Invalid token';
    return null;
}
