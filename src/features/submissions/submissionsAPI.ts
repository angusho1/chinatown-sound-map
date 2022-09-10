import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";

export async function submitRecording(submission: SoundClipSubmission): Promise<SubmissionResponse[]> {
    const formData = new FormData();

    formData.append('title', submission.title);
    formData.append('recording', submission.recording);
    formData.append('location', JSON.stringify(submission.location));
    formData.append('email', submission.email);
    formData.append('description', submission.description ? submission.description : '');
    formData.append('date', submission.date ? submission.date.toUTCString() : '');

    const res = await fetch('/submissions', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: formData
    });

    if (res.status === 201) {
        return res.json();
    } else {
        throw new Error('Request failed');
    }
}