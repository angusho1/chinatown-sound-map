import App from 'App';
import { Routes, Route } from "react-router-dom";
import AboutPage from './pages/about/About.page';
import ContactPage from './pages/contact/Contact.page';
import ContributePage from './pages/contribute/Contribute.page';
import HomePage from './pages/home/Home.page';

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contribute" element={<ContributePage />} />
            <Route path="contact" element={<ContactPage />} />
        </Route>
    </Routes>
  )
}
