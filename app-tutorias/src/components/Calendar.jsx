/* eslint-disable no-unused-vars */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState, useEffect } from 'react';
import { supabase } from './supabase/SupabaseCliente';
import useZoomMeeting from './hooks/useZoomMeeting';
import zoomIcon from '../assets/zoom-icon.png';

function Calendar() {
  const [eventos, setEventos] = useState([]);

  const [user, setUser] = useState(null);

  // Importa la función handleEventAdd desde useZoomMeeting
  const { handleEventAdd } = useZoomMeeting();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        console.log("ID del usuario:", session.user.id);
      }
    };

    getCurrentUser();

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

  const fetchEventos = async (userId) => {
    // Primero, busca el fk_user_profile numérico correspondiente al UUID del usuario en user_profile
    const { data: userData, error: userError } = await supabase
      .from('user_profile')
      .select('id')
      .eq('user_id', userId)  // Cambia 'uuid' al campo correcto que almacena el UUID
      .single();

    if (userError) {
      console.error("Error al obtener el perfil del usuario:", userError);
      return;
    }

    const fkUserProfile = userData?.id;



    const { data: tutoriasData, error: tutoriasError } = await supabase
      .from('user_tutorias')
      .select('id, user:user_profile!fk_user_profile(name), admin:user_profile!fk_admin_profile(name), date, url_zoom')
      .eq('fk_user_profile', fkUserProfile)
      .order('date', { ascending: true });
    console.log("Tutorias:", tutoriasData);

    if (tutoriasError) {
      console.error('Error al obtener eventos:', tutoriasError);
    } else {
      const eventosFormateados = tutoriasData.map(evento => ({
        id: evento.id,
        title: `Tutoria con ${evento.admin?.name || 'Desconocido'}`,
        start: evento.date,
        zoom_link: evento.url_zoom // Asegúrate de incluir el zoom_link si está en la base de datos
      }));
      setEventos(eventosFormateados);
    }
  };

  const renderEventContent = (eventInfo) => (
    <div className="bg-gray-100 rounded-md p-1 w-full text-sm flex flex-col items-start">
      <div className="flex items-center space-x-1">
        <i className="event-icon text-xs">📅</i>
        <strong>
          {new Date(eventInfo.event.start).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </strong>
      </div>
      <span className="truncate">{eventInfo.event.title}</span>
      {eventInfo.event.extendedProps?.zoom_link && (
        <div
          className="mt-1 px-1 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1 cursor-pointer"
          onClick={() => window.open(eventInfo.event.extendedProps.zoom_link, '_blank')}
        >
          <img src={zoomIcon} alt="Zoom" className="w-3 h-3" />
          <span>Join zoom</span>
        </div>
      )}
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
        eventAdd={(info) => handleEventAdd(info.event)}
      />
    </div>
  );
}

export default Calendar;
