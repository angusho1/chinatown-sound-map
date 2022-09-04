import { Container, Space, Text, Title } from '@mantine/core';
import React, { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About';
  });

  return (
    <Container py="xl" className="page-body">
      <Title order={1}>About</Title>
      <Space h="lg" />
      <Text size="md">
        The Chinatown Sound Map is a collaborative, community based project guided by the curiosity of exploring how sound contributes to our sense of place. It provides a platform for users to listen to and share different experiences in and with Chinatown through the perspective of sound.
      </Text>
      <Space h="lg" />
      <Text size="md">
        By showcasing the ordinary hustle and bustle of Chinatown, this project encourages users to engage with the sounds around them with a critical mind and curious heart. Certain sounds can enrich our experiences and enable us to connect to a place; others may not. What can we learn by paying attention to the sounds around us? How might sound shape the way we experience and navigate through a place? What role does sound play in informing unique understandings of and relationships to Chinatown? In featuring the myriad of soundscapes that exists within Chinatown, this project aims to provide a platform for users to consider the contested nature of place. 
      </Text>
      <Space h="lg" />
      <Text size="md">
        Currently, this project is based in Vancouver's Chinatown, on the traditional and unceded territories of the xʷməθkʷəy̓əm (Musqueam), Skxwú7mesh (Squamish), and Səl̓ílwətaʔ/Selilwitulh (Tsleil-Waututh) First Nations. Chinatown would not have been able to grow and flourish without the generosity and hospitality of the original stewards of this land, and this project hopes to recognize the many experiences and stories that continue to shape this place.
      </Text>

      <Space h="xl" />
      <Title order={2}>Special Thanks</Title>
      <Space h="md" />
      <Text>Quan Lee Excellence Fund for Asian Canadian and Asian Migration Studies</Text>
      <Text>Chinatown Today</Text>
      <Text>hua foundation</Text>
    </Container>
  )
}
