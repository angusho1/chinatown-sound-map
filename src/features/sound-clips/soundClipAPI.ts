import SoundClip from "models/SoundClip.model";
import SoundRecording from "models/SoundRecording.model";

export function getSoundClips(): Promise<SoundClip[]> {
    return fetch('/sound-clips').then(res => res.json());
}

export function getSoundRecordings(): Promise<SoundRecording[]> {
    return fetch('/sound-recordings').then(res => res.json());
}

export async function getSoundRecordingFile(id: string): Promise<Blob> {
    const res = await fetch(`sound-recording/${id}/download`);
    return await convertFileDownloadToBlob(res);
}

export async function getSoundRecordingImageFile(filename: string): Promise<Blob> {
    const res = await fetch(`/sound-recording/image/${filename}/download`);
    return await convertFileDownloadToBlob(res);
}

const convertFileDownloadToBlob = async (res: Response) => {
    const buffer = await res.arrayBuffer();

    return new Blob([buffer], {
        type: res.headers.get('Content-Type') as string,
    });
};
