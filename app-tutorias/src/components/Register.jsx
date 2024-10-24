import { useState } from 'react';
import { supabase } from './supabase/SupabaseCliente';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../images/InterfazHome/logo-universae-linktree.webp';

const Register = () => {
  const navigate = useNavigate();  // Hook para navegar entre páginas
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [grade, setGrade] = useState('');
  const [error, setError] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/content');  // Redirige al contenido si ya hay una sesión activa
      }
    };

    checkSession();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Registro del usuario con el esquema auth de Supabase
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            name: name,
            surname: surname,
            grade: grade,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Registro exitoso. Por favor, verifica tu correo para activar la cuenta.');
        navigate('/login');  // Redirigir a la página de login
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Ocurrió un error durante el registro.");
    } finally{
        setLoading(false);
    }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setError('Las contraseñas no coinciden');
    } else {
      setError('');  // Limpiar error si coinciden
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-full">
      <div className="w-full max-w-md p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="flex flex-row items-center text-2xl font-bold text-center w-32 h-32">
          <img src={logo} alt="Logo" />
          <span className="ml-4 text-3xl">REGISTER</span>
        </h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
              <input
                id="surname"
                name="surname"
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="mail"
              name="mail"
              type="email"
              placeholder="example@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div>
              <label htmlFor="UserName" className="block text-sm font-medium text-gray-700">Username</label>
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
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
              <select
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="DAM">DAM</option>
                <option value="DAW">DAW</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-1 md:gap-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
            <div>
              <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700">Repeat password</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                value={confirmPassword}
                onChange={handleConfirmPassword}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {error && (
            <p className="text-center text-red-500 italic text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
