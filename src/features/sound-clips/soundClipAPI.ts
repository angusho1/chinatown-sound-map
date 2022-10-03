import SoundClip from "models/SoundClip.model";
import SoundRecording from "models/SoundRecording.model";

export function getSoundClips(): Promise<SoundClip[]> {
    return fetch('/sound-clips').then(res => res.json());
}

export function getSoundRecordings(): Promise<SoundRecording[]> {
    return fetch('/sound-recordings').then(res => res.json());
}