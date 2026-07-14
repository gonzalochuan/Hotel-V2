import { LandingPage } from './pages/LandingPage';
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage';
import { RoomsCatalogProvider } from './context/RoomsCatalogContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <RoomsCatalogProvider>{isAdmin ? <AdminRoomsPage /> : <LandingPage />}</RoomsCatalogProvider>
    </AuthProvider>
  );
}
