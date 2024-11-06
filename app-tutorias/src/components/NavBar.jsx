/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import './styles/NavBar.css';
import LogOutBtn from './LogOutBtn';
import { Link } from 'react-router-dom';
import VoucherBtn from './VoucherBtn';
import { useState, useEffect } from 'react';
import { supabase } from '../components/supabase/SupabaseCliente';

function NavBar() {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserTokens = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error fetching tokens:', sessionError);
        return;
      }

      const user = sessionData.session?.user;

      if (user) {
        // Consultar los tokens del usuario usando el user_id
        const { data, error } = await supabase
          .from('user_tokens')
          .select('token')
          .eq('user_id', user.id); // user.id contiene el UUID del usuario autenticado

        if (error) {
          console.error('Error fetching user tokens:', error);
        } else if (data && data.length > 0) {
          const totalTokens = data.reduce((sum, row) => sum + row.token, 0);
          setTokens(totalTokens);
        }
      }
    };

    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        //console.log("ID del usuario:", session.user.id);
        await fetchEventos(session.user.id);
      }
    };

    fetchUserTokens();
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
    // Buscar el id numérico en user_profile correspondiente al UUID del usuario
    const { data: userData, error: userError } = await supabase
      .from('user_profile')
      .select('id, admin') // Incluimos el campo 'admin' para verificar si es administrador
      .eq('user_id', userId)
      .single();

    if (userError) {
      console.error("Error al obtener el perfil del usuario:", userError);
      return;
    }

    setIsAdmin(userData?.admin || false); // Si existe el campo 'admin', actualizamos el estado
  };

  return (
    <div className="navbar h-full flex bg-blue-500 w-64">
      {/* Navbar vertical */}
      <nav className="w-64 flex flex-col">
        {/* Enlaces principales */}
        <div className="principal-ref">
          <Link to="/content/calendar" className="btn-navbar bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">Calendar</Link>
          <Link to="/content/events" className="btn-navbar bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">Events</Link>
          <Link to="/content/profile" className="btn-navbar bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">My profile</Link>
        </div>
        <div className="info principal-ref">
          {!isAdmin && (
            <>
              <div className="tokens text-white font-bold text-3xl">{tokens} tokens</div>
              <VoucherBtn />
            </>
          )}
          <LogOutBtn />
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
