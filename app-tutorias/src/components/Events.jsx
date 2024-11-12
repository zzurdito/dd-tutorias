import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase/SupabaseCliente'

function Events() {
  const [user, setUser]= useState('');
  const [loading, setLoading] = useState(true);
  const [showSelection, setShowSelection] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');
  const [tutores, setTutores]=useState([]);
  const [tutorId, setTutorId]=useState('');
  const [tokens, setTokens]=useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  // useEffect para manejar la autenticación y los eventos
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchTokens(session.user.id);
        await infoTutor();
        if (selectedTutor) {
          obtenerIdProfesor(selectedTutor); // Solo obtener el id del tutor si ya está seleccionado
        }
        
        
      }
      
    };
    fetchUser();
  }, [selectedTutor]);

  const infoTutor = async () => {
    const {data, error } = await supabase
    .from('user_profile')
    .select('user_id, name')
    .eq('admin', true);
    if (error){
      console.error('Error al obtener eventos:', error);

    } else {
      
      setTutores(data || []);
      
    }
     
  }
  const handleConfirmAppointment = async (hora) => {
    if (tokens > 0) {
      try {
        // Formatear la fecha completa para la cita (fecha seleccionada + hora seleccionada)
        const fechaCita = `${selectedDate} ${hora}:00`; // Formato: YYYY-MM-DD HH:MM:SS
  
        // 1. Obtener el ID del usuario actual (el alumno) desde la tabla 'user_profile'
        const { data: userProfileData, error: userProfileError } = await supabase
          .from('user_profile')
          .select('id')  // Seleccionamos solo el 'id' del alumno
          .eq('user_id', user.id)  // Filtramos por el UUID del usuario (de supabase.auth)
          .single();
  
        if (userProfileError) {
          console.error('Error al obtener el ID del alumno:', userProfileError);
          return;
        }
  
        const alumnoId = userProfileData.id; // ID del alumno
  
        // 2. Consumir un token
        const { data: userTokens, error: tokenError } = await supabase
          .from('user_tokens')
          .select('token')
          .eq('user_id', user.id)
          .single();
  
        if (tokenError) {
          console.error('Error al obtener tokens:', tokenError);
          return;
        }
  
        if (userTokens.token <= 0) {
          alert('No tienes suficientes tokens para agendar la cita');
          return;
        }
  
        // Restar un token
        await supabase
          .from('user_tokens')
          .update({ token: userTokens.token - 1 })
          .eq('user_id', user.id);
  
        // 3. Insertar la cita en la tabla 'user_tutorias'
        await supabase
          .from('user_tutorias')
          .insert([
            {
              date: fechaCita, // Fecha completa con hora
              fk_user_profile: alumnoId, // ID del alumno desde 'user_profile'
              fk_admin_profile: tutorId, // ID del profesor (ya tenemos 'tutorId')
            }
          ]);
  
        alert('Cita agendada correctamente');
        // Actualizar el estado de tokens después de la acción
        fetchTokens(user.id); // Re-fetch tokens
  
      } catch (error) {
        console.error('Error al confirmar la cita:', error);
      }
    } else {
      alert('No tienes suficientes tokens para agendar la cita');
    }
  };
  const obtenerIdProfesor = async (userId) => {
    try {
      // Realiza la consulta en la tabla user_profile filtrando por el UUID del profesor
      const { data, error } = await supabase
        .from('user_profile')
        .select('id') // Queremos obtener solo el id
        .eq('user_id', userId) // Filtramos por el UUID del profesor
        .single(); // Esto asume que debería haber solo un resultado
  
      if (error) {
        console.error('Error al obtener el ID del profesor:', error);
        return;
      }
  
      // Si la consulta fue exitosa, el resultado será el id del profesor
      if (data) {
        const tutorId = data.id; // Obtenemos el id del primer (y único) resultado
        console.log('El ID del tutor es:', tutorId);
        setTutorId(tutorId); // Guardamos el id en el estado
      }
    } catch (error) {
      console.error('Error en la consulta:', error);
    }
  };
  const fechtHoraComp = async () => {
    try {
      const { data: tutorias, error } = await supabase
        .from('user_tutorias')
        .select('date') // Selecciona solo la columna de fecha
        .eq('fk_admin_profile', tutorId) // Filtra por el ID del profesor seleccionado
        .gte('date', `${selectedDate} 00:00:00`) // Desde el inicio del día seleccionado
        .lte('date', `${selectedDate} 23:59:59`); // Hasta el final del día seleccionado
  
      if (error) {
        console.error('Error al obtener horarios reservados:', error);
        return;
      }
  
      // Extrae solo las horas de las tutorías ya reservadas
      const horasReservadas = tutorias.map(tutoria => {
        const date = new Date(tutoria.date);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formato HH:MM
      });
  
      // Define el rango de horarios disponibles (de 09:00 a 15:00 en intervalos de una hora)
      const todasLasHoras = Array.from({ length: 7 }, (_, i) => {
        const hora = 9 + i; // Horas de 9 a 15
        return `${hora.toString().padStart(2, '0')}:00`; // Formato HH:00
      });
  
      // Filtra las horas disponibles, excluyendo las ya reservadas
      const horasDisponibles = todasLasHoras.filter(hora => !horasReservadas.includes(hora));
      
      setHorariosDisponibles(horasDisponibles); // Guarda las horas disponibles en el estado
    } catch (error) {
      console.error('Error en fechtHoraComp:', error);
    }
  };
  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  const handleConfirmTutorAndDate = () => {
    if (selectedTutor && selectedDate) {
      
      setShowSelection(false);
      fechtHoraComp();
      console.log(selectedTutor)
    } else {
      alert('Por favor selecciona un tutor y una fecha');
    }
  };
  const fetchTokens = async (userId) => {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('token')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      setTokens(0);
    } else if(error) {
      console.error('Error al obtener tokens:', error);
    } else {
      setTokens(data?.token || 0); // Si existe, asigna el valor de tokens
    }
  };
  
  

  



  
    

  


  
  return (
    <div className="flex items-center justify-center bg-gray-100 h-full w-full">
      {showSelection ? (

        <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Agendar Cita</h2>
        <label className="block mb-2">Tutor:</label>
        <select
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => setSelectedTutor(e.target.value)}
              value={selectedTutor}
            >
              <option value="">Selecciona un tutor</option>
              {tutores.map(tutores => (
                <option key={tutores.user_id} value={tutores.user_id}>{tutores.name}</option>
              ))}
            </select>
            <label className="block mb-2">Fecha:</label>
            <input
              type="date"
              className="w-full p-2 border rounded mb-4"
              min={getTomorrowDate()}
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleConfirmTutorAndDate}
            >
              Confirmar Tutor y Fecha
              </button>
        </div>
      ): tokens <= 0 ? (
        <div className="bg-red-100 p-8 rounded shadow-lg w-1/3 text-center">
          <h2 className="text-2xl font-bold mb-4">Tokens Insuficientes</h2>
          <p>Debes comprar más tokens para agendar una cita.</p>
        </div>
      ) :
      (<div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Horarios Disponibles</h2>
        <div className="grid grid-cols-3 gap-4">
          
          {horariosDisponibles.slice(0, 7).map((hora, index) => (
            <div key={index} className="bg-blue-100 p-4 rounded text-center">
              <p>{hora}</p>
              <button
            className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
            onClick={() => handleConfirmAppointment(hora)}
          >Confirmar cita</button>
            </div>
          ))}
        </div>
      </div>)
    }

    </div>
  )
}

export default Events