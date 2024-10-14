import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/InterfazHome/logo-universae-linktree.webp'
import NavBar from './NavBar';
const Register = () =>{

    const [Username, setUsername]= useState('');
    const [Name, setName]= useState('');
    const[ID, setId]= useState('');
    const[Surname,setSurname] =('');
    const[Email, setEmail]=('');
    const[Password, setPassword]=('');
    const navigate = useNavigate();  // Hook para navegar entre páginas
    const handleRegister = async (e) => {
        e.preventDefault();
        try{

        } catch (err)
        {

        }


    };
    return(
        
            
        <div className="flex items-center justify-center bg-gray-100 h-full">
            <div className="w-full max-w-md p-8 my-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center w-32 h-32"><img src={logo} alt="Logo" /></h2>
                <form className="space-y-4" onSubmit={handleRegister}></form>


            </div>
        </div>
        
    );


}

export default Register;