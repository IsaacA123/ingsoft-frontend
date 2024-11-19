import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, List, ListItem, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import MyCalendar2 from './LaptopList';

// Componente LaptopLoanView
const MyCalendar = () => {
  const [availableLaptops, setAvailableLaptops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Cargar la lista de portátiles disponibles desde el servidor
  const fetchAvailableLaptops = async (date) => {
    setLoading(true);
    try {
      // Realiza una solicitud para obtener los portátiles disponibles para la fecha seleccionada
      const response = await axios.get(`/api/laptops/available`, { params: { date } });
      setAvailableLaptops(response.data);
    } catch (error) {
      console.error('Error fetching available laptops:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función que maneja el cambio de selección en el calendario
  const handleDateClick = (info) => {
    const selectedDate = info.dateStr; // Fecha seleccionada en el calendario
    setSelectedDate(selectedDate);
    fetchAvailableLaptops(selectedDate);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Portátiles Disponibles para Préstamo</Typography>

      {/* Calendario */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        dateClick={handleDateClick} // Captura la fecha seleccionada
        events={[]}  // Si deseas agregar eventos al calendario, lo puedes hacer aquí
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,dayGridMonth',
        }}
        editable
        selectable
      />

      {/* Si hay una fecha seleccionada, mostrar la lista de portátiles disponibles */}
      {selectedDate && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Portátiles disponibles para el {selectedDate}:</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <List>
              {availableLaptops.length > 0 ? (
                availableLaptops.map((laptop) => (
                  <ListItem key={laptop.id}>
                    {laptop.name} - {laptop.model}
                    <Button variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                      Solicitar préstamo
                    </Button>
                  </ListItem>
                ))
              ) : (
                <Typography>No hay portátiles disponibles para este día y hora.</Typography>
              )}
            </List>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
