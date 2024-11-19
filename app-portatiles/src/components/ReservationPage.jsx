import React, { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format, isPast } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const [dailyReservations, setDailyReservations] = useState([]);
  const [fines, setFines] = useState([]);
  const [finesLoading, setFinesLoading] = useState(false);

  const MIN_HOUR = 8;
  const MAX_HOUR = 18;

  // Generar opciones de hora disponibles
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = MIN_HOUR; hour <= MAX_HOUR; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      options.push(`${formattedHour}:00`);
      if (hour < MAX_HOUR) { // No agregar :30 para la última hora
        options.push(`${formattedHour}:30`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Filtrar las horas de fin disponibles basadas en la hora de inicio
  const getAvailableEndTimes = () => {
    if (!startTime) return [];
    const startIndex = timeOptions.indexOf(startTime);
    return timeOptions.slice(startIndex + 1);
  };

  const isDateDisabled = ({ date }) => {
    if (date.getDay() === 0) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    return false;
  };

  const getReservedDates = () => {
    return reservedList.map((reservation) => reservation.Date.split("T")[0]);
  };

  const getDailyReservations = (selectedDate) => {
    const dayReservations = reservedList.filter(
      (reservation) => reservation.Date.split("T")[0] === selectedDate
    );

    return dayReservations.sort((a, b) => {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });
  };

  const validateTimeRange = (start, end) => {
    if (!start || !end) return true;
    return true;
  };

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

  const handleStartTimeChange = (event) => {
    const newStartTime = event.target.value;
    setStartTime(newStartTime);
    setEndTime(""); // Resetear la hora de fin cuando cambia la hora de inicio
    setDateError("");
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
    setDateError("");
  };

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

  // Verificar las multas activas
  const fetchFines = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        return;
      }

      setFinesLoading(true);
      const response = await fetch(`${apiUrl}/fines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setFines(data.data);
      } else {
        console.error("Error obteniendo las multas", data);
        toast.error(data.message || "Error al obtener las multas.");
      }
    } catch (error) {
      toast.error("Error de conexión", { autoClose: 5000 });
    } finally {
      setFinesLoading(false);
    }
  };

  // Verificar si el usuario tiene multas activas
  const hasActiveFines = fines.some(fine => !isPast(new Date(fine.end_date)));

  const handleReserve = async () => {
    // Verificar si el usuario tiene multas activas
    if (hasActiveFines) {
      toast.error("No puedes realizar una reserva mientras tengas multas activas.");
      return;
    }

    try {
      if (!validateTimeRange(startTime, endTime)) {
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
      navigate("/reservations");
    } catch (error) {      
      console.log(error);
      setDateError(error.message)
    }
  };

  useEffect(() => {
    if (reservationDate) {
      const reservations = getDailyReservations(reservationDate);
      setDailyReservations(reservations);
    }
  }, [reservationDate]);

  useEffect(() => {
    fetchLaptopDetails();
    fetchFines();
  }, [laptopId]);

  if (loading || finesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography>Cargando...</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {hasActiveFines ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Tienes multas activas. No podrás realizar reservas de portátiles hasta que estas expiren.
                <Link className="underline" to="/fines"> Revisa tus multas</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Reservar Portátil</h1>
          <p className="text-gray-600">
            Selecciona una fecha y hora para reservar el portátil.
            Los domingos no están disponibles para reservas.
            Horario disponible: 8:00 - 18:00
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
    
            {reservationDate && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <Typography variant="h6" className="mb-3 text-gray-800">
                  Reservas para el día {format(new Date(reservationDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
                </Typography>
    
                {dailyReservations.length > 0 ? (
                  <div className="space-y-2">
                    {dailyReservations.map((reservation, index) => (
                      <div key={index} className="p-2 bg-blue-50 border border-blue-100 rounded">
                        <Typography className="text-blue-800">
                          {reservation.startTime.slice(0, 5)} - {reservation.endTime.slice(0, 5)}
                        </Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography className="text-gray-600">
                    No hay reservas para este día.
                  </Typography>
                )}
              </div>
            )}
    
            {dateError && (
              <Typography color="error" className="mb-4 text-center">
                {dateError}
              </Typography>
            )}
    
            <div className="space-y-4 mb-4">
              <FormControl fullWidth>
                <InputLabel id="start-time-label">Hora de inicio</InputLabel>
                <Select
                  labelId="start-time-label"
                  value={startTime}
                  label="Hora de inicio"
                  onChange={handleStartTimeChange}
                >
                  {timeOptions.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
    
              <FormControl fullWidth>
                <InputLabel id="end-time-label">Hora de fin</InputLabel>
                <Select
                  labelId="end-time-label"
                  value={endTime}
                  label="Hora de fin"
                  onChange={handleEndTimeChange}
                  disabled={!startTime}
                >
                  {getAvailableEndTimes().map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                <Typography id="modal-title" variant="h6" component="h2" className="mb-4">
                  Confirmar Reserva
                </Typography>
                <Typography className="mb-6">
                  ¿Estás seguro de que deseas reservar el portátil para el {reservationDate} de {startTime} a {endTime}?
                </Typography>
                <div className="flex space-x-4">
                  <Button variant="outlined" onClick={() => setOpenModal(false)} fullWidth>
                    Cancelar
                  </Button>
                  <Button variant="contained" onClick={handleReserve} fullWidth>
                    Confirmar
                  </Button>
                </div>
              </Box>
            </Modal>
          </section>
        )}
        </>
      )}
  
      
    </div>
  );
  
  
};

export default ReservationPage;