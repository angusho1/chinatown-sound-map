import { Button, Container, FileInput, Group, Input, LoadingOverlay, Paper, Space, Textarea, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { createSubmission, selectSubmissionStatus } from 'features/submissions/submissionsSlice';
import { RecordingLocation } from 'models/RecordingLocation.model';
import SoundClipSubmission from 'models/RecordingSubmission.model';
import { useState } from 'react';
import { DEFAULT_SUBMISSION_LOCATION, submissionEmailValidator, submissionImagesValidator, submissionLocationValidator, submissionRecordingValidator, submissionTitleValidator } from 'utils/form-validators.utils';
import ImageUploadInput from '../image-upload-input/ImageUploadInput';
import LocationPicker from '../location-picker/LocationPicker';
import './SubmissionForm.css';

type SubmissionFormValues = Partial<SoundClipSubmission>;

export default function SubmissionForm() {
    const dispatch = useAppDispatch();
    const [locationModalOpened, setLocationModalOpened] = useState(false);
    const submissionStatus = useAppSelector(selectSubmissionStatus);
    const defaultLocation = DEFAULT_SUBMISSION_LOCATION;

    const form = useForm({
        initialValues: {
            title: '',
            recording: undefined,
            email: '',
            description: '',
            date: undefined,
            location: defaultLocation,
            images: []
        },
    
        validate: {
            title: submissionTitleValidator,
            recording: submissionRecordingValidator,
            email: submissionEmailValidator,
            location: submissionLocationValidator,
            images: submissionImagesValidator,
        },
        validateInputOnChange: ['recording', 'images']
    });

    const submitForm = (values: SubmissionFormValues) => {
        const submission = values as SoundClipSubmission;
        dispatch(createSubmission(submission));
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

    const removeImage = (index: number) => {
        const imgs = form.values.images.slice();
        imgs.splice(index, 1);
        form.setFieldValue('images', imgs);
    };

    return (
        <Container size="sm" style={{ marginLeft: 0, position: 'relative' }}>
            <Paper radius="lg" p="lg" withBorder>
                <form onSubmit={form.onSubmit(submitForm)}>
                    <LoadingOverlay visible={submissionStatus === 'pending'} overlayBlur={2} zIndex={1} />
                    <FileInput 
                        label="Upload Recording" 
                        placeholder="Click to Upload" 
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
                        error={form.getInputProps('location').error}
                    >
                        <Input 
                            id="location-input" 
                            type="button"
                            pointer
                            {...form.getInputProps('location')}
                            invalid={!!form.getInputProps('location').error}
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

                    <Space h="md" />
                    <ImageUploadInput
                        removeImage={removeImage}
                        inputProps={form.getInputProps('images')}
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
