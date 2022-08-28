import { useState } from 'react';
import { Header, Container, Group, Burger, Paper, Transition, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './AppNavBar.css'

const HEADER_HEIGHT = 60;

// Ref: https://ui.mantine.dev/component/header-responsive

export interface AppNavBarProps {
  routes: { url: string; label: string }[];
}

export function AppNavBar({ routes }: AppNavBarProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(routes[0].url);

  const items = routes.map((route) => (
    <a
      key={route.label}
      href={route.url}
      className={`link ${active === route.url ? 'link-active' : ''}`}
      onClick={(event) => {
        event.preventDefault();
        setActive(route.url);
        close();
      }}
    >
      {route.label}
    </a>
  ));

  return (
    <Header height={HEADER_HEIGHT} className="header">
      <Container className="container">
        <Text>Chinatown Sound Map</Text>
        <Group spacing={5} className="links">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} className="burger" size="sm" />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className="dropdown" withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}