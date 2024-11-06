import axios from 'axios';
import { supabase } from '../supabase/SupabaseCliente';

function useZoomMeeting() {
  const getAccessToken = async () => {
    const clientId = "f77MuQFRw6WecqZJmwFOA";  // CAMBIARLAS POR VARIABLES DE ENTORNO POR SEGURIDAD, EN ENTORNO DE PRUEBA ESTA CORRECTO ASI POR AHORA
    const clientSecret = "mZqldeNjTQs7iOx73LAa95iruAnH8axE";  // CAMBIARLAS POR VARIABLES DE ENTORNO POR SEGURIDAD, EN ENTORNO DE PRUEBA ESTA CORRECTO ASI POR AHORA

    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'client_credentials'
      },
      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  };

  const createZoomMeeting = async () => {
    const accessToken = await getAccessToken();

    const meetingDetails = {
      topic: 'Nueva Reunión',
      type: 2,
      start_time: new Date().toISOString(),
      duration: 30,
      timezone: 'UTC',
      agenda: 'Reunión generada automáticamente',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true
      }
    };
    try {
      const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingDetails, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.join_url;
    } catch (error) {
      console.error('Error al crear la reunión de Zoom:', error);
      return null;
    }
  };

  const saveEventToDatabase = async (event, zoomLink) => {
    const { data, error } = await supabase
      .from('user_tutorias')
      .insert([
        { ...event, zoom_link: zoomLink }
      ]);

    if (error) {
      console.error('Error al guardar el evento en Supabase:', error);
    } else {
      console.log('Evento guardado en Supabase:', data);
    }
  };

  const handleEventAdd = async (newEvent) => {
    const zoomLink = await createZoomMeeting();

    if (zoomLink) {
      const eventToSave = {
        title: newEvent.title,
        start: newEvent.start.toISOString(),
        end: newEvent.end ? newEvent.end.toISOString() : null,
        zoom_link: zoomLink,
      };

      await saveEventToDatabase(eventToSave, zoomLink);
    } else {
      alert('Error al crear la reunión de Zoom');
    }
  };

  return { handleEventAdd };
}

export default useZoomMeeting;
