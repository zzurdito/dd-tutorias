import { useState, useEffect } from 'react'
import { supabase } from './supabase/SupabaseCliente'

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    surname: '',
    username: ''
  });
  const [error, setError] = useState(''); // Estado para manejar el error de validación
  

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
      
      <strong>
        {new Date(eventInfo.start).toLocaleTimeString([], {
          month: '2-digit',
          day:'2-digit',
          year:'2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}
      </strong>
      <br />
      <span>{eventInfo.title}</span>
      
    </div>
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedProfile.name || !editedProfile.surname || !editedProfile.username) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError('');

    try {
      const { error } = await supabase
        .from('user_profile')
        .update({
          name: editedProfile.name,
          surname: editedProfile.surname,
          username: editedProfile.username,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        name: editedProfile.name,
        surname: editedProfile.surname,
        username: editedProfile.username,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error.message);
    }
  };
  

  

  if (loading) return <div>Loading...</div>;
  

  
  




  
  

  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full ml-2 pr-2 ">
      {isEditing ? (
        <div className="max-h-max w-full p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
          <div className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex text-xl space-x-1 border-b border-gray-300 pb-2">
              <div className="font-bold">Nombre:</div>
              <input
                type="text"
                name="name"
                value={editedProfile.name || ''}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
            </div>

            <div className="flex text-xl space-x-1 border-b border-gray-300 pb-2">
              <div className="font-bold">Apellidos:</div>
              <input
                type="text"
                name="surname"
                value={editedProfile.surname || ''}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
            </div>

            <div className="flex text-xl space-x-1 border-b border-gray-300 pb-2">
              <div className="font-bold">Nombre de usuario:</div>
              <input
                type="text"
                name="username"
                value={editedProfile.username || ''}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Guardar cambios
            </button>
          </div>
          </div>
        ) : (
      <div className="max-h-max w-full p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
  <h2 className="block text-3xl font-medium text-gray-700">Datos del usuario: {profile?.username}</h2>
  
  
  <div className="flex text-xl space-x-1">
    <div className="font-bold">Nombre:</div>
    <div>{profile?.name}</div>
  </div>

  <div className="flex text-xl space-x-1">
    <div className="font-bold">Apellidos:</div>
    <div>{profile?.surname}</div>
  </div>

  <div className="flex text-xl space-x-1">
    <div className="font-bold">Grado:</div>
    <div>{profile?.grade}</div>
  </div>

  <div className="flex text-xl space-x-1">
    <div className="font-bold">Email:</div>
    <div>{email}</div>
  </div>

  
  <button onClick={handleEditClick} className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500">Edit Profile</button>


</div>
)}

      <div className="max-h-max w-full  p-8 my-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div><h2 className="block text-3xl font-medium text-gray-700 ">Citas pendientes</h2></div>
        <div className='grid gap-y-4'>

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