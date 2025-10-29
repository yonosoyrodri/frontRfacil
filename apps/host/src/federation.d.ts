declare module 'autofactura/App' {
  import { ComponentType } from 'react';

  interface ModuleProps {
    user?: any;
    onNavigate?: (path: string) => void;
    theme?: 'light' | 'dark';
    permissions?: string[];
  }

  const App: ComponentType<ModuleProps>;
  export default App;
}

declare module 'gastos/App' {
  import { ComponentType } from 'react';

  interface ModuleProps {
    user?: any;
    onNavigate?: (path: string) => void;
    theme?: 'light' | 'dark';
    permissions?: string[];
  }

  const App: ComponentType<ModuleProps>;
  export default App;
}

declare module 'proveedores/App' {
  import { ComponentType } from 'react';

  interface ModuleProps {
    user?: any;
    onNavigate?: (path: string) => void;
    theme?: 'light' | 'dark';
    permissions?: string[];
  }

  const App: ComponentType<ModuleProps>;
  export default App;
}

// Extender Window para errores de federación y estado compartido
declare global {
  interface Window {
    __FEDERATION_ERRORS__?: Array<{
      module: string;
      error: string;
      timestamp: Date;
      retryable: boolean;
    }>;
    __FEDERATION_SHARED__?: {
      user?: any;
      [key: string]: any;
    };
  }
}

export {};
