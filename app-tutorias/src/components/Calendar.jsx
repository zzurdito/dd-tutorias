import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState, useEffect } from 'react';
import { supabase } from './supabase/SupabaseCliente';

function Calendar() {
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState(null);

  // useEffect para manejar la autenticación y los eventos
  useEffect(() => {
    const getCurrentUserAndFetchEvents = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchEventos(session.user.id);
      }

      // Escucha cambios en la autenticación
      supabase.auth.onAuthStateChange((_event, session) => {
        const newUser = session?.user || null;
        setUser(newUser);
        if (newUser) fetchEventos(newUser.id);
      });
    };

    getCurrentUserAndFetchEvents();
  }, []);

  // Función para obtener los eventos de Supabase
  const fetchEventos = async (userId) => {
    const { data: tutoriasData, error: tutoriasError } = await supabase
      .from('user_tutorias')
      .select('id, user_profile!fk_user_profile (name), admin_profile!fk_admin_profile (name), date')
      .eq('id_usuario', userId)
      .order('date', { ascending: true });

    if (tutoriasError) {
      console.error('Error al obtener eventos:', tutoriasError);
    } else {
      // Formateamos los datos para FullCalendar
      const eventosFormateados = tutoriasData.map(evento => ({
        id: evento.id,
        title: `Tutoria con ${evento.user_profile?.name || 'Desconocido'}`,
        start: evento.date
      }));
      setEventos(eventosFormateados);
    }
  };

  const renderEventContent = (eventInfo) => (
    <div className="bg-gray-100 rounded-md p-2 w-full">
      <i className="event-icon">📅 </i>
      <strong>
        {new Date(eventInfo.event.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}
      </strong>
      <br />
      <span>{eventInfo.event.title}</span>
    </div>
  );

  return (
    <div className='grow m-2'>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        startParam='monday'
        height={700}
        firstDay={1}
        events={eventos}
        eventContent={renderEventContent}
      />
    </div>
  );
}

export default Calendar;
