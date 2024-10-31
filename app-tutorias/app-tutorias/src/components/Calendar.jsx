/* eslint-disable no-unused-vars */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState, useEffect } from 'react';
import { supabase } from './supabase/SupabaseCliente';

function Calendar() {
  const [eventos, setEventos] = useState([]);
  
  const [user, setUser] = useState(null);

  // useEffect para manejar la autenticación y los eventos
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    getCurrentUser();

    // Escucha cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user || null;
      setUser(newUser);
      if (newUser) {
        fetchEventos(newUser.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Función para obtener los eventos de Supabase
  const fetchEventos = async (userId) => {
    const { data: tutoriasData, error: tutoriasError } = await supabase
      .from('user_tutorias')
      .select('id, user:user_profile!fk_user_profile(name), admin:user_profile!fk_admin_profile(name), date')
      .eq('user_profile.user_id', userId)
      .order('date', { ascending: true });

    console.log(userId); // Llamada única a consola

    if (tutoriasError) {
      console.error('Error al obtener eventos:', tutoriasError);
    } else {
      console.log(tutoriasData); // Llamada única a consola
      // Formateamos los datos para FullCalendar
      const eventosFormateados = tutoriasData.map(evento => ({
        id: evento.id,
        title: `Tutoria con ${evento.admin?.name || 'Desconocido'}`,
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

