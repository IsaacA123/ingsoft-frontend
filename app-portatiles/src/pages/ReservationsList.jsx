import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const apiUrl = import.meta.env.VITE_API_URL;

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        return;
      }

      const response = await fetch(`${apiUrl}/reservations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setReservations(data.data);
      } else {
        console.error("Error obteniendo las reservas", data);
        toast.error(data.message || "Error al obtener las reservas.");
        setErrorMessage(data.message);
      }
    } catch (error) {
      toast.error("Error de conexión", { autoClose: 5000 });
      setErrorMessage("Error de conexión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async () => {
    if (!reservationToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        return;
      }

      const response = await fetch(
        `${apiUrl}/reservations/${reservationToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Reserva eliminada correctamente.", { autoClose: 5000 });
        setReservations((prev) =>
          prev.filter(
            (reservation) => reservation.id !== reservationToDelete.id
          )
        );
      } else {
        toast.error("Error al eliminar la reserva.");
      }
    } catch (error) {
      toast.error("Error de conexión", { autoClose: 5000 });
    } finally {
      setOpenModal(false);
      setReservationToDelete(null);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Reserva
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora de Inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora de Fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portátil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(
                    new Date(reservation.reservation_date),
                    "d 'de' MMMM - yyyy",
                    { locale: es }
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(
                    new Date(`1970-01-01T${reservation.start_time}Z`),
                    "h:mm a",
                    { locale: es }
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(
                    new Date(`1970-01-01T${reservation.end_time}Z`),
                    "h:mm a",
                    { locale: es }
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reservation.serial}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {reservation.reservation_state_name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setReservationToDelete(reservation);
                      setOpenModal(true);
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se
          puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteReservation} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReservationsList;
