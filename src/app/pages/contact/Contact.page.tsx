import React, { useEffect } from 'react';
import { Container, Grid, Space, Text, Title } from '@mantine/core';
import ContactForm from 'app/components/contact-form/ContactForm';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact';
  });

  return (
    <Container py="xl" className="page-body">
      <Title order={1}>Contact</Title>
      <Space h="lg" />
      <Text>Have a suggestion or interested in getting in touch? Please fill out the following form!</Text>
      <Space h="xl" />
      <Grid>
        <Grid.Col span={8}>
          <ContactForm />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
