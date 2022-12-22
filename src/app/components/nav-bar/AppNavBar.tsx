import { Header, Container, Group, Burger, Paper, Transition, Text, Menu, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './AppNavBar.css'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { IconPackage } from '@tabler/icons';

const HEADER_HEIGHT = 60;

// Ref: https://ui.mantine.dev/component/header-responsive

export interface AppNavBarProps {
  routes: { url: string; label: string }[];
}

export function AppNavBar({ routes }: AppNavBarProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const signOut = () => {
    instance.logoutRedirect();
  };

  const navigateToAdminPage = (route: string) => {
    if (isAuthenticated) navigate(route);
  };

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
          <AuthenticatedTemplate>
            <Menu width={200} position="bottom-end">
              <Menu.Target>
                <Avatar ml={15} sx={{ cursor: 'pointer' }} color="blue" radius="xl">AD</Avatar>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Admin Pages</Menu.Label>
                <Menu.Item
                  icon={<IconPackage size={14} />}
                  onClick={() => navigateToAdminPage('/admin/submissions')}
                >
                  Submissions
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={signOut}>Sign Out</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </AuthenticatedTemplate>
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