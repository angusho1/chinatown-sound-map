import SoundClip from "models/SoundClip.model";
import SoundRecording from "models/SoundRecording.model";

interface GetFileResult {
    data: Blob;
    fileName: string;
}

export function getSoundClips(): Promise<SoundClip[]> {
    return fetch('/sound-clips').then(res => res.json());
}

export function getSoundRecordings(): Promise<SoundRecording[]> {
    return fetch('/sound-recordings').then(res => res.json());
}

export async function getSoundRecordingFile(id: string, token?: string): Promise<GetFileResult> {
    const headers = new Headers();
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`/sound-recording/${id}/download`, {
        method: 'GET',
        headers,
    });

    const fileName = getFileName(res);

    return {
        fileName: fileName ? fileName : '',
        data: await convertFileDownloadToBlob(res),
    };
}

export async function getSoundRecordingImageFile(filename: string, token?: string): Promise<GetFileResult> {
    const headers = new Headers();
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`/sound-recording/image/${filename}/download`, {
        method: 'GET',
        headers,
    });

    const fileName = getFileName(res);

    return {
        fileName: fileName ? fileName : '',
        data: await convertFileDownloadToBlob(res),
    };
}

const convertFileDownloadToBlob = async (res: Response) => {
    const buffer = await res.arrayBuffer();

    return new Blob([buffer], {
        type: res.headers.get('Content-Type') as string,
    });
};

const getFileName = (res: Response) => {
    const contentDispos = res.headers.get('Content-Disposition');
    if (!contentDispos) return null;
    const splitStr = contentDispos.split('filename=');
    return splitStr.length > 1 ? splitStr[1] : null;
};
