export type SetSoundRecordingFilePayload = {
    recordingId: string;
    fileName: string;
    objectUrl: string;
    type?: string;
}

export type SetImageFilePayload = {
    recordingId: string;
    uniqueFileName: string;
    fileName: string;
    objectUrl: string;
    type?: string;
}