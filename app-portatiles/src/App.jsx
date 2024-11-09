import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import NotFound from './pages/NotFound';
// import ProtectedRoutes from './components/ProtectedRoutes';
// import Projects from './components/ProjectsView';
// import TasksView from './components/TasksView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.clear(); // Limpia el token y otros datos
        setIsAuthenticated(false);
    };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
        {/* <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} onLogout={handleLogout}/>}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/projects/:projectId/tasks" element={<TasksView/>} />
          {/* Otras rutas protegidas aquí /}
        </Route>
        <Route path="*" element={<NotFound />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
