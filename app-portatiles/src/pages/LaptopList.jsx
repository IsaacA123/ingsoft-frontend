// src/components/LaptopList.js
import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import { Laptop } from "lucide-react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const LaptopList = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Función para obtener la lista de portátiles
  const fetchLaptops = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        return;
      }

      const response = await fetch(`${apiUrl}/laptops`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setLaptops(data.data);
      } else {
        console.error("Error obteniendo los portatiles", data);
        toast.error(data.data, { autoClose: 5000 });
        setErrorMessage(data.data);
      }
    } catch (error) {
      toast.error("Error de conexión", { autoClose: 5000 });
      setErrorMessage("Error de conexión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = (laptopId) => {
    navigate(`/laptops/${laptopId}`)
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  if (loading) {
    return <Typography variant="h6">Cargando...</Typography>;
  }

  return (
    <main className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Vista de los portatiles
        </h1>
        <p className="text-gray-600">
          Revisa y reserva el portatil de tu preferencia
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laptops.map((laptop) => (
          <div
            key={laptop.id}
            className="transform hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              {/* Título y detalles principales */}
              <h3 className="text-lg font-medium text-primary mb-2">
                Portátil ID: {laptop.id}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                serial: {laptop.serial}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700">
                  Descripción:
                </h4>
                <p className="text-gray-600 text-sm">{laptop.description}</p>
              </div>

              {/* Estado */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Estado:</h4>
                <p
                  className={`text-sm font-semibold ${
                    laptop.state_name === "Disponible"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {laptop.state_name}
                </p>
                <p className="text-sm text-gray-500">
                  {laptop.state_description}
                </p>
              </div>

              {/* Botón de Reserva */}
              <Button
                className="w-full"
                onClick={() => handleReserve(laptop.id)}
                variant="contained"
              >
                Reservar
              </Button>
            </div>
          </div>
        ))}
        {laptops.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <Laptop className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay portatiles todavía
            </h3>
            <p className="text-gray-500">
              Espera a que un administrador agregue los primeros portatiles para reservar
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default LaptopList;
