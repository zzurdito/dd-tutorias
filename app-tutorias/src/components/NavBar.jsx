import './styles/NavBar.css'
import LogOutBtn from './LogOutBtn'
import {Link} from 'react-router-dom'
import VoucherBtn from './VoucherBtn'
import { useState, useEffect } from 'react'
import { supabase } from '../components/supabase/SupabaseCliente'

function NavBar() {

  const [tokens, setTokens] = useState(0);

useEffect(() => {
  const fetchUserTokens = async () => {
    const { data: sessionData , error: sessionError} = await supabase.auth.getSession();

    if(sessionError) {
      console.error('Error fetching tokens:', sessionError);
      return;
    }
    const user = sessionData.session?.user;

    if (user) {
      // Consultar los tokens del usuario usando el user_id
      const { data, error } = await supabase
        .from('user_tokens')
        .select('token')
        .eq('user_id', user.id);  // user.id contiene el UUID del usuario autenticado

      if (error) {
        console.error('Error fetching user tokens:', error);
        console.error('Error fetching user tokens:', error.message || error);

      } else if (data && data.length > 0) {
        let totalTokens = 0; //si hay mas de una fila, sumamos los tokens
        for(let i = 0; i < data.length; i++) {
          totalTokens += data[i].token;
        }
        
        // Actualizamos el estado con la suma de los tokens obtenidos
        setTokens(totalTokens);
        // Suponiendo que solo hay una fila por usuario
      }
    }
  };

  fetchUserTokens();  // Llamar a la función para obtener los tokens al cargar el componente
    
}, []);

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
          <div className="tokens text-white font-bold text-3xl">{tokens} tokens</div>
          <VoucherBtn />
          <LogOutBtn />
        </div>
      </nav>
    </div>
  )
}

export default NavBar