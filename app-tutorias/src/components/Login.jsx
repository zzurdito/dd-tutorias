import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/InterfazHome/logo-universae-linktree.webp'

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook para navegar entre páginas
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Guardar el token JWT en el almacenamiento local o cookies
      localStorage.setItem('token', data.token);

      // Redirigir o hacer algo después del login exitoso
      console.log('Login successful');
      // Ejemplo: redirigir a una página de inicio o dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      setError('Error logging in');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-full">
      <div className="w-full max-w-md p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center w-32 h-32"><img src={logo} alt="Logo" /></h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate('/register')}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
