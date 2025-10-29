import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(credentials);
      onLoginSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const demoUsers = [
    { email: 'admin@rfacil.com', password: 'password123', role: 'Admin (todos los módulos)' },
    { email: 'manager@rfacil.com', password: 'password123', role: 'Manager (autofactura + gastos)' },
    { email: 'user@rfacil.com', password: 'password123', role: 'User (solo gastos)' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-gray-800 mb-2 text-3xl font-semibold">
            Rfacil ERP
          </h1>
          <p className="text-gray-600 text-sm">
            Sistema de Gestión Empresarial
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-gray-800 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-800 text-sm font-medium">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:border-blue-600 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 text-white border-none rounded-lg text-base font-semibold transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 cursor-pointer hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 p-5 bg-gray-50 rounded-lg text-xs">
          <h4 className="m-0 mb-2.5 text-gray-800">Usuarios de prueba:</h4>
          {demoUsers.map((user, index) => (
            <div key={index} className="mb-2">
              <div className="font-medium text-blue-600">{user.email}</div>
              <div className="text-gray-600">{user.role}</div>
            </div>
          ))}
          <div className="mt-2 text-gray-600">
            Contraseña: <strong>password123</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
