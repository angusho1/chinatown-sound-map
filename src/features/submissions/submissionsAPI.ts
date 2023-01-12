import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";
import SoundRecordingTag from "models/SoundRecordingTag.model";
import Submission, { SubmissionStatus } from "models/Submission.model";
import { GetSubmissionsOptions, SortColumn } from "types/api/submissions-api.types";

export async function submitRecording(submission: SoundClipSubmission): Promise<SubmissionResponse> {
    const formData = new FormData();
    const { existingTagIds, newTags } = splitTagTypes(submission.tags);

    formData.append('title', submission.title);
    formData.append('recording', submission.recording);
    formData.append('location', JSON.stringify(submission.location));
    formData.append('email', submission.email);
    formData.append('author', submission.author || '');
    formData.append('description', submission.description || '');
    formData.append('date', submission.date ? submission.date.toUTCString() : '');
    formData.append('existingTags', JSON.stringify(existingTagIds));
    formData.append('newTags', JSON.stringify(newTags));

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

export function getSoundRecordingTags(): Promise<SoundRecordingTag[]> {
    return fetch('/tags').then(res => res.json());
}

export async function getSubmissions(token: string, options: GetSubmissionsOptions): Promise<Submission[]> {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);

    const getQueryParams = (sort: SortColumn[]) => {
        if (sort.length === 0) return '';
        
        const params = sort.map(option => `sort=${option.field}&desc=${option.reversed.toString()}`);

        return params.join('&');
    };

    const queryParams = options.sort ? getQueryParams(options.sort) : '';

    try {
        const res = await fetch(`/submissions${queryParams ? '?' + queryParams : ''}`, {
            method: 'GET',
            headers
        });
        const jsonRes: any = await res.json();
        return jsonRes.map((submission: any) => {
            return {
                ...submission,
                dateCreated: new Date(submission.dateCreated),
            }
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function publishSubmission(submissionId: string, token: string): Promise<void> {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);

    try {
        const res = await fetch(`/publish/${submissionId}`, {
            method: 'POST',
            headers
        });
        await res.json();
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function editSubmissionStatus(submissionId: string, status: SubmissionStatus, token: string): Promise<void> {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);
    headers.append('Content-Type', 'application/json')
    const body = JSON.stringify({
        status,
    });

    try {
        const res = await fetch(`/submission/${submissionId}`, {
            method: 'PATCH',
            headers,
            body,
        });
        await res.json();
    } catch (e) {
        console.log(e);
        throw e;
    }
}

function splitTagTypes(tags: SoundRecordingTag[]) {
    const existingTagIds: string[] = [];
    const newTags: string[] = []; 

    if (tags) {
        tags.forEach(tag => {
            if (tag.id === '') newTags.push(tag.name);
            else existingTagIds.push(tag.id);
        });
    }

    return { existingTagIds, newTags };
}