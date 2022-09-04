import { Button, Container, Group, Paper, Space, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

interface ContactFormValues {
    name?: string;
    email?: string;
    message?: string;
}

export default function ContactForm() {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            message: ''
        },
    
        validate: {
            name: (value) => value.length > 0 ? null : 'Please enter your name', 
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            message: (value) => value.length > 0 ? null : 'Please include your message',
        },
    });

    const submitForm = (values: ContactFormValues) => {
        console.log(values);
    }

  return (
    <Container size="sm" style={{ marginLeft: 0 }}>
        <Paper radius="lg" p="lg" withBorder>
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

                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Paper>
    </Container>
  )
}
