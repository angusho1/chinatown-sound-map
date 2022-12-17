import SoundRecording from "./SoundRecording.model";

export default interface Submission {
    id: string;
    soundRecording: SoundRecording;
    email: string;
    dateCreated: Date;
    status: SubmissionStatus;
}

export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected';
