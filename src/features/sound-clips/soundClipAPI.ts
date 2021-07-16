import SoundClip from "features/sound-clips/SoundClip";

export function getSoundClips(): Promise<SoundClip[]> {
    return fetch('/sound-clips').then(res => res.json());
}