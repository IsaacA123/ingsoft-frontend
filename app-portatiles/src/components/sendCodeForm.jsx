import { Button, TextField } from "@mui/material";
import { useState } from "react";

function SendCodeForm({ errorMessage, onSubmit, setEmail }) {
  const [loading, setLoading] = useState(false);

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
        <h3 className="text-left text-gray-500">Ya casí!</h3>
        <h2 className="font-semibold my-2 text-2xl">Registrarse</h2>
        <span className="text-sm">
          Te enviaremos un codigo de verificación al correo
        </span>
      </div>
      <TextField
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        label="Correo"
        variant="outlined"
        className="bg-[#ffffff]"
        required
      />
      {errorMessage && <p className="text-error">{errorMessage}</p>}
      <Button type="submit" variant="contained">
        Enviar código
      </Button>

      <p className="text-center">
        ¿Ya tienes una cuenta?{" "}
        <a href="/login" className="text-primary hover:underline">
          Iniciar sesión
        </a>
      </p>
    </form>
  );
}

export default SendCodeForm;
