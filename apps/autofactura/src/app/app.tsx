import { useEffect, useState } from 'react';
import ModuleInfo from './components/ModuleInfo';

interface User {
  name: string;
  email: string;
  role: string;
  permissions?: string[];
}

interface AutofacturaAppProps {
  user?: User;
  onNavigate?: (path: string) => void;
  theme?: 'light' | 'dark';
  permissions?: string[];
}

export function App({ user, onNavigate, theme = 'light', permissions = [] }: AutofacturaAppProps) {
  const [, setModuleData] = useState<{
    name: string;
    version: string;
    lastUpdate: string;
    features: string[];
  } | null>(null);

  useEffect(() => {
    // Listen for global events
    const handleUserUpdate = (event: CustomEvent) => {
      console.log('User updated in Autofactura:', event.detail);
    };

    const handleNavigation = (event: CustomEvent) => {
      console.log('Navigation requested in Autofactura:', event.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    window.addEventListener('navigationRequested', handleNavigation as EventListener);

    // Initialize module data
    setModuleData({
      name: 'Autofactura',
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      features: ['Facturación automática', 'Templates', 'Envío por email'],
    });

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
      window.removeEventListener('navigationRequested', handleNavigation as EventListener);
    };
  }, []);

  const handleFeatureClick = (feature: string) => {
    console.log(`Feature clicked: ${feature}`);

    // Notify host about feature interaction
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'MODULE_INTERACTION',
        module: 'autofactura',
        action: 'feature_click',
        data: { feature }
      }, '*');
    }
  };

  const handleCreateInvoice = () => {
    console.log('Creating new invoice...');
    // Simulate invoice creation
    alert('¡Función de crear factura activada! (Simulación)');
  };

  return (
    <div className={`min-h-screen p-5 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Module Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-800 m-0 mb-2 text-2xl font-semibold">
              <span role="img" aria-label="Documento">📄</span> Autofactura
            </h1>
            <p className="text-gray-600 m-0 text-sm">
              Gestión de facturas automáticas
            </p>
          </div>
          {user && (
            <div className="px-4 py-2 bg-blue-50 rounded-md text-xs text-blue-700">
              {user.name}
            </div>
          )}
        </div>

        {/* Module Info */}
        <ModuleInfo user={user} />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {/* Create Invoice Feature */}
        <div
          onClick={() => handleFeatureClick('create_invoice')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3" role="img" aria-label="Crear">📝</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Crear Factura
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Genera facturas automáticamente con templates predefinidos
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCreateInvoice();
            }}
            className="w-full p-3 bg-blue-600 text-white border-none rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Crear Nueva Factura
          </button>
        </div>

        {/* Templates Feature */}
        <div
          onClick={() => handleFeatureClick('templates')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3" role="img" aria-label="Plantillas">📋</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Templates
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Gestiona plantillas de facturas personalizables
          </p>
          <div className="p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            <span role="img" aria-label="Estadísticas">📊</span> 5 templates activos
          </div>
        </div>

        {/* Email Automation Feature */}
        <div
          onClick={() => handleFeatureClick('email_automation')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3" role="img" aria-label="Email">📧</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Envío Automático
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Configura envío automático de facturas por email
          </p>
          <div className="p-3 bg-green-100 rounded-md text-xs text-green-800">
            <span role="img" aria-label="Activo">✅</span> Automatización activa
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-800 m-0 mb-4 text-lg font-semibold">
          <span role="img" aria-label="Gráfico">📈</span> Actividad Reciente
        </h3>
        <div className="text-sm text-gray-600">
          <div className="mb-2">
            • Factura #001 creada hace 2 horas
          </div>
          <div className="mb-2">
            • Template "Empresarial" actualizado ayer
          </div>
          <div className="mb-2">
            • 15 facturas enviadas automáticamente esta semana
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
