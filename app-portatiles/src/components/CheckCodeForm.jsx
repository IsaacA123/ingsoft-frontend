import { useState } from "react";
import CodeInput from "./CodeInput";
import { Button } from "@mui/material";

function CheckCodeForm({ errorMessage, onSubmit, onCancel, email, setCode }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit();
    return;
  };

  return (
    <form
      id="code-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-10 rounded shadow-lg"
    >
      <div>
        <h2 className="font-semibold my-2 text-2xl">Revisa el correo</h2>
        <p className="text-sm">Eniamos un correo a {email}. </p>
        <p className="text-sm">Ingresalo aquí para continuar</p>
      </div>
      <div className="relative group mt-6">
        <CodeInput setCode={setCode} />
      </div>
      {errorMessage && <p className="text-error">{errorMessage}</p>}
      <div className="flex gap-2">
        <Button onClick={() => onCancel()} className="flex-1" type="undefined" variant="outlined">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" variant="contained">
          Continuar
        </Button>
      </div>
      <p className="text-center">
        ¿No te ha llegado?{" "}
        <a href="/register" className="text-primary hover:underline">
          Click para reenviar
        </a>
      </p>
    </form>
  );
}

export default CheckCodeForm;
