import { useState } from "react";

function RecoverPassForm({ onSubmit, onCancel, setEmail }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit();
    return;
  };

  return (
    <form
      id="send-code-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-10 rounded shadow-lg"
    >
      <div>
        <h3 className="text-left text-gray-500">¿Necesitas ayuda?</h3>
        <h2 className="font-semibold my-2 text-2xl">Recuperar contraseña</h2>
        <span className="text-sm">Te enviaremos un codigo de verificación al correo</span>
      </div>
      <div className="relative group mt-6">
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="border-2 border-gray-300 rounded-lg p-2 w-full outline-primary peer"
          placeholder=""
          required
        />
        <label className="absolute py-2 h-full left-2 pointer-events-none text-gray-400 group-focus-within:text-black group-focus-within:left-0 group-focus-within:-translate-y-full peer-[:not(:placeholder-shown)]:-translate-y-full duration-500">
          Correo
        </label>
      </div>
      {errorMessage && <p className="text-error">{errorMessage}</p>}
      <div className="flex gap-2">
        <button
          onClick={() => onCancel()}
          type="button"
          className="self-center text-primary border-primary border rounded hover:bg-primary-dark hover:text-white font-semibold w-full py-2 mt-2"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="self-center text-white bg-primary rounded hover:bg-primary-dark font-semibold w-full py-2 mt-2"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Continuar"}
        </button>
      </div>
      <p className="text-center">
        ¿Ya tienes una cuenta?{" "}
        <a href="/login" className="text-primary hover:underline">
          Iniciar sesión
        </a>
      </p>
    </form>
  );
}

export default RecoverPassForm;
