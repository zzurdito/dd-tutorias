import { useState } from 'react';
import logo from '../images/InterfazHome/logo-universae-linktree.webp'
import { supabase } from './supabase/SupabaseCliente'
import { useNavigate } from 'react-router-dom';


const Register = () =>{

    const navigate = useNavigate();  // Hook para navegar entre páginas
    const [Username, setUsername]= useState('');
    const [Name, setName]= useState('');
    const [Surname,setSurname] =useState('');
    const [Email, setEmail]=useState('');
    const [Password, setPassword]=useState('');
    const [ConfirmPassword, setConfirmPassword]=useState('');
    const [passwordError, setPasswordError] = useState('');
    const [Grade, setGrade]=useState('');
    
    const handleRegister = async (e) => {
        e.preventDefault();
        

        if (Password !== ConfirmPassword) {
            setPasswordError("Las contraseñas no coinciden");
            return;
        }
        try{
            const {data, error} = await supabase.auth.signUp({
                email: Email,
                password : Password,
            });
                ;
            if (error) {
                console.error("Error al registrar el usuario:", error);
            } else {
                const user = supabase.auth.user();
                const {error: insertError} = await supabase
                    .from('usuario')
                    .insert([
                        {
                            id: user.id,
                            username: Username,
                            name: Name,
                            surname: Surname,
                            email: Email,
                            grade: Grade,
                        },
                    ]);
                if (insertError) {
                    console.error('Error al insertar datos adicionales del usuario:', insertError);
                    } else {
                    // Redirigir al usuario a la página de login después del registro exitoso
                    navigate('/login');
            }
        }
                



        } catch (err)
        {
            console.error("Error inesperado:", err);
        }


    };
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (Password !== e.target.value) {
          setPasswordError("Las contraseñas no coinciden");
        } else {
          setPasswordError("");  // Limpiar error si coinciden
        }
      };
    
    return(
        
            
        <div className="flex items-center justify-center bg-gray-100 h-full">
            <div className="w-full max-w-md p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center w-32 h-32"><img src={logo} alt="Logo" /></h2>
                <form className="space-y-4" onSubmit={handleRegister}>
                    <div className= "grid md:grid-cols-2 md:gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre 
                                </label>
                                <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={Name}
                                onChange={(e)=> setName(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                                Apellidos 
                                </label>
                                <input
                                id="surname"
                                name="surname"
                                type="text"
                                required
                                value={Surname}
                                onChange={(e)=> setSurname(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                    </div>
                    <div >
                    <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                                    Correo
                                    </label>
                                    <input
                                    id="mail"
                                    name="mail"
                                    type="email"
                                    placeholder="example@email.com"
                                    required
                                    value={Email}
                                    onChange={(e)=> setEmail(e.target.value)}
                                    className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"/>
                        
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                                <div>
                                    
                                    <label htmlFor="UserName" className="block text-sm font-medium text-gray-700">
                           Nombre de Usuario
                        </label>
                        <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={Username}
                        onChange={(e)=> setUsername(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                                    Grado
                                    </label>
                                    <select className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500" 
                                    value={Grade}
                                    onChange={(e) => setGrade(e.target.value)}>
                                        <option value="DAM"> DAM</option>
                                        <option value="DAW">DAW</option>
                                    </select>
                                </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={Password}
                                onChange={(e)=> setPassword(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700">
                                Repite la contraseña
                                </label>
                                <input
                                id="confirm_password"
                                name="confirm_password"
                                type="Password"
                                value={ConfirmPassword}
                                onChange={handleConfirmPassword}
                                required
                                
                                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                    </div>
                    {passwordError && (
                    <p id="validation" className="text-center text-red-500 italic text-sm">
                    {passwordError}
                    </p>
                    )}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                            >
                        Sign up
          </button>
                    



                </form>


            </div>
        </div>
        
    );


}


export default Register;