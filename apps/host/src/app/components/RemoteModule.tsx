import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Lazy load remote modules
const RemoteAutofactura = lazy(() => import('autofactura/App' as any));
const RemoteGastos = lazy(() => import('gastos/App' as any));
const RemoteProveedores = lazy(() => import('proveedores/App' as any));

interface RemoteModuleProps {
  moduleName: 'autofactura' | 'gastos' | 'proveedores';
  onNavigate?: (path: string) => void;
}

interface ModuleError {
  module: string;
  error: string;
  timestamp: Date;
  retryable: boolean;
}

export const RemoteModule: React.FC<RemoteModuleProps> = ({
  moduleName,
  onNavigate
}) => {
  const { user, hasPermission } = useAuth();
  const [error, setError] = useState<ModuleError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Handle module loading errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.filename?.includes(moduleName)) {
        handleModuleError(new Error(event.message || 'Unknown module error'));
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes(moduleName)) {
        handleModuleError(new Error(event.reason.message || 'Module loading failed'));
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [moduleName]);

  // Check if user has permission for this module
  if (!hasPermission(moduleName)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-10">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg">
          <div className="text-6xl mb-5">
            🔒
          </div>
          <h2 className="text-gray-800 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder al módulo de <strong>{moduleName}</strong>.
          </p>
          <button
            onClick={() => onNavigate?.('/')}
            className="bg-blue-600 text-white px-6 py-3 border-none rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);

    // Force reload the page to retry module loading
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleModuleError = (error: Error) => {
    const moduleError: ModuleError = {
      module: moduleName,
      error: error.message,
      timestamp: new Date(),
      retryable: true,
    };

    setError(moduleError);

    // Store error globally for debugging
    if (!window.__FEDERATION_ERRORS__) {
      window.__FEDERATION_ERRORS__ = [];
    }
    window.__FEDERATION_ERRORS__.push(moduleError);

    console.error(`Error loading module ${moduleName}:`, error);
  };

  const renderModule = () => {
    const moduleProps = {
      user,
      onNavigate,
      theme: 'light' as const,
      permissions: user?.permissions || [],
    };

    switch (moduleName) {
      case 'autofactura':
        return <RemoteAutofactura {...moduleProps} />;
      case 'gastos':
        return <RemoteGastos {...moduleProps} />;
      case 'proveedores':
        return <RemoteProveedores {...moduleProps} />;
      default:
        return (
          <div className="text-center p-10">
            <h2 className="text-gray-800 mb-2">Módulo no encontrado</h2>
            <p className="text-gray-600">El módulo "{moduleName}" no está disponible.</p>
          </div>
        );
    }
  };

  const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-5" />
        <h3 className="text-gray-800 mb-2">
          Cargando {moduleName}
        </h3>
        <p className="text-gray-600 text-sm">
          Por favor espera mientras se carga el módulo...
        </p>
      </div>
    </div>
  );

  const ErrorFallback = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-10">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg">
        <div className="text-6xl mb-5">
          ⚠️
        </div>
        <h2 className="text-red-600 mb-4">
          Error al Cargar Módulo
        </h2>
        <p className="text-gray-600 mb-4">
          No se pudo cargar el módulo <strong>{moduleName}</strong>.
        </p>
        {error && (
          <div className="bg-gray-50 p-4 rounded-md mb-5 text-xs text-gray-600 text-left">
            <strong>Error:</strong> {error.error}
            <br />
            <strong>Timestamp:</strong> {error.timestamp.toLocaleString()}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`px-6 py-3 text-white border-none rounded-md text-sm transition-colors ${
              isRetrying
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 cursor-pointer hover:bg-blue-700'
            }`}
          >
            {isRetrying ? 'Reintentando...' : 'Reintentar'}
          </button>
          <button
            onClick={() => onNavigate?.('/')}
            className="px-6 py-3 bg-gray-600 text-white border-none rounded-md text-sm cursor-pointer hover:bg-gray-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );

  if (error) {
    return <ErrorFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary onError={handleModuleError}>
        {renderModule()}
      </ErrorBoundary>
    </Suspense>
  );
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: Error) => void;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Module Federation Error:', error, errorInfo);
    this.props.onError(error);
  }

  override render() {
    if (this.state.hasError) {
      return null; // Let the parent handle the error display
    }

    return this.props.children;
  }
}

export default RemoteModule;
