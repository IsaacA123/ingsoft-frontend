import { Button, TextField } from "@mui/material";
import { useState } from "react";

function RecoverPassForm({ errorMessage, onSubmit, onCancel, setEmail }) {
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
        <h3 className="text-left text-gray-500">¿Necesitas ayuda?</h3>
        <h2 className="font-semibold my-2 text-2xl">Recuperar contraseña</h2>
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
      <div className="flex gap-2">
        <Button
          onClick={() => onCancel()}
          className="flex-1"
          type="undefined"
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" variant="contained">
          Continuar
        </Button>
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
