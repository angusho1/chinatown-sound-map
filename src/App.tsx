import Map from './app/map/Map';
import './App.css';
import { Footer } from '@mantine/core';
import { AppNavBar, AppNavBarProps } from 'app/components/nav-bar/AppNavBar';

function App() {
  const links: AppNavBarProps["routes"] = [
    {
      url: '/about',
      label: 'About'
    },
    {
      url: '/contribute',
      label: 'Contribute'
    },
    {
      url: '/contact',
      label: 'Contact'
    }
  ] 

  return (
      <div className="App">
        <AppNavBar routes={links}  />
        <Map></Map>
        <Footer height={60} p="md">
        </Footer>
      </div>
  );
}

export default App;
