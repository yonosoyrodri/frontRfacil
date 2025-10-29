import React from 'react';

interface ModuleInfoProps {
  user?: any;
}

export const ModuleInfo: React.FC<ModuleInfoProps> = ({ user }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h3 className="text-gray-800 mb-3">
        💰 Módulo Gastos
      </h3>
      <div className="text-sm text-gray-600 mb-4">
        <strong>Versión:</strong> 1.0.0
      </div>
      <div className="text-sm text-gray-600 mb-4">
        <strong>Descripción:</strong> Sistema de control de gastos empresariales
      </div>
      <div className="text-sm text-gray-600">
        <strong>Usuario actual:</strong> {user?.name || 'No autenticado'}
      </div>
    </div>
  );
};

export default ModuleInfo;
