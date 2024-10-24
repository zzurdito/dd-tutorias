import Layout from './components/Layout';
import Login from './components/Login';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css';
import './output.css';
import Calendar_Page from './components/Calendar_Page';
import Events_Page from './components/Events_Page';
import MyProfile_Page from './components/MyProfile_Page';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { supabase } from './components/supabase/SupabaseCliente'

function App() {
  const [session, setSession] = useState(false);

  // useEffect para manejar la sesión
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session); // Establece la sesión si existe
    };

    getSession(); // Llamada inicial para obtener la sesión

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session); // Actualiza la sesión cuando cambia
      }
    );

    return () => {
      authListener.subscription.unsubscribe(); // Limpia el listener cuando el componente se desmonta
    };
  }, []);

  return (
    <Routes>
      {/* Layout general que siempre se muestra */}
      <Route path="/" element={<Layout />}>
        {/* Si no hay sesión, se muestra Login o Register */}
        {!session ? (
          <>
            <Route path='/' element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </>
        ) : (
          <>
            {/* Rutas solo accesibles si hay sesión */}
            <Route path="content" element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }>
              <Route path="calendar" element={<Calendar_Page />} />
              <Route path="events" element={<Events_Page />} />
              <Route path="profile" element={<MyProfile_Page />} />
            </Route>
          </>
        )}
      </Route>
    </Routes>
  );
}

export default App;
