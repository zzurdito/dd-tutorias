import { supabase } from './supabase/SupabaseCliente';

function LogOutBtn() {
  // Función para cerrar sesión
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      console.log('Sesión cerrada correctamente');
      window.location.reload(); // Refresca la página después de cerrar sesión
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
      Logout
    </button>
  );
}

export default LogOutBtn;
