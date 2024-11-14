import { useState } from 'react';
import { supabase } from '../supabase/SupabaseCliente'; // Importa el cliente de Supabase

function useZoomMeeting() {
  const [meetingLink, setMeetingLink] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Control para evitar duplicados

  const generateZoomLink = async () => {
    if (isProcessing) return; // Evita llamadas duplicadas
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:3001/createZoomMeeting', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);

      if (data.meetingLink) {
        setMeetingLink(data.meetingLink);
        console.log('Enlace de Zoom generado:', data.meetingLink);

        // Verifica si ya existe el enlace en la base de datos
        const { data: existingEntry } = await supabase
          .from('user_tutorias')
          .select('id')
          .eq('url_zoom', data.meetingLink)
          .single();

        if (existingEntry) {
          console.log('El enlace ya existe en la base de datos.');
        } else {
          // Guarda el nuevo enlace
          const { error } = await supabase
            .from('user_tutorias')
            .insert([{ url_zoom: data.meetingLink }]);

          if (error) {
            console.error('Error al guardar el enlace en Supabase:', error);
          } else {
            console.log('Enlace guardado en Supabase correctamente');
          }
        }

        return data.meetingLink;
      } else {
        console.error('No se recibió un enlace de reunión válido:', data);
        return null;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error.message);
      return null;
    } finally {
      setIsProcessing(false); // Libera el bloqueo
    }
  };

  return { meetingLink, generateZoomLink, isProcessing };
}

export default useZoomMeeting;

