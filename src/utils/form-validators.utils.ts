export const MAX_TITLE_LEN = 100;
export const MAX_RECORDING_UPLOAD_SIZE = 5 * (10 ** 6);

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