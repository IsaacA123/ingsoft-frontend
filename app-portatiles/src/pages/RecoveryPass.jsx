import { useState } from "react";
import { ReactSVG } from "react-svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import SendCodeForm from "../components/sendCodeForm";
import CheckCodeForm from "../components/CheckCodeForm";
import RegisterForm from "../components/RegisterForm";
import RecoverPassForm from "../components/recoverPassForm";
import { useNavigate } from "react-router-dom";

const Recovery = ({ setIsAuthenticated }) => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    nextStep();
    return;
  };

  const handleCancel = () => {
    console.log("PASO PREVIO",step)
    if(step===1) navigate("/login")
    prevStep();
    return;
  };

  return (
    <div>
      <ToastContainer />
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <div className="flex flex-row-reverse justify-center items-center bg-gray-100 min-h-screen ">
            <motion.div key="man" layout>
              <ReactSVG className="hidden xl:block" src="man.svg" />
            </motion.div>
            <motion.div
              key="form"
              layout
              initial={{ x: 600 }}
              animate={{ x: 0 }}
            >
              <RecoverPassForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                setEmail={setEmail}
                subTitle={""}
                title={"Recuperar contraseña"}
              ></RecoverPassForm>
            </motion.div>
            <motion.div key="woman" layout>
              <ReactSVG className="hidden md:block " src="woman.svg" />
            </motion.div>
          </div>
        ) : step === 2 ? (
          <div className="flex flex-row-reverse justify-around xl:justify-center  items-center bg-gray-100 min-h-screen ">
            <motion.div key="man" layout>
              <ReactSVG className="hidden xl:block " src="man.svg" />
            </motion.div>
            <motion.div key="form" layout>
              <CheckCodeForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                email={email}
              ></CheckCodeForm>
            </motion.div>
            <motion.div key="woman" layout>
              <ReactSVG className="hidden xl:block " src="woman.svg" />
            </motion.div>
          </div>
        ) : step === 3 ? (
          <div className="flex flex-row-reverse justify-center  items-center bg-gray-100 min-h-screen ">
            <motion.div key="form" layout>
              <RegisterForm
                onSubmit={handleSubmit}
                email={email}
                code={code}
                setPassword={setPassword}
                title={"Actualiza la contraseña"}
              ></RegisterForm>
            </motion.div>
            <motion.div key="man" layout>
              <ReactSVG className="hidden xl:block " src="man.svg" />
            </motion.div>
            <motion.div key="woman" layout>
              <ReactSVG className="hidden md:block " src="woman.svg" />
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-row-reverse justify-around xl:justify-center  items-center bg-gray-100 min-h-screen ">
            <motion.div key="man" layout>
              <ReactSVG className="hidden xl:block " src="man.svg" />
            </motion.div>
            <motion.div key="form" layout>
              <form
                id="code-form"
                onSubmit={handleSubmit}
                className="flex flex-col content-center gap-4 p-10 min-w-[400px] min-h-[360px] rounded shadow-lg"
              >
                <div className="flex flex-col gap-4 justify-center flex-grow">
                  <h3>¡Bienvenido de nuevo!</h3>
                  <h2 className="font-semibold my-2 text-2xl">
                    Tu contraseña se ha cambiado!
                  </h2>
                  <p className="text-sm">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>

                <button
                  type="button"
                  className="self-center text-white bg-primary rounded hover:bg-primary-dark font-semibold w-full py-2 mt-4"
                  disabled={loading}
                >
                  Continuar
                </button>
              </form>
            </motion.div>
            <motion.div key="woman" layout>
              <ReactSVG className="hidden xl:block " src="woman.svg" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recovery;