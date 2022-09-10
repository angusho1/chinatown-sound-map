import { Header, Container, Group, Burger, Paper, Transition, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './AppNavBar.css'
import { Link, NavLink } from 'react-router-dom';

const HEADER_HEIGHT = 60;

// Ref: https://ui.mantine.dev/component/header-responsive

export interface AppNavBarProps {
  routes: { url: string; label: string }[];
}

export function AppNavBar({ routes }: AppNavBarProps) {
  const [opened, { toggle, close }] = useDisclosure(false);

  const items = routes.map((route) => (
    <NavLink
      to={route.url}
      key={route.label}
      className="link"
      onClick={(event) => {
        close();
      }}
      aria-label={route.url.toLowerCase()}
    >
      {route.label}
    </NavLink>
  ));

  return (
    <Header height={HEADER_HEIGHT} className="header" zIndex={2}>
      <Container className="container">
        <Text size="lg" color="white" weight={500}>
          <Link aria-label="chinatown-sound-map" to="" style={{ color: 'inherit', textDecoration: 'inherit'}}>Chinatown Sound Map</Link>
        </Text>
        <Group spacing={5} className="links">
          {items}
        </Group>

        <Burger color="white" opened={opened} onClick={toggle} className="burger" size="sm" />

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