import { Button, Container, Group, LoadingOverlay, Paper, Space, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { submitContactForm } from 'features/contact/contactAPI';
import { useState } from 'react';
import { ContactFormValues } from 'types/api/contact-form.types';
import { NetworkRequestStatus } from 'types/state/state.types';
import { contactFormMessageValidator, contactFormNameValidator, reCaptchaTokenValidator, submissionEmailValidator } from 'utils/form-validators.utils';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactForm() {
    const [submissionStatus, setSubmissionStatus] = useState<NetworkRequestStatus>('idle');
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            message: '',
            reCaptchaToken: '',
        },
    
        validate: {
            name: contactFormNameValidator, 
            email: submissionEmailValidator,
            message: contactFormMessageValidator,
            reCaptchaToken: reCaptchaTokenValidator,
        },
    });

    const submitForm = async (values: ContactFormValues) => {
        setSubmissionStatus('pending');
        try {
            const submitFormResult = await submitContactForm(values);
            if (submitFormResult.success) setSubmissionStatus('succeeded');
            else setSubmissionStatus('failed');
        } catch (e) {
            setSubmissionStatus('failed');
        }
    };

    const resetForm = () => {
        setSubmissionStatus('idle');
        form.reset();
    };

    const onReCaptchaChange = (value: string | null) => {
        form.setFieldValue('reCaptchaToken', !value ? '' : value);
    };

    return (
        <Container size="sm" style={{ marginLeft: 0, position: 'relative' }}>
            <Paper radius="lg" p="lg" withBorder>
                { submissionStatus === 'idle' && (
                    <form onSubmit={form.onSubmit(submitForm)}>
                        <TextInput
                            label="Name"
                            placeholder="Your Name"
                            withAsterisk
                            {...form.getInputProps('name')}
                        />
                        <Space h="md" />
                        <TextInput
                            label="Email"
                            placeholder="your@email.com"
                            withAsterisk
                            {...form.getInputProps('email')}
                        />
                        <Space h="md" />
                        <Textarea
                            placeholder="Type your message here"
                            label="Message"
                            withAsterisk
                            autosize
                            minRows={6}
                            maxRows={15}
                            {...form.getInputProps('message')}
                        />
                        <Space h="md" />
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY as string}
                            onChange={onReCaptchaChange}
                        />

                        <Group position="right" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                )}
                { submissionStatus === 'pending' && (
                    <Container sx={{ minHeight: 200 }}>
                        <LoadingOverlay visible={submissionStatus === 'pending'} overlayBlur={2} zIndex={1} />
                    </Container>
                ) }
                {submissionStatus === 'succeeded' && (
                    <Stack>
                        <Title align="center" order={3}>Message Sent Successfully</Title>
                        <Text size="md">Thanks for your message! We will try to get in touch with you soon.</Text>
                        <Button onClick={resetForm} variant="outline">
                            Go Back
                        </Button>
                    </Stack>
                )}
                { submissionStatus === 'failed' && (
                    <Stack>
                        <Title align="center" order={3}>Failed to Send Message.</Title>
                        <Text size="md">There was an error with your submission. Please try again later.</Text>
                        <Button onClick={() => setSubmissionStatus('idle')} className="submission-result-btn" variant="outline">
                            Go back
                        </Button>
                    </Stack>
                ) }
            </Paper>
        </Container>
  )
}
