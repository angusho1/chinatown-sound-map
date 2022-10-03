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
    const buffer = await res.arrayBuffer();
    return new Blob([buffer]);
}