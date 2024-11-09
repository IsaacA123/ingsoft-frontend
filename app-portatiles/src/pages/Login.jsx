import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiUrl = import.meta.env.VITE_API_URL;  

const Login = ( {setIsAuthenticated} ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); 
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.nombre);
        setIsAuthenticated(true)
      } else {
        /* console.error("Error en inicio de sesión", data.message); */
        toast.error(data.message, { autoClose: 7000 });
        setErrorMessage(data.error[0]);
        
      }
    } catch (error) {
      /* console.error('Error de conexión', error); */
      setErrorMessage('Error de conexión. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex justify-center items-center bg-black sm:bg-gray-100 min-h-screen ">
      <div className="p-10 rounded shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="font-semibold  text-2xl mb-2 text-center">Iniciar Sesión</div>
          {loading && <div className="flex justify-center mb-4">
            <img src="/spin.svg" className="animate-spin w-12 h-12" alt="Icono de carga" />
          </div>}
          {errorMessage && <p className="text-error">{errorMessage}</p>}
          <div className="relative group mt-6">
            <input onChange={(e) => setEmail(e.target.value)} type="email" className="bg-gray-200 rounded-lg p-2 w-full outline-primary  peer"  placeholder="" required></input>
            <label className="absolute py-2 h-full left-2 pointer-events-none text-gray-400 group-focus-within:text-black group-focus-within:-translate-y-full peer-[:not(:placeholder-shown)]:-translate-y-full duration-500">Correo</label>
          </div>
          <div className="relative group mt-6">
            <input onChange={(e) => setPassword(e.target.value)} type="password" className="bg-gray-200 rounded-lg  p-2 w-full outline-primary peer" placeholder="" required></input>
            <label className="absolute py-2 h-full left-2 pointer-events-none text-gray-400 group-focus-within:text-black group-focus-within:-translate-y-full peer-[:not(:placeholder-shown)]:-translate-y-full duration-500">Contraseña</label>
          </div>
          <button type="submit" className="self-center text-white bg-primary rounded hover:bg-primary-dark font-semibold px-4 py-2" disabled={loading}> {loading ? "Cargando..." : "Iniciar"}</button>
          <p className="">¿No tienes una cuenta? <a href="/register" className="text-primary hover:underline">Registrate aquí</a></p>
        </form>
      </div>
    </div> 
);
}

export default Login;
