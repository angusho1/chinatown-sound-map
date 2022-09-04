import { Button, Container, FileInput, Group, Paper, Space, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface SubmissionFormValues {
    title: string;
    recording: File;
    email?: string;
    description: string;
}

const MAX_TITLE_LEN = 100;

export default function SubmissionForm() {

    const form = useForm({
        initialValues: {
            title: '',
            recording: null,
            email: '',
            description: ''
        },
    
        validate: {
            title: (value) => {
                if (!value) return 'Please give your recording a title';
                if (value.length > MAX_TITLE_LEN) return `Title must ${MAX_TITLE_LEN} characters or less`;
                return null;
            },
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <Container size="xs" style={{ marginLeft: 0 }}>
            <Paper radius="lg" p="lg" withBorder>
                <form onSubmit={form.onSubmit((values) => console.log(values))}>
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

                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Paper>
        </Container>

    );
}
