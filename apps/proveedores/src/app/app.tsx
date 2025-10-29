import { useEffect, useState } from 'react';
import ModuleInfo from './components/ModuleInfo';

interface ProveedoresAppProps {
  user?: any;
  onNavigate?: (path: string) => void;
  theme?: 'light' | 'dark';
  permissions?: string[];
}

export function App({ user, onNavigate, theme = 'light', permissions = [] }: ProveedoresAppProps) {
  const [, setModuleData] = useState<any>(null);

  useEffect(() => {
    // Listen for global events
    const handleUserUpdate = (event: CustomEvent) => {
      console.log('User updated in Proveedores:', event.detail);
    };

    const handleNavigation = (event: CustomEvent) => {
      console.log('Navigation requested in Proveedores:', event.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    window.addEventListener('navigationRequested', handleNavigation as EventListener);

    // Initialize module data
    setModuleData({
      name: 'Proveedores',
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      features: ['Gestión de proveedores', 'Contactos', 'Seguimiento'],
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
        module: 'proveedores',
        action: 'feature_click',
        data: { feature }
      }, '*');
    }
  };

  const handleAddProvider = () => {
    console.log('Adding new provider...');
    // Simulate provider creation
    alert('¡Función de agregar proveedor activada! (Simulación)');
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
              🏢 Proveedores
            </h1>
            <p className="text-gray-600 m-0 text-sm">
              Gestión de proveedores
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
        {/* Add Provider Feature */}
        <div
          onClick={() => handleFeatureClick('add_provider')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">➕</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Agregar Proveedor
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Registra nuevos proveedores con información completa
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddProvider();
            }}
            className="w-full p-3 bg-purple-600 text-white border-none rounded-md text-sm font-medium cursor-pointer hover:bg-purple-700 transition-colors"
          >
            Agregar Proveedor
          </button>
        </div>

        {/* Contacts Feature */}
        <div
          onClick={() => handleFeatureClick('contacts')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">👥</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Contactos
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Gestiona contactos y representantes de proveedores
          </p>
          <div className="p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            📞 45 contactos registrados
          </div>
        </div>

        {/* Tracking Feature */}
        <div
          onClick={() => handleFeatureClick('tracking')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">📋</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Seguimiento
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Rastrea pedidos y entregas de proveedores
          </p>
          <div className="p-3 bg-cyan-100 rounded-md text-xs text-cyan-800">
            🚚 8 pedidos en tránsito
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-800 m-0 mb-4 text-lg font-semibold">
          📈 Actividad Reciente
        </h3>
        <div className="text-sm text-gray-600">
          <div className="mb-2">
            • Proveedor "TecnoSupply" agregado hace 2 horas
          </div>
          <div className="mb-2">
            • Contacto actualizado en "OfficeMax" ayer
          </div>
          <div className="mb-2">
            • Pedido #1234 entregado hace 1 día
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
