import { RecordingLocation } from './RecordingLocation.model';
import SoundRecordingCategory from './SoundRecordingCategory.model';

export default interface SoundRecording {
    id: string;
    title: string;
    author?: string;
    description?: string;
    location: RecordingLocation;
    dateRecorded?: Date;
    fileLocation: string;
    imageFiles?: string[];
    categories?: SoundRecordingCategory[];
}