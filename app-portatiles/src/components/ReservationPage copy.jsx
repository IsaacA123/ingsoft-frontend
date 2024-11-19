import React, { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const ReservationPage = () => {
  const { laptopId } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [reservedList, setReservedList] = useState([]);
  const [reservationDate, setReservationDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateError, setDateError] = useState("");

  // Función para verificar si una fecha es válida para reservar
  const isDateDisabled = ({ date }) => {
    // Bloquear domingos
    if (date.getDay() === 0) return true;
    
    // Bloquear fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    return false;
  };

  // Función para validar el rango de horas
  const validateTimeRange = (start, end) => {
    if (!start || !end) return true;
    
    const startMinutes = parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
    const endMinutes = parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);
    
    // Validar que la hora de fin sea posterior a la de inicio
    return endMinutes > startMinutes;
  };

  // Función para obtener la información del portátil
  const fetchLaptopDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        navigate("/login");
        return;
      }

      setLoading(true);
      const response = await fetch(`${apiUrl}/laptops/${laptopId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setLaptop(data.data);
      setReservedList(data.data.reservations);
    } catch (error) {
      toast.error(error.message || "Error al obtener los detalles del portátil.");
      navigate("/laptops");
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar conflictos de horario
  const checkTimeConflict = (selectedDate, start, end) => {
    return reservedList.some(reservation => {
      if (reservation.Date.split("T")[0] !== selectedDate) return false;
      
      const reservationStart = reservation.startTime;
      const reservationEnd = reservation.endTime;
      
      return (start >= reservationStart && start < reservationEnd) ||
             (end > reservationStart && end <= reservationEnd) ||
             (start <= reservationStart && end >= reservationEnd);
    });
  };

  // Función para manejar la reserva
  const handleReserve = async () => {
    try {
      if (!validateTimeRange(startTime, endTime)) {
        setDateError("La hora de fin debe ser posterior a la hora de inicio.");
        return;
      }

      if (checkTimeConflict(reservationDate, startTime, endTime)) {
        setDateError("Existe un conflicto con otra reserva en ese horario.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${apiUrl}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_date: reservationDate,
          start_time: startTime,
          end_time: endTime,
          laptop_id: laptopId,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        let error = "Error desconocido"
        if(result.code==='INVALID_INPUT') error = result.data[0]
        throw new Error(error);
      }

      toast.success("Reserva realizada con éxito.");
      setOpenModal(false);
      navigate("/mis-reservas");
    } catch (error) {      
      console.log(error);
      // toast.error(error.message || "Error al realizar la reserva.");
      setDateError(error.message)
    }
  };

  useEffect(() => {
    fetchLaptopDetails();
  }, [laptopId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography>Cargando...</Typography>
      </div>
    );
  }

  const getReservedDates = () => {
    return reservedList.map((reservation) => reservation.Date.split("T")[0]);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Reservar Portátil</h1>
        <p className="text-gray-600">
          Selecciona una fecha y hora para reservar el portátil.
          Los domingos no están disponibles para reservas.
        </p>
      </header>

      {laptop && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <Typography variant="h6" className="font-bold mb-2">
              {laptop.name}
            </Typography>
            <Typography className="text-gray-600">
              {laptop.description}
            </Typography>
          </div>

          <Calendar
            onChange={(date) => {
              const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0];
              setReservationDate(localDate);
              setDateError("");
            }}
            value={reservationDate ? new Date(`${reservationDate}T00:00:00`) : null}
            tileDisabled={isDateDisabled}
            tileClassName={({ date, view }) => {
              if (view === "month") {
                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                  .toISOString()
                  .split("T")[0];
                if (getReservedDates().includes(localDate)) {
                  return "bg-red-100 text-red-800";
                }
              }
            }}
            className="mb-6 mx-auto"
          />

          {dateError && (
            <Typography color="error" className="mb-4 text-center">
              {dateError}
            </Typography>
          )}

          <div className="space-y-4">
            <TextField
              label="Hora de inicio"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setDateError("");
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: "08:00", max: "18:00" }}
            />

            <TextField
              label="Hora de fin"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setDateError("");
              }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: "08:00", max: "18:00" }}
            />
          </div>

          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            disabled={!reservationDate || !startTime || !endTime}
            className="mt-6 w-full"
          >
            Confirmar Reserva
          </Button>

          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-title"
          >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                className="mb-4"
              >
                Confirmar Reserva
              </Typography>
              <Typography className="mb-6">
                ¿Estás seguro de que deseas reservar el portátil para el{" "}
                {reservationDate} de {startTime} a {endTime}?
              </Typography>
              <div className="flex space-x-4">
                <Button
                  variant="outlined"
                  onClick={() => setOpenModal(false)}
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleReserve}
                  fullWidth
                >
                  Confirmar
                </Button>
              </div>
            </Box>
          </Modal>
        </section>
      )}
    </div>
  );
};

export default ReservationPage;