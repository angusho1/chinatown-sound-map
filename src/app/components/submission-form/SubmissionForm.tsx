import { Button, Container, FileInput, Group, Input, LoadingOverlay, Paper, Space, Stack, Stepper, StepProps, Text, Textarea, TextInput, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCircleX, IconFileUpload, IconListDetails, IconUserCircle } from '@tabler/icons';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { createSubmission, resetSubmission, selectSubmissionStatus } from 'features/submissions/submissionsSlice';
import { RecordingLocation } from 'models/RecordingLocation.model';
import SoundClipSubmission from 'models/RecordingSubmission.model';
import SoundRecordingTag from 'models/SoundRecordingTag.model';
import { Fragment, useState } from 'react';
import { tagValidator, DEFAULT_SUBMISSION_LOCATION, submissionAuthorNameValidator, submissionDescriptionValidator, submissionEmailValidator, submissionImagesValidator, submissionLocationValidator, submissionRecordingValidator, submissionTitleValidator, tagsValidator } from 'utils/form-validators.utils';
import TagInput from '../tag-input/TagInput';
import ImageUploadInput from '../image-upload-input/ImageUploadInput';
import LocationPicker from '../location-picker/LocationPicker';
import './SubmissionForm.css';

type SubmissionFormValues = Partial<SoundClipSubmission>;

enum SubmissionFormStep {
    UPLOAD,
    RECORDING_DETAILS,
    CONTRIBUTOR_INFO,
    SUBMISSION_RESULT
}

export default function SubmissionForm() {
    const dispatch = useAppDispatch();
    const [locationModalOpened, setLocationModalOpened] = useState(false);
    const [currStep, setStep] = useState<SubmissionFormStep>(SubmissionFormStep.UPLOAD);
    const submissionStatus = useAppSelector(selectSubmissionStatus);
    const defaultLocation = DEFAULT_SUBMISSION_LOCATION;

    const form = useForm({
        initialValues: {
            title: '',
            recording: undefined,
            email: '',
            author: '',
            description: '',
            date: undefined,
            location: defaultLocation,
            images: [],
            tags: [] as SoundRecordingTag[],
            autoComplete: '',
        },
    
        validate: {
            title: submissionTitleValidator,
            recording: submissionRecordingValidator,
            email: submissionEmailValidator,
            author: submissionAuthorNameValidator,
            description: submissionDescriptionValidator,
            location: submissionLocationValidator,
            images: submissionImagesValidator,
            autoComplete: tagValidator,
            tags: tagsValidator,
        },
        validateInputOnChange: ['recording', 'images', 'autoComplete', 'tags']
    });

    const fileInputs = ['recording', 'images'];
    const recordingDetailsInputs = ['title', 'location', 'description', 'date', 'autoComplete', 'tags'];
    const contributorInfoInputs = ['email', 'author'];

    const submitForm = (values: SubmissionFormValues) => {
        const submission = values as SoundClipSubmission;
        dispatch(createSubmission(submission));
        setStep(SubmissionFormStep.SUBMISSION_RESULT);
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

    const addTag = (tag: SoundRecordingTag) => {
        const tags: SoundRecordingTag[] = form.values.tags.slice();
        tags.push(tag);
        form.setFieldValue('tags', tags);
    }

    const removeTag = (index: number) => {
        const tags = form.values.tags.slice();
        tags.splice(index, 1);
        form.setFieldValue('tags', tags);
    }

    const resetForm = () => {
        form.reset();
        dispatch(resetSubmission());
        setStep(SubmissionFormStep.UPLOAD);
    };

    const returnToForm = () => {
        dispatch(resetSubmission());
    };

    const targetIsTextarea = (target: any) => target.nodeName === 'TEXTAREA' || target.localName === 'textarea';

    const onFormKeyEvent = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !targetIsTextarea(e.target)) {
            e.preventDefault();
        }
    }

    const setAutoCompleteField = (value: string) => {
        form.setFieldValue('autoComplete', value);
    }

    const validateFiles = () => {
        fileInputs.forEach(input => form.validateField(input));
    };

    const validateRecordingDetails = () => {
        recordingDetailsInputs.forEach(input => form.validateField(input));
    };

    const validateContributorInfo = () => {
        contributorInfoInputs.forEach(input => form.validateField(input));
    };

    const nextStep = () => {
        const incrementStep = () => setStep(currStep+1);

        switch (currStep) {
            case SubmissionFormStep.UPLOAD:
                validateFiles();
                incrementStep();
                break;
            case SubmissionFormStep.RECORDING_DETAILS:
                validateRecordingDetails();
                incrementStep();
                break;
            case SubmissionFormStep.CONTRIBUTOR_INFO:
                break;
            default:
                break;
        }
    };
    
    const prevStep = () => {
        const decrementStep = () => setStep(currStep-1);

        switch (currStep) {
            case SubmissionFormStep.RECORDING_DETAILS:
                validateRecordingDetails();
                decrementStep();
                break;
            case SubmissionFormStep.CONTRIBUTOR_INFO:
                validateContributorInfo();
                decrementStep();
                break;
            case SubmissionFormStep.SUBMISSION_RESULT:
                decrementStep();
                break;
            default:
                break;
        }
    };

    const validateStep = (step: SubmissionFormStep) => {
        switch (step) {
            case SubmissionFormStep.UPLOAD:
                validateFiles();
                break;
            case SubmissionFormStep.RECORDING_DETAILS:
                validateRecordingDetails();
                break;
            case SubmissionFormStep.CONTRIBUTOR_INFO:
                validateContributorInfo();
                break;
            default:
                break;
        }
    };

    const onStepClick = (nextStep: SubmissionFormStep) => {
        for (let i = 0; i < nextStep; i++) {
            validateStep(i);
        }
        setStep(nextStep);
    };

    const hasErrors = (step: SubmissionFormStep) => {
        let fields: string[];
        switch (step) {
            case SubmissionFormStep.UPLOAD:
                fields = fileInputs;
                break;
            case SubmissionFormStep.RECORDING_DETAILS:
                fields = recordingDetailsInputs;
                break;
            case SubmissionFormStep.CONTRIBUTOR_INFO:
                fields = contributorInfoInputs;
                break;
            default:
                return false;
        }
        for (const field of fields) {
            if (form.errors[field]) return true;
        }
        return false;
    }

    const getStepProps = (step: SubmissionFormStep): StepProps => {
        const propMap = {
            [SubmissionFormStep.UPLOAD]: {
                label: 'Step 1',
                description: 'Upload Files',
                icon: (<IconFileUpload {...stepperIconProps} />),
            },
            [SubmissionFormStep.RECORDING_DETAILS]: {
                label: 'Step 2',
                description: 'Recording Details',
                icon: (<IconListDetails {...stepperIconProps} />),
            },
            [SubmissionFormStep.CONTRIBUTOR_INFO]: {
                label: 'Step 3',
                description: 'Contributor Info',
                icon: (<IconUserCircle {...stepperIconProps} />),
            },
            [SubmissionFormStep.SUBMISSION_RESULT]: {},
        };

        return {
            ...propMap[step],
            ...hasErrors(step) ? {
                color: step < currStep ? 'light' : undefined,
                completedIcon: (<IconCircleX color="red" />),
            } : {},
            allowStepSelect: submissionStatus !== 'succeeded'
        };
    };

    const nextButtonProps = {
        type: currStep === SubmissionFormStep.CONTRIBUTOR_INFO ? 'submit' as 'submit' : 'button' as 'button',
        children: currStep === SubmissionFormStep.CONTRIBUTOR_INFO ? 'Submit' : 'Next',
        disabled: currStep === SubmissionFormStep.SUBMISSION_RESULT,
    };

    const prevButtonProps = {
        children: currStep === SubmissionFormStep.SUBMISSION_RESULT ? 'Go Back' : 'Back',
        disabled: currStep === SubmissionFormStep.UPLOAD,
    };

    const recordingFileInput = (
        <FileInput 
            label="Upload Recording" 
            placeholder="Click to Upload" 
            accept="audio/mp4,audio/mpeg,audio/x-wav" 
            withAsterisk
            {...form.getInputProps('recording')}
        />
    );

    const imageFilesInput = (
        <ImageUploadInput
            removeImage={removeImage}
            inputProps={form.getInputProps('images')}
        />
    );

    const titleInput = (
        <TextInput
            label="Title"
            placeholder="My Chinatown Recording"
            withAsterisk
            {...form.getInputProps('title')}
        />
    );

    const locationInput = (
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
    );

    const descriptionInput = (
        <Textarea
            placeholder="Please tell us more about your recording"
            label="Description"
            autosize
            minRows={2}
            maxRows={10}
            {...form.getInputProps('description')}
        />
    );

    const dateRecordedInput = (
        <DatePicker
            label="Date Recorded"
            placeholder="Pick date"
            firstDayOfWeek="sunday"
            maxDate={new Date()}
            {...form.getInputProps('date')}
        />
    );

    const tagInput = (
        <TagInput
            inputProps={form.getInputProps('tags')}
            autoCompleteProps={form.getInputProps('autoComplete')}
            addTag={addTag}
            removeTag={removeTag}
            setAutoCompleteField={setAutoCompleteField}
        />
    );

    const emailInput = (
        <TextInput
            label="Email"
            placeholder="your@email.com"
            withAsterisk
            {...form.getInputProps('email')}
        />
    );

    const authorInput = (        
        <TextInput
            label="Your Name"
            placeholder="My Name"
            {...form.getInputProps('author')}
        />
    );

    const renderForm = () => (
        <form onSubmit={form.onSubmit(submitForm)} onKeyDown={onFormKeyEvent}>
            <Stepper active={currStep} onStepClick={onStepClick} breakpoint="sm">
                <Stepper.Step {...getStepProps(SubmissionFormStep.UPLOAD)}>
                    { recordingFileInput }
                    <Space h="md" />
                    { imageFilesInput }
                </Stepper.Step>
                <Stepper.Step {...getStepProps(SubmissionFormStep.RECORDING_DETAILS)}>
                    { titleInput }
                    <Space h="md" />
                    { locationInput }
                    <Space h="md" />
                    { descriptionInput }
                    <Space h="md" />
                    { dateRecordedInput }
                    <Space h="md" />
                    { tagInput }
                </Stepper.Step>
                <Stepper.Step {...getStepProps(SubmissionFormStep.CONTRIBUTOR_INFO)}>
                    { emailInput }
                    <Space h="md" />
                    { authorInput }
                </Stepper.Step>
                <Stepper.Completed>
                {submissionStatus === 'pending' && (
                    <Container sx={{ minHeight: 200 }}>
                        <LoadingOverlay visible={submissionStatus === 'pending'} overlayBlur={2} zIndex={1} />
                    </Container>
                )}
                {submissionStatus === 'succeeded' && (
                    <Stack>
                        <Title align="center" order={3}>Submission was successful</Title>
                        <Text size="md">Thanks for your submission! We will get in touch with you if it is approved.</Text>
                        <Button onClick={resetForm} className="submission-result-btn" variant="outline">
                            Submit Another Recording
                        </Button>
                    </Stack>
                )}
                {submissionStatus === 'failed' && (
                    <Stack>
                        <Title align="center" order={3}>There was an error with your submission.</Title>
                        <Text size="md">There was an error with your submission. Please try again.</Text>
                        <Button onClick={returnToForm} className="submission-result-btn" variant="outline">
                            Go back
                        </Button>
                    </Stack>
                )}
                </Stepper.Completed>
            </Stepper>

            { (submissionStatus === 'idle' || submissionStatus === 'pending') && (
                <Fragment>
                    <Space h="md" />
                    <Group position="center" mt="md">
                        <Button
                            variant="default"
                            onClick={prevStep}
                            {...prevButtonProps}
                        />
                        <Button
                            onClick={nextStep}
                            {...nextButtonProps}
                        />
                    </Group>
                </Fragment>
            )}
        </form>
    );

    return (
        <Container size="sm" style={{ marginLeft: 0, position: 'relative' }}>
            <Paper radius="lg" p="lg" withBorder>
                { renderForm() }
            </Paper>

            <LocationPicker location={defaultLocation} opened={locationModalOpened} onClose={closeLocationModal} />
        </Container>

    );
}

const stepperIconProps = {
    size: 24,
}
