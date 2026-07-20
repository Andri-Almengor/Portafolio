import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';

export default function App() {
  return <Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="projects" element={<ProjectsPage />} /><Route path="projects/:slug" element={<ProjectDetailPage />} /><Route path="contact" element={<ContactPage />} /><Route path="login" element={<LoginPage />} /><Route path="admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} /><Route path="*" element={<p>Página no encontrada.</p>} /></Route></Routes>;
}
