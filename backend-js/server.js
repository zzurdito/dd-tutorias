const express = require('express');
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');
const app = express();
const port = 3001;

const clientId = 'he5W2Uh5S5aL_mw3Udk5ow';
const clientSecret = 'juWc3MhpqQY6KqdPs3SLUfJdBQ5QIgwx';
const redirectUri = 'http://localhost:3001/auth/zoom/callback';

// Variable para almacenar temporalmente el token de acceso
let accessToken = null;

app.use(cors({ origin: 'http://localhost:3000' }));

// Redirige a la página de autorización de Zoom
app.get('/auth/zoom', (req, res) => {
  const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(authorizationUrl);
});

// Callback para manejar la respuesta de Zoom
app.get('/auth/zoom/callback', async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) {
    console.error("No se recibió el código de autorización en la URL de callback.");
    return res.status(400).json({ error: 'No se recibió el código de autorización' });
  }

  console.log("Código de autorización recibido:", authCode);

  try {
    // Intercambia el código de autorización por un token de acceso
    const tokenResponse = await axios.post(
      'https://zoom.us/oauth/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = tokenResponse.data.access_token;
    console.log('Token de acceso obtenido:', accessToken);

    res.json({ message: 'Token de acceso obtenido con éxito', access_token: accessToken });
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al obtener el token de acceso' });
  }
});

// Endpoint para crear una reunión de Zoom
app.post('/createZoomMeeting', async (req, res) => {
  try {
    if (!accessToken) {
      return res.status(401).json({ error: 'Token de acceso no disponible. Autoriza primero la aplicación.' });
    }

    // Define los detalles de la reunión
    const meetingDetails = {
      topic: 'Nueva reunión',
      type: 1, // Tipo de reunión: instantánea
      settings: {
        host_video: true,
        participant_video: true,
      },
    };

    // Realiza la solicitud a la API de Zoom para crear una reunión
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      meetingDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Devuelve el enlace de la reunión al cliente
    res.json({ meetingLink: response.data.join_url });
  } catch (error) {
    console.error('Error al crear la reunión:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al crear la reunión' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
