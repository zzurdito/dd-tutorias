import { useState } from 'react';

function useZoomMeeting() {
  const [meetingLink, setMeetingLink] = useState('');

  const generateZoomLink = async () => {
    try {
      const response = await fetch('http://localhost:3001/createZoomMeeting');
      const data = await response.json();

      if (data.meetingLink) {
        setMeetingLink(data.meetingLink);
      } else {
        console.error('Error al generar el enlace:', data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div>
      <button onClick={generateZoomLink}>Generar Enlace de Zoom</button>
      {meetingLink && (
        <p>
          Enlace de Zoom: <a href={meetingLink} target="_blank" rel="noopener noreferrer">{meetingLink}</a>
        </p>
      )}
    </div>
  );
}

export default useZoomMeeting;
