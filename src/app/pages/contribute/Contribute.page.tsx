import { Container, Grid, List, Space, Text, Title } from '@mantine/core';
import SubmissionForm from 'app/components/submission-form/SubmissionForm';
import React, { useEffect } from 'react';

export default function ContributePage() {
  useEffect(() => {
    document.title = 'Contribute';
  });

  return (
    <Container py="xl" className="page-body">
      <Title order={1}>Contribute</Title>
      <Space h="lg" />
      <Grid>
        <Grid.Col span={5}>
          <Text size="md">
            Contributions to the Chinatown Sound Map are welcomed and will be accepted on a rolling basis. To upload a field recording, please fill out the following form.
          </Text>
          <Space h="lg" />
          <Text size="lg" color="red">Submission Guidelines</Text>
          <Space h="sm" />
          <List spacing="md">
            <List.Item>Recordings can be of any kind, quality and duration so long as they were recorded in Chinatown. This website is open to submissions from Chinatowns around the world.</List.Item>
            <List.Item>Take pictures or notes to identify when/where your submission was recorded. Pictures can be uploaded on SoundCloud along with your audio clip to help illustrate your recordings.</List.Item>
          </List>
        </Grid.Col>
        <Grid.Col span={7}>
          <SubmissionForm />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
