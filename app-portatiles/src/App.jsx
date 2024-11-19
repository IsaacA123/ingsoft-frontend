import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Recovery from './pages/RecoveryPass';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LaptopList from './pages/LaptopList';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import ReservationPage from './components/ReservationPage';
import ReservationsList from './pages/ReservationsList';
import FinesList from './pages/FineList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#776dff', 
      // dark: '#3f37ac',
    },
    secondary: {
      main: '#33FF57', 
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.clear(); // Limpia el token y otros datos
        setIsAuthenticated(false);
    };

  return (
    <ThemeProvider theme={theme}>

    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/laptops" replace /> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/laptops" replace /> : <Login  setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/laptops" replace /> : <Register />} />
        <Route path="/recover" element={isAuthenticated ? <Navigate to="/laptops" replace /> : <Recovery />} />
        <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} onLogout={handleLogout}/>}>

          {/* <Route path="/calendar" element={<MyCalendar />} /> */}
          <Route path="/laptops" element={<LaptopList />} />
          <Route path="/laptops/:laptopId" element={<ReservationPage />} />
          <Route path="/reservations" element={<ReservationsList />} />
          <Route path="/fines" element={<FinesList />} />

          {/* Otras rutas protegidas aquí */}
        </Route>
        <Route path="*" element={<NotFound />} /> 
        

      </Routes>
    </Router>
    <ToastContainer />
    </ThemeProvider>

  );
}

export default App;
