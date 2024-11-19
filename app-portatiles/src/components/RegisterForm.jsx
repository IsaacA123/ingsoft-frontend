import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function RegisterForm({
  errorMessage,
  onSubmit,
  email,
  code,
  setPassword: setPasswordFromProps,
  title,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localErrorMessage, setLocalErrorMessage] = useState("");

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordFromProps(newPassword);
    if (newPassword !== confirmPassword && newPassword && confirmPassword) {
      setPasswordsMatch(false);
      setLocalErrorMessage("Las contraseñas no coinciden.");
    } else {
      setPasswordsMatch(true);
      setLocalErrorMessage("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (newConfirmPassword !== password && password && newConfirmPassword) {
      setPasswordsMatch(false);
      localErrorMessage("Las contraseñas no coinciden.");
    } else {
      setPasswordsMatch(true);
      setLocalErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    onSubmit();
    if (!passwordsMatch) return;
    e.preventDefault();
    setLoading(true);
    localErrorMessage("");
    await axios
      .post(
        apiUrl + "/auth/signup",
        {
          email,
          code,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        Navigate("/login");
      })
      .catch(function (error) {
        let errorMessage = "Error desconocido";
        if (error.response) {
          errorMessage = error.response.data;
        } else if (error.request) {
          errorMessage = "No se recibió respuesta del servidor";
        } else {
          errorMessage = error.message;
        }
        localErrorMessage(errorMessage);
      })
      .finally(function () {
        setLoading(false);
      });
  };

  return (
    <form
      id="email-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-10 rounded shadow-lg min-w-[360px]"
    >
      <div>
        <h3 className="text-left text-gray-500">Bienvenido!</h3>
        <h2 className="font-semibold my-2 text-2xl">{title}</h2>
        <span className="text-sm">Esto es lo último, de verdad.</span>
      </div>
      <TextField
        onChange={handlePasswordChange}
        type="password"
        label="Contraseña"
        variant="outlined"
        className="bg-[#ffffff]"
        required
      />
      <TextField
        onChange={handleConfirmPasswordChange}
        type="password"
        label="Confirmar Contraseña"
        variant="outlined"
        className="bg-[#ffffff]"
        required
      />
      {errorMessage && <p className="text-error">{errorMessage}</p>}
      {localErrorMessage && <p className="text-error">{localErrorMessage}</p>}
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? "Cargando..." : "Registrarse"}
      </Button>
    </form>
  );
}

export default RegisterForm;
