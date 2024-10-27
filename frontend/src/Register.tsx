import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from './services/api';

const Register = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para mensagem de erro
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Estado para mensagem de sucesso
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null); // Limpa a mensagem de erro antes de registrar
    setSuccessMessage(null); // Limpa a mensagem de sucesso antes de registrar
  
    if (nameRef.current && emailRef.current && passwordRef.current) {
      const newCustomer = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
  
      try {
        const response = await api.post("/cadastrar", newCustomer);
        console.log("Cliente registrado:", response.data);
        setSuccessMessage("Cliente registrado com sucesso!"); // Exibe a mensagem de sucesso
        nameRef.current.value= ""
        emailRef.current.value= ""
        passwordRef.current.value= ""

      } catch (error) {
        // Verificação do tipo de erro
        if (error instanceof Error && error.message === "Request failed with status code 400") {
          setErrorMessage("E-mail já cadastrado.");
          emailRef.current.value= ""
        } else {
          console.error("Erro ao registrar cliente:", error);
          setErrorMessage("Erro ao registrar cliente.");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Registrar</h2>

        {errorMessage && <div className="mb-4 text-red-600 text-center">{errorMessage}</div>} {/* Mensagem de erro */}
        {successMessage && <div className="mb-4 text-green-600 text-center">{successMessage}</div>} {/* Mensagem de sucesso */}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Digite seu nome"
              ref={nameRef}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu email"
              ref={emailRef}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Crie uma senha"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Registrar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Já tem uma conta? <Link to="/Login" className="text-blue-600">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
