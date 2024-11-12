import { useState, useEffect } from 'react'
import { supabase } from './supabase/SupabaseCliente'

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Obtener el UID del usuario autenticado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        setEmail(user.email); // Guardar el email desde Auth

        // Consultar la tabla `user_profile` usando el UID
        const { data, error: profileError } = await supabase
          .from('user_profile')
          .select('name, surname, grade, username')
          .eq('user_id', user.id)
          .single(); // single() obtiene solo un registro

        if (profileError) throw profileError;

        setProfile(data); // Guardar los datos del perfil
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
      const today = new Date(); // Fecha de hoy
      const eventosFormateados = tutoriasData
        .filter(evento => new Date(evento.date) >= today) // Filtra eventos a partir de hoy
        .map(evento => ({
          id: evento.id,
          title: `Tutoria con ${evento.admin?.name || 'Desconocido'}`,
          start: evento.date,
        }));
      setEventos(eventosFormateados);
    }
  };
  const renderEventContent = (eventInfo) => (
    <div className="bg-gray-100 rounded-md p-2 w-full">
      <i className="event-icon">📅 </i>
      console.log(eventInfo)
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

  if (loading) return <div>Loading...</div>;
  

  
  




  
  

  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full ml-2 ">
      <div className="max-h-max w-full p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="block text-3xl font-medium text-gray-700">Datos del usuario: {profile?.username}</h2>
        <div className="block text-xl font-bold">Nombre: {profile?.name}</div>
        <div className="block text-xl font-bold">Apellidos: {profile?.surname}  </div>
        <div className="block text-xl font-bold">Grado:{profile?.grade}  </div>
        <div className="block text-xl font-bold">Email:{email}  </div>
        <button className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500">Edit Profile</button>
      </div>
      <div className="max-h-max w-full p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div><h2 className="block text-3xl font-medium text-gray-700 ">Citas pendientes</h2></div>
        <div>
          {console.log('evento:'+ eventos) }
          {eventos.length > 0 ? (
            
            eventos.map(evento => <div key={evento.id}>{renderEventContent(evento)}</div> )
            
          ) : (
            <p>No tienes citas pendientes.</p>
          )}
        </div>


        
      </div>
    </div>
  )
}

export default MyProfile