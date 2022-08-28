import './App.css';
import { Footer } from '@mantine/core';
import { AppNavBar, AppNavBarProps } from 'app/components/nav-bar/AppNavBar';
import { Outlet } from 'react-router-dom';

function App() {
  const links: AppNavBarProps["routes"] = [
    {
      url: 'about',
      label: 'About'
    },
    {
      url: 'contribute',
      label: 'Contribute'
    },
    {
      url: 'contact',
      label: 'Contact'
    }
  ] 

  return (
      <div className="App">
        <AppNavBar routes={links}  />
        <Outlet />
        <Footer height={60} p="md">
        </Footer>
      </div>
  );
}

export default App;
