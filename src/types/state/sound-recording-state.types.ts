export type SoundRecordingFileMap = {
    [id: string]: string;
}

export type SoundRecordingImageMap = {
    [id: string]: SoundRecordingImages;
}

export type SoundRecordingImages = {
    [fileName: string]: string;
}