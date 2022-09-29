import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";

export async function submitRecording(submission: SoundClipSubmission): Promise<SubmissionResponse> {
    const formData = new FormData();

    formData.append('title', submission.title);
    formData.append('recording', submission.recording);
    formData.append('location', JSON.stringify(submission.location));
    formData.append('email', submission.email);
    formData.append('description', submission.description ? submission.description : '');
    formData.append('date', submission.date ? submission.date.toUTCString() : '');

    if (submission.images) {
        submission.images.forEach(image => formData.append('image', image));
    }

    const res = await fetch('/submissions', {
        method: 'POST',
        body: formData
    });

    if (res.status === 201) {
        return res.json();
    } else {
        throw new Error('Request failed');
    }
}