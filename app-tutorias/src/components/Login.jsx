import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../images/InterfazHome/logo-universae-linktree.webp'
import { supabase } from './supabase/SupabaseCliente'

const Login = () => {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/content');  // Redirige al contenido si ya hay una sesión activa
      }
    };

    checkSession();
  }, [navigate]);

  
  const handleLogin = async (e) => {
    e.preventDefault();  // Prevenir la recarga de la página

    const {data,error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if(error) {setError(error.message)}
    else {
      console.log('Login successful',data);
      console.log('Session:', data.session.access_token);
      navigate('/content');
    }
  }

  const goToRegister = () => {
    navigate('/register');
  } // Hook para navegar entre páginas

  return (
    <div className="flex items-center justify-center bg-gray-100 h-full">
      <div className="w-full max-w-md p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="flex flex-row items-center text-2xl font-bold text-center w-32 h-32"><img src={logo} alt="Logo" /><span className="ml-4 text-3xl">LOGIN</span></h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            onClick={handleLogin}
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={goToRegister}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
