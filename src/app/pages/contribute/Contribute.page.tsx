import { Container, Space, Title } from '@mantine/core';
import SubmissionForm from 'app/components/submission-form/SubmissionForm';
import React, { useEffect } from 'react';

export default function ContributePage() {
  useEffect(() => {
    document.title = 'Contribute';
  });

  return (
    <Container py="md">
      <Title order={1}>Contribute</Title>
      <Space h="lg" />
      <SubmissionForm />
    </Container>
  )
}
