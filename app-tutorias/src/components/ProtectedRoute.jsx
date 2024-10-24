import { useEffect, useState } from 'react';
import { supabase } from './supabase/SupabaseCliente';  // Cliente de Supabase
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario tiene una sesión activa
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/login');  // Si no hay sesión, redirigir al login
      }
    };

    checkSession();
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Puedes mostrar un spinner de carga o algo similar
  }

  return children;  // Si el usuario está autenticado, renderiza el contenido
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
