import { useEffect, useState } from 'react';
import { supabase } from './supabase/SupabaseCliente';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      console.log("Obteniendo datos de la base de datos...");
      
      const { data, error } = await supabase
        .from('tutoria')  // Asegúrate de que el nombre de la tabla sea correcto
        .select('*');     // Selecciona todas las columnas

      // Verifica si se obtuvieron los datos correctamente
      if (error) {
        console.error('Error al obtener usuarios:', error);
      } else {
        console.log('Datos recibidos de usuarios:', data);
        setUsuarios(data);  // Actualiza el estado con los datos recibidos
      }
    };

    fetchUsuarios();
  }, []);

  // Verificar si el estado se actualizó correctamente
  console.log("Estado de usuarios:", usuarios);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <li key={usuario.fecha}>{usuario.id}</li>
          ))
        ) : (
          <p>No se encontraron usuarios</p>
        )}
      </ul>
    </div>
  );
};

export default Usuarios;

