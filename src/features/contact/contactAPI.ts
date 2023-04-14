import { verifyReCaptchaToken } from "features/submissions/submissionsAPI";
import { ContactFormValues } from "types/api/contact-form.types";

export const submitContactForm = async (contactFormSubmission: ContactFormValues) => {
    const { reCaptchaToken, ...submissionData } = contactFormSubmission;
    const isTokenValid = await verifyReCaptchaToken(reCaptchaToken);
    if (!isTokenValid) throw new Error('Invalid token');

    const baseUrl = 'https://api.web3forms.com';
    const body = {
        ...submissionData,
        access_key: process.env.REACT_APP_WEB_FORM_PUBLIC_ACCESS_KEY,
    }
    const res = await fetch(`${baseUrl}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return await res.json();
};