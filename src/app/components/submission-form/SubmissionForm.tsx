import { Button, Container, FileInput, Group, Input, LoadingOverlay, Paper, Space, Textarea, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { submitRecording } from 'features/submissions/submissionsAPI';
import { RecordingLocation } from 'models/RecordingLocation.model';
import SoundClipSubmission from 'models/RecordingSubmission.model';
import { useState } from 'react';
import { submissionEmailValidator, submissionRecordingValidator, submissionTitleValidator } from 'utils/form-validators.utils';
import LocationPicker from '../location-picker/LocationPicker';
import './SubmissionForm.css';

type SubmissionFormValues = Partial<SoundClipSubmission>;
type SubmissionState = 'idle' | 'pending' | 'success' | 'rejected';

export default function SubmissionForm() {
    const [locationModalOpened, setLocationModalOpened] = useState(false);
    const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
    const defaultLocation = { lat: 49.279470, lng: -123.099721 };

    const form = useForm({
        initialValues: {
            title: '',
            recording: undefined,
            email: '',
            description: '',
            date: undefined,
            location: defaultLocation
        },
    
        validate: {
            title: submissionTitleValidator,
            recording: submissionRecordingValidator,
            email: submissionEmailValidator,
        },
        validateInputOnChange: ['recording']
    });

    const submitForm = (values: SubmissionFormValues) => {
        console.log(values);
        const submission = values as SoundClipSubmission;
        try {
            submitRecording(submission)
                .then(res => new Promise(res => setTimeout(() => res(1), 2000)))
                .then(() => setSubmissionState('success'))
                .catch(e => new Promise(res => setTimeout(() => res(1), 2000)))
                .then(e => setSubmissionState('rejected'))
            setSubmissionState('pending');
        } catch (e) {
            console.error(e);
        }
    }

    const closeLocationModal = (location: RecordingLocation) => {
        setLocationModalOpened(false);
        form.setFieldValue('location', location);
    };

    const isLocationSet = (location: RecordingLocation) => {
        return location.lat !== defaultLocation.lat || location.lng !== defaultLocation.lng;
    }

    const getLocationText = (location: RecordingLocation) => {
        if (!isLocationSet(location)) {
            return 'Find Location';
        } else {
            return `${form.values.location.lat.toFixed(5)}, ${form.values.location.lng.toFixed(5)}`;
        }
    }

    return (
        <Container size="sm" style={{ marginLeft: 0, position: 'relative' }}>
            <Paper radius="lg" p="lg" withBorder>
                <form onSubmit={form.onSubmit(submitForm)}>
                    <LoadingOverlay visible={submissionState === 'pending'} overlayBlur={2} zIndex={1} />
                    <FileInput 
                        label="Upload Recording" 
                        placeholder="Upload Recording" 
                        accept="audio/mp4,audio/mpeg,audio/x-wav" 
                        withAsterisk
                        {...form.getInputProps('recording')}
                    />
                    <Space h="md" />
                    <TextInput
                        label="Title"
                        placeholder="My Chinatown Recording"
                        withAsterisk
                        {...form.getInputProps('title')}
                    />
                    <Space h="md" />
                    <Input.Wrapper
                        label="Location"
                        withAsterisk
                        description="Tell us where you recorded this clip."
                    >
                        <Input 
                            id="location-input" 
                            type="button"
                            pointer
                            {...form.getInputProps('location')}
                            onClick={() => setLocationModalOpened(true)}
                            className={!isLocationSet(form.values.location) ? 'grey-input' : ''}
                            value={getLocationText(form.values.location)}
                        >
                        </Input>
                    </Input.Wrapper>
                    <Space h="md" />
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        {...form.getInputProps('email')}
                    />
                    <Space h="md" />
                    <Textarea
                        placeholder="Please tell us more about your recording"
                        label="Description"
                        autosize
                        minRows={2}
                        maxRows={10}
                        {...form.getInputProps('description')}
                    />

                    <Space h="md" />
                    <DatePicker
                        label="Date Recorded"
                        placeholder="Pick date"
                        firstDayOfWeek="sunday"
                        maxDate={new Date()}
                        {...form.getInputProps('date')}
                    />

                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Paper>

            <LocationPicker location={defaultLocation} opened={locationModalOpened} onClose={closeLocationModal} />
        </Container>

    );
}
