import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Layout, Target, Calendar, BarChart, FolderOpen, Laptop, AlertTriangle   } from 'lucide-react';
import { ToastContainer } from 'react-toastify';

const ProtectedRoutes = ({ isAuthenticated, onLogout }) => {
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { id: 'laptops', icon: Laptop, label: 'Portatiles', path: '/laptops' },
        { id: 'reservations', icon: Calendar, label: 'Mis Reservas', path: '/reservations' },
        { id: 'fines', icon: AlertTriangle  , label: 'Mis Multas', path: '/fines' },
    ];

    return (
        <>
            <ToastContainer/>
            <Navbar onLogout={onLogout} items={menuItems} />
            <div className="pt-32 px-4 md:px-8 container mx-auto"> {/* Ajusta el valor según la altura de tu navbar */}
                <Outlet /> {/* Renderiza las rutas hijas */}
            </div>
        </>
    );
};

export default ProtectedRoutes;
