import { RecordingLocation } from "./RecordingLocation.model";

// Legacy
export default interface SoundClip {
    title: string;
    author: string;
    description: string;
    location: RecordingLocation;
    date: Date;
    content: string;
    categories: string[];
    meta: Meta;
}

export interface Meta {
    plays: Number;
    likes: Number;
}