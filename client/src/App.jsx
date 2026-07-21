import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PublicLayout } from './components/PublicLayout.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.jsx';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage.jsx';
import { AdminProjectEditorPage } from './pages/admin/AdminProjectEditorPage.jsx';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage.jsx';
import { AdminSectionsPage } from './pages/admin/AdminSectionsPage.jsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.jsx';

function AdminGuard() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="login" element={<Navigate to="/admin/login" replace />} />
      <Route path="admin/login" element={<LoginPage />} />

      <Route path="admin" element={<AdminGuard />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="sections" element={<AdminSectionsPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="projects/new" element={<AdminProjectEditorPage />} />
        <Route path="projects/:id/edit" element={<AdminProjectEditorPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
