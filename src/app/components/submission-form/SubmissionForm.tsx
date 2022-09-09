import { Button, Container, FileInput, Group, Modal, Paper, Space, Textarea, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import LocationPicker, { MapLocation } from '../location-picker/LocationPicker';

interface SubmissionFormValues {
    title?: string;
    recording?: File;
    email?: string;
    description?: string;
    date?: Date;
}

const MAX_TITLE_LEN = 100;

export default function SubmissionForm() {
    const [locationModalOpened, setLocationModalOpened] = useState(false);
    const defaultLocation = { lat: 49.279470, lng: -123.099721 };

    const form = useForm({
        initialValues: {
            title: '',
            recording: undefined,
            email: '',
            description: '',
            date: undefined,
            location: ''
        },
    
        validate: {
            title: (value) => {
                if (!value) return 'Please give your recording a title';
                if (value.length > MAX_TITLE_LEN) return `Title must ${MAX_TITLE_LEN} characters or less`;
                return null;
            },
            recording: value => !!value ? null : 'Please choose an audio file',
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const submitForm = (values: SubmissionFormValues) => {
        console.log(values);
    }

    const closeLocationModal = (location: MapLocation) => {
        setLocationModalOpened(false);
        console.log('New Location', location);
    };

    return (
        <Container size="sm" style={{ marginLeft: 0 }}>
            <Paper radius="lg" p="lg" withBorder>
                <form onSubmit={form.onSubmit(submitForm)}>
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
                    <TextInput
                        label="Location"
                        placeholder="Where was this recorded?"
                        withAsterisk
                        {...form.getInputProps('location')}
                        onClick={() => setLocationModalOpened(true)}
                    />
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
