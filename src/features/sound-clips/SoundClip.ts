export default interface SoundClip {
    title: string,
    author: string,
    description: string,
    location: Location,
    date: Date,
    content: string,
    categories: string[],
    meta: Meta
}

export interface Meta {
    plays: Number,
    likes: Number
}

export interface Location {
    lat: number,
    lng: number,
    address: string,
    name?: string
}