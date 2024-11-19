import React, {  useRef } from 'react';

function CodeInput({setCode}) {
  const [code, setLocalCode] = React.useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  // Actualiza el código completo cuando se cambia algún dígito
  const updateCode = (newCode) => {
    const codeString = newCode.join('');
    setLocalCode(newCode); // Mantiene el estado local del código
    setCode(codeString);   // Pasa el código completo al componente principal
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    // Solo permitir dígitos y limitar a un solo carácter
    if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      updateCode(newCode);

      // Mover el foco al siguiente input si hay un valor, o retroceder si está vacío
      if (value && index < 3) {
        inputsRef.current[index + 1].focus();
      } else if (!value && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="flex space-x-2 justify-center">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          maxLength="1"
          className="w-16 h-16 sm:w-20 sm:h-20 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-primary"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default CodeInput;
