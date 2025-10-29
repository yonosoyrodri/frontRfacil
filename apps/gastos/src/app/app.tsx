import { useEffect, useState } from 'react';
import ModuleInfo from './components/ModuleInfo';

interface GastosAppProps {
  user?: any;
  onNavigate?: (path: string) => void;
  theme?: 'light' | 'dark';
  permissions?: string[];
}

export function App({ user, onNavigate, theme = 'light', permissions = [] }: GastosAppProps) {
  const [, setModuleData] = useState<any>(null);

  useEffect(() => {
    // Listen for global events
    const handleUserUpdate = (event: CustomEvent) => {
      console.log('User updated in Gastos:', event.detail);
    };

    const handleNavigation = (event: CustomEvent) => {
      console.log('Navigation requested in Gastos:', event.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    window.addEventListener('navigationRequested', handleNavigation as EventListener);

    // Initialize module data
    setModuleData({
      name: 'Gastos',
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      features: ['Registro de gastos', 'Categorización', 'Reportes'],
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
        module: 'gastos',
        action: 'feature_click',
        data: { feature }
      }, '*');
    }
  };

  const handleAddExpense = () => {
    console.log('Adding new expense...');
    // Simulate expense creation
    alert('¡Función de agregar gasto activada! (Simulación)');
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
              💰 Gastos
            </h1>
            <p className="text-gray-600 m-0 text-sm">
              Control de gastos empresariales
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
        {/* Add Expense Feature */}
        <div
          onClick={() => handleFeatureClick('add_expense')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">➕</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Registrar Gasto
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Registra nuevos gastos con categorización automática
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddExpense();
            }}
            className="w-full p-3 bg-green-600 text-white border-none rounded-md text-sm font-medium cursor-pointer hover:bg-green-700 transition-colors"
          >
            Agregar Gasto
          </button>
        </div>

        {/* Categories Feature */}
        <div
          onClick={() => handleFeatureClick('categories')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">📂</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Categorías
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Organiza gastos por categorías personalizables
          </p>
          <div className="p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            📊 12 categorías activas
          </div>
        </div>

        {/* Reports Feature */}
        <div
          onClick={() => handleFeatureClick('reports')}
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">📊</span>
            <h3 className="text-gray-800 m-0 text-lg font-semibold">
              Reportes
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Genera reportes detallados de gastos y análisis
          </p>
          <div className="p-3 bg-yellow-100 rounded-md text-xs text-yellow-800">
            📈 Último reporte: hace 3 días
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
            • Gasto de $150 agregado en "Oficina" hace 1 hora
          </div>
          <div className="mb-2">
            • Categoría "Marketing" actualizada ayer
          </div>
          <div className="mb-2">
            • Reporte mensual generado hace 2 días
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
