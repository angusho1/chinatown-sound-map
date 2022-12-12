export type SoundRecordingFileMap = {
    [id: string]: string;
}

export type SoundRecordingImageMap = {
    [id: string]: SoundRecordingImages;
}

type SoundRecordingImages = {
    [fileName: string]: string;
}