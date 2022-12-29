import { SoundRecordingImages } from "types/state/sound-recording-state.types";

export interface FileObject {
    fileName: string;
    objectUrl: string;
}

export const getImageFileObjects = (imageMap: SoundRecordingImages): FileObject[] => {
    return Object.entries(imageMap).map((value: string[]) => {
        const splitStr = value[0].split('_');
        const fileName = splitStr.length > 1 ? splitStr[1] : splitStr[0];
        return {
            fileName,
            objectUrl: value[1],
        }
    });
}