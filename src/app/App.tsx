import './App.css';
import { Footer } from '@mantine/core';
import { AppNavBar, AppNavBarProps } from 'app/components/nav-bar/AppNavBar';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/Home.page';
import AboutPage from './pages/about/About.page';
import ContributePage from './pages/contribute/Contribute.page';
import ContactPage from './pages/contact/Contact.page';
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
        {/* <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes> */}
        <Footer height={60} p="md" >
        </Footer>
      </div>
  );
}

export default App;
