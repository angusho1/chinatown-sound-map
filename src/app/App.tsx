import './App.css';
import { Footer } from '@mantine/core';
import { AppNavBar, AppNavBarProps } from 'app/components/nav-bar/AppNavBar';
import AppRoutes from './App.routes';

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
        <AppNavBar routes={links} />
        <AppRoutes />
        <Footer height={60} p="md" >
        </Footer>
      </div>
  );
}

export default App;
