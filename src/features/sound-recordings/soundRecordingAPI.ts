import { API_DOMAIN } from "constants/api/api.constants";
import SoundRecording from "models/SoundRecording.model";
import { SoundRecordingFileData } from "types/state/sound-recording-state.types";

const baseUrl = API_DOMAIN;

export function getSoundRecordings(): Promise<SoundRecording[]> {
    return fetch(`${baseUrl}/sound-recordings`).then(res => res.json());
}

export async function getSoundRecordingFile(id: string, token?: string): Promise<SoundRecordingFileData> {
    return await getFile(`${baseUrl}/sound-recording/${id}/download`, token);
}

export async function getSoundRecordingImageFile(filename: string, token?: string): Promise<SoundRecordingFileData> {
    return await getFile(`${baseUrl}/sound-recording/image/${filename}/download`, token);
}

async function getFile(requestUri: string, token?: string): Promise<SoundRecordingFileData> {
    const headers = new Headers();
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(requestUri, {
        method: 'GET',
        headers,
    });

    const fileName = getFileName(res);
    const fileBlob = await convertFileDownloadToBlob(res);

    return {
        fileName: fileName ? fileName : '',
        objectUrl: URL.createObjectURL(fileBlob),
        type: fileBlob.type,
    };
}

const convertFileDownloadToBlob = async (res: Response) => {
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('Content-Type') as string;

    return new Blob([buffer], {
        type: contentType.split(';')[0],
    });
};

const getFileName = (res: Response) => {
    const contentDispos = res.headers.get('Content-Disposition');
    if (!contentDispos) return null;
    const splitStr = contentDispos.split('filename=');
    return splitStr.length > 1 ? splitStr[1] : null;
};
