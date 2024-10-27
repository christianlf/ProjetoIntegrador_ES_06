import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from './services/api';

const Login = () => {
  const [email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      const data = response.data;

      if (data) {
        setMessage('Login bem-sucedido!'); // Define a mensagem de sucesso
        console.log('Login bem-sucedido:', data);
        window.open('/tela1', '_blank'); // Abre a nova aba com a rota desejada
        navigate('/tela1'); // Muda para a rota desejada na aba atual
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao realizar login. Verifique suas credenciais.'); // Mensagem de erro
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        {message && <p className="text-center text-green-600">{message}</p>} {/* Mensagem de sucesso ou erro */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              value={email}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu nome de usuário"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2" htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Não tem uma conta? <Link to="/register" className="text-blue-600">Registrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
