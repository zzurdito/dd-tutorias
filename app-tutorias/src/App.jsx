import Layout from './components/Layout';
import Login from './components/Login';
import headerLogo from './images/InterfazHome/HeaderWebUniversae.png'
import { Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import './output.css';
import Calendar_Page from './components/Calendar_Page';
import Events_Page from './components/Events_Page';
import MyProfile_Page from './components/MyProfile_Page';
import { useState, useEffect } from 'react';
import { supabase } from './components/supabase/SupabaseCliente'

function App() {
  const [session, setSession] = useState(null);

  // useEffect para manejar la sesión
  useEffect(() => {
    // Función asíncrona para obtener la sesión
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

    // Limpia el listener cuando el componente se desmonta
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* Si no hay sesión, mostrar la página de login */}
      {!session ? (
          <div className="w-screen h-screen flex flex-col justify-between items-center">
            
          <header className=" w-full grow-0 flex items-center bg-blue-600 p-4 shadow-md">
            <div className="header w-full flex-shrink-0 flex flex-row justify-between">
              <div className="text-3xl logo"><img src={headerLogo} alt="Header logo" /></div>
                
            </div>
          </header>

          <main className="w-full grow">
            <Login />
          </main>

          <footer className="w-full grow-0 bg-gray-200 text-center p-4">
            © 2024 Tutorías Universae | Alejandro Gomez | Bryan Salazar

          </footer>
  </div>
      ) : (
        <Routes>
          <Route path='/' element={<Layout />}>
            {/* Ruta de contenido solo accesible si hay sesión */}
            <Route path="content" element={<Outlet />}>
              <Route path="calendar" element={<Calendar_Page />} />
              <Route path="events" element={<Events_Page />} />
              <Route path="profile" element={<MyProfile_Page />} />
            </Route>
          </Route>
        </Routes>
      )}
    </div>
  );
}

export default App;
