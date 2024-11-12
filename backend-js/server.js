// backend/server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// Sustituye estos valores con tus credenciales
const clientId = 'f77MuQFRw6WecqZJmwFOA';
const clientSecret = 'mZqldeNjTQs7iOx73LAa95iruAnH8axE'; // Guarda este secreto seguro y no lo expongas

app.get('/createZoomMeeting', async (req, res) => {
  try {
    // Obtener el token de acceso usando client credentials grant
    const response = await axios.post(
      'https://zoom.us/oauth/token?grant_type=client_credentials',
      null,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        }
      }
    );

    const accessToken = response.data.access_token;

    // Crear la reunión de Zoom
    const meetingResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'Reunión Generada',
        type: 1, // Instant Meeting
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json({ meetingLink: meetingResponse.data.start_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reunión de Zoom' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
