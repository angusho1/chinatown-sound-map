import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";
import SoundRecordingCategory from "models/SoundRecordingCategory.model";
import Submission from "models/Submission.model";

export async function submitRecording(submission: SoundClipSubmission): Promise<SubmissionResponse> {
    const formData = new FormData();
    const { existingCategoryIds, newCategories } = splitCategoryTypes(submission.categories);

    formData.append('title', submission.title);
    formData.append('recording', submission.recording);
    formData.append('location', JSON.stringify(submission.location));
    formData.append('email', submission.email);
    formData.append('description', submission.description ? submission.description : '');
    formData.append('date', submission.date ? submission.date.toUTCString() : '');
    formData.append('existingCategories', JSON.stringify(existingCategoryIds));
    formData.append('newCategories', JSON.stringify(newCategories));

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

export function getSoundRecordingCategories(): Promise<SoundRecordingCategory[]> {
    return fetch('/categories').then(res => res.json());
}

export async function getSubmissions(token: string): Promise<Submission[]> {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);

    try {
        const res = await fetch('/submissions', {
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

function splitCategoryTypes(categories: SoundRecordingCategory[]) {
    const existingCategoryIds: string[] = [];
    const newCategories: string[] = []; 

    if (categories) {
        categories.forEach(category => {
            if (category.id === '') newCategories.push(category.name);
            else existingCategoryIds.push(category.id);
        });
    }

    return { existingCategoryIds, newCategories };
}