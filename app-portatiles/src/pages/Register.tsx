import Spline from "@splinetool/react-spline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const apiUrl = import.meta.env.VITE_API_URL;

const Login = ({ setIsAuthenticated }) => {
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/register/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.nombre);
        setIsAuthenticated(true);
      } else {
        console.error("Error en inicio de sesión", data); 
        // toast.error(data.data, { autoClose: 7000 });
        setErrorMessage(data.data[0]);
      }
    } catch (error) {
      console.error('Error de conexión', error); 
      toast.error("Error de conexión", { autoClose: 5000 });
      // setErrorMessage("Error de conexión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-row-reverse justify-center xl:justify-around xl:pl-40 items-center bg-gray-100 min-h-screen ">
      <ToastContainer />
        <ReactSVG className="hidden xl:block " src="man.svg" />
        <ReactSVG className="hidden xl:block " src="woman.svg" />

        <div className="p-10 rounded shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
          <h3 className="text-left text-gray-500">
            Bienvenido!
          </h3>
          <h2 className="font-semibold mt-2 text-2xl">
            Registrarse
          </h2>
          <span className="text-sm"> Ya estas un pasó más cerca.</span>
          </div>
          <div className="relative group mt-6">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="bg-gray-200 rounded-lg p-2 w-full outline-primary  peer"
              placeholder=""
              required
            ></input>
            <label className="absolute py-2 h-full left-2 pointer-events-none text-gray-400 group-focus-within:text-black group-focus-within:-translate-y-full peer-[:not(:placeholder-shown)]:-translate-y-full duration-500">
              Correo
            </label>
          </div>
          {errorMessage && <p className="text-error">{errorMessage}</p>}
          <button
            type="submit"
            className="self-center text-white bg-primary rounded hover:bg-primary-dark font-semibold w-full py-2 mt-2"
            disabled={loading}
          >
            {" "}
            {loading ? "Cargando..." : "Registrarse"}
          </button>
          <p className="">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-primary hover:underline">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
