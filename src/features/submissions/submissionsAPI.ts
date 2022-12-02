import SoundClipSubmission, { SubmissionResponse } from "models/RecordingSubmission.model";
import SoundRecordingCategory from "models/SoundRecordingCategory.model";

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

export async function getSubmissions(token: string) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);

    try {
        const res = await fetch('/submissions', {
            method: 'GET',
            headers
        });
        return res.json();
    } catch (e) {
        console.log(e);
        return { error: e };
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