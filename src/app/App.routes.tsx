import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Routes, Route, Navigate } from "react-router-dom";
import AboutPage from './pages/about/About.page';
import AdminSubmissionsPage from "./pages/admin/submissions/AdminSubmissions.page";
import AdminSignInPage from "./pages/admin/sign-in/AdminSignIn.page";
import ContactPage from './pages/contact/Contact.page';
import ContributePage from './pages/contribute/Contribute.page';
import NotFoundErrorPage from "./pages/error/NotFoundError.page";
import HomePage from './pages/home/Home.page';
import { InteractionStatus } from "@azure/msal-browser";

export default function AppRoutes() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  const renderProtectedPage = (element: JSX.Element) => {
    if (inProgress !== InteractionStatus.None) return null;
    if (isAuthenticated) return element;
    return <Navigate to="/admin/signin"/>;
  }

  return (
    <Routes>
      <Route path="*" element={<NotFoundErrorPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contribute" element={<ContributePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin">
        <Route path="signin" element={<AdminSignInPage />} />
        <Route path="submissions">
          <Route path=":tab" element={renderProtectedPage(<AdminSubmissionsPage/>)} />
          <Route path="" element={renderProtectedPage(<AdminSubmissionsPage/>)} />
        </Route>
        <Route path="" element={<NotFoundErrorPage />} />
      </Route>
    </Routes>
  )
}
