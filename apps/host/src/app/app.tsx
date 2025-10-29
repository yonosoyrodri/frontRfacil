import React from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import RemoteModule from './components/RemoteModule';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Dashboard Component
const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();

  const navigate = useNavigate();

  const modules = [
    {
      name: 'autofactura',
      displayName: 'Autofactura',
      icon: '📄',
      description: 'Gestión de facturas automáticas',
      route: '/autofactura',
      features: ['Crear facturas', 'Templates', 'Envío automático'],
    },
    {
      name: 'gastos',
      displayName: 'Gastos',
      icon: '💰',
      description: 'Control de gastos empresariales',
      route: '/gastos',
      features: ['Registro de gastos', 'Categorización', 'Reportes'],
    },
    {
      name: 'proveedores',
      displayName: 'Proveedores',
      icon: '🏢',
      description: 'Gestión de proveedores',
      route: '/proveedores',
      features: ['Gestión de proveedores', 'Contactos', 'Seguimiento'],
    },
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
          <h1 className="text-gray-800 mb-2 text-3xl font-semibold">
            ¡Bienvenido, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-base mb-5">
            Gestiona tu empresa desde el panel de control de Rfacil ERP
          </p>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm">
            <span className="font-medium">Rol:</span>
            <span className={`px-2 py-1 text-white rounded text-xs font-medium ${
              user?.role === 'admin' ? 'bg-red-600' :
              user?.role === 'manager' ? 'bg-orange-500' : 'bg-green-600'
            }`}>
              {user?.role === 'admin' ? 'Administrador' :
               user?.role === 'manager' ? 'Gerente' : 'Usuario'}
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const hasAccess = hasPermission(module.name);

            return (
              <div
                key={module.name}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                  hasAccess
                    ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'
                    : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => hasAccess && handleNavigate(module.route)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">
                      {module.icon}
                    </span>
                    <div>
                      <h3 className="text-gray-800 m-0 mb-1 text-xl font-semibold">
                        {module.displayName}
                      </h3>
                      <p className="text-gray-600 m-0 text-sm">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      Funcionalidades:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {module.features.map((feature, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs ${
                            hasAccess
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 text-sm ${
                      hasAccess ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>{hasAccess ? '✅' : '🔒'}</span>
                      {hasAccess ? 'Acceso permitido' : 'Sin permisos'}
                    </div>

                    {hasAccess && (
                      <button className="px-4 py-2 bg-blue-600 text-white border-none rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors">
                        Acceder →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/autofactura"
        element={
          <ProtectedRoute>
            <RemoteModule moduleName="autofactura" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gastos"
        element={
          <ProtectedRoute>
            <RemoteModule moduleName="gastos" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proveedores"
        element={
          <ProtectedRoute>
            <RemoteModule moduleName="proveedores" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Root App Component
export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
