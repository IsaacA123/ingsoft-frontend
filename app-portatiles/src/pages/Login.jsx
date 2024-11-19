import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();  // Para redirección en caso de éxito
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        const userRole = data.data.rol;
        if (userRole === "STUDENT") {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userName", data.data.email);
          localStorage.setItem("rol", userRole);
          setIsAuthenticated(true);
          navigate("/laptops");  // Redirigir al dashboard o vista principal para estudiantes
        } else {
          // Mostrar mensaje de error con el rol del usuario
          toast.error(`Esta vista es solo para estudiantes. Tu rol es: ${userRole}`, { autoClose: 5000 });
        }
      } else {
        setErrorMessage(data.data || "Error en el inicio de sesión.");
      }
    } catch (error) {
      toast.error("Error de conexión", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center xl:justify-around xl:pr-40 items-center bg-gray-100 min-h-screen">
      <AnimatePresence mode="wait">
        <ReactSVG className="hidden xl:block" src="team.svg" />

        <motion.div key="form" layout initial={{ x: -600 }} animate={{ x: 0 }}>
          <form onSubmit={handleSubmit} className="flex flex-col p-10 gap-4 rounded shadow-lg">
            <h2 className="font-semibold text-2xl py-4 text-center">Iniciar Sesión</h2>

            <TextField
              type="email"
              label="Correo"
              variant="outlined"
              className="bg-[#ffffff]"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              type="password"
              label="Contraseña"
              variant="outlined"
              className="bg-[#ffffff]"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex flex-row justify-between mb-2 text-gray-500 text-xs">
              <label className="flex gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="/recover" className="hover:underline">
                ¿Olvidaste la contraseña?
              </a>
            </div>
            {errorMessage && <p className="text-error">{errorMessage}</p>}
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar"}
            </Button>

            <p className="text-center">
              ¿No tienes una cuenta?{" "}
              <a href="/register" className="text-primary hover:underline">
                Regístrate aquí
              </a>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>

      <ToastContainer /> {/* Agrega el contenedor de toast aquí */}
    </div>
  );
};

export default Login;
