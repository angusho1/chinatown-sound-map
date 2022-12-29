export type SoundRecordingFileMap = {
    [id: string]: SoundRecordingFileData;
}

export type SoundRecordingImageMap = {
    [id: string]: SoundRecordingImages;
}

export type SoundRecordingImages = {
    [uniqueFileName: string]: SoundRecordingFileData;
}

export type SoundRecordingFileData = {
    fileName: string;
    objectUrl: string;
}