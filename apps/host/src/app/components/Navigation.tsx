import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  onNavigate?: (path: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const modules = [
    {
      name: 'autofactura',
      displayName: 'Autofactura',
      icon: '📄',
      description: 'Gestión de facturas automáticas',
      route: '/autofactura',
    },
    {
      name: 'gastos',
      displayName: 'Gastos',
      icon: '💰',
      description: 'Control de gastos empresariales',
      route: '/gastos',
    },
    {
      name: 'proveedores',
      displayName: 'Proveedores',
      icon: '🏢',
      description: 'Gestión de proveedores',
      route: '/proveedores',
    },
  ];

  const handleLogout = () => {
    logout();
    onNavigate?.('/');
  };

  const handleModuleClick = (route: string) => {
    onNavigate?.(route);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuario';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'manager': return '#fd7e14';
      case 'user': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center no-underline text-gray-800 font-semibold text-xl"
        >
          <span className="mr-2 text-2xl" role="img" aria-label="Edificio">🏢</span>
          Rfacil ERP
        </Link>

        {/* Module Navigation */}
        <div className="flex items-center gap-2">
          {modules.map((module) => {
            const hasAccess = hasPermission(module.name);
            const isActive = location.pathname === module.route;

            return (
              <button
                key={module.name}
                onClick={() => handleModuleClick(module.route)}
                disabled={!hasAccess}
                className={`flex items-center gap-2 px-4 py-2 border-none rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : hasAccess
                      ? 'bg-transparent text-gray-800 hover:bg-gray-100'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-60'
                }`}
                title={hasAccess ? module.description : 'Sin permisos para este módulo'}
              >
                <span role="img" aria-label={module.displayName}>{module.icon}</span>
                {module.displayName}
                {!hasAccess && (
                  <span className="text-xs" role="img" aria-label="Bloqueado">🔒</span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-white cursor-pointer transition-all duration-200 hover:border-blue-600"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">
                {user?.name}
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: getRoleColor(user?.role || '') }}
                />
                {getRoleDisplayName(user?.role || '')}
              </div>
            </div>
            <span className="text-xs">
              {showUserMenu ? '▲' : '▼'}
            </span>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-64 z-50">
              {/* User Info */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-base">
                      {user?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md text-sm">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: getRoleColor(user?.role || '') }}
                  />
                  <span className="font-medium">
                    {getRoleDisplayName(user?.role || '')}
                  </span>
                </div>
              </div>

              {/* Permissions */}
              <div className="p-4">
                <div className="text-sm font-semibold mb-2 text-gray-800">
                  Permisos:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {modules.map((module) => {
                    const hasAccess = hasPermission(module.name);
                    return (
                      <span
                        key={module.name}
                        className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                          hasAccess
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {module.icon}
                        {module.displayName}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full p-2.5 bg-red-600 text-white border-none rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-red-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
