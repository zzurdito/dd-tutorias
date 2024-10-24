import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useState, useEffect } from 'react'
import { supabase } from './supabase/SupabaseCliente'


function Calendar() {

const [eventos, setEventos] = useState([]);

  // Función para obtener los eventos de Supabase
  
  const fetchEventos = async () => {
    const { data:tutoriasData, error:tutoriasError } = await supabase
      .from('user_tutorias')  // Nombre de la tabla en Supabase
      .select('id, id_usuario, usuario!id_admin(name), fecha');  // Seleccionamos las columnas relevantes

    if (error) {
      console.error('Error al obtener eventos:', error);
    } else {
      // Formateamos los datos para que sean compatibles con FullCalendar
      const eventosFormateados = data.map(evento => ({
        id: evento.id,
        title: `Tutoria con ${evento.usuario.name}`,  // Título personalizado
        start: evento.fecha  // Usamos la fecha para el campo 'start'
      }));
      setEventos(eventosFormateados);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className= "bg-gray-100 rounded-md p-2 w-full"> 
        <i className="event-icon">📅  </i>
        <strong>
        {new Date(eventInfo.event.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true //am / pm
        })}
        </strong>
        <br></br>
        <span>{eventInfo.event.title}</span>
    </div>
  );
  };
  useEffect(() => {
    // Llamamos a la función para obtener los eventos al montar el componente
    fetchEventos();
  }, []);


  return (
    <div className='grow m-2'>
      <FullCalendar 
        plugins={[ dayGridPlugin ]}
        initialView='dayGridMonth'
        startParam='monday'
        height={700}
        firstDay={1}
        events={eventos}
        eventContent={renderEventContent}
        />
    </div>
  )
}

export default Calendar