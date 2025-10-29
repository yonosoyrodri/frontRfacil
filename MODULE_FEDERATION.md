# 🚀 Module Federation con Vite - Rfacil ERP

Este proyecto implementa **Module Federation** usando **Vite** para crear un sistema de micro-frontends modular y escalable.

## 📋 Arquitectura

### 🏗️ Estructura del Proyecto

```
Rfacil-ERP-FrontEnd/
├── apps/
│   ├── host/                 # 🏠 Aplicación Host (Shell)
│   ├── autofactura/         # 📄 Módulo de Autofactura
│   ├── gastos/              # 💰 Módulo de Gastos
│   └── proveedores/         # 🏢 Módulo de Proveedores
├── scripts/
│   └── dev-federation.js    # 🛠️ Script de desarrollo
└── package.json
```

### 🔧 Configuración de Module Federation

#### Host Application (apps/host)
- **Puerto**: 4200
- **Función**: Shell principal que carga los módulos remotos
- **Configuración**: Consume módulos de autofactura, gastos y proveedores

#### Módulos Remotos
- **Autofactura** (puerto 4201): Gestión de facturas automáticas
- **Gastos** (puerto 4202): Control de gastos empresariales  
- **Proveedores** (puerto 4203): Gestión de proveedores

## 🚀 Comandos de Desarrollo

### Iniciar todos los módulos
```bash
npm run dev:federation
```

### Iniciar módulos individuales
```bash
# Host application
npm run start:host

# Módulos remotos
npm run start:autofactura
npm run start:gastos
npm run start:proveedores
```

### Build para producción
```bash
npm run build:federation
```

### Preview de producción
```bash
npm run preview
```

### Limpiar builds
```bash
npm run clean
```

## 🔐 Sistema de Autenticación

### Usuarios de Prueba

| Email | Contraseña | Rol | Permisos |
|-------|------------|-----|----------|
| admin@rfacil.com | password123 | Admin | Todos los módulos |
| manager@rfacil.com | password123 | Manager | Autofactura + Gastos |
| user@rfacil.com | password123 | User | Solo Gastos |

### Características del Sistema de Auth

- ✅ **Autenticación persistente** con LocalStorage
- ✅ **Control de permisos** por módulo
- ✅ **Estados de carga** y manejo de errores
- ✅ **Comunicación entre módulos** vía eventos globales
- ✅ **UI responsive** y moderna

## 🌐 Acceso a las Aplicaciones

### URLs de Desarrollo

- **🏠 Host Application**: http://localhost:4200
- **📄 Autofactura**: http://localhost:4201
- **💰 Gastos**: http://localhost:4202
- **🏢 Proveedores**: http://localhost:4203

### Flujo de Usuario

1. **Acceder al Host** (http://localhost:4200)
2. **Iniciar sesión** con credenciales de prueba
3. **Navegar a módulos** según permisos del usuario
4. **Desarrollar independientemente** cada módulo

## 🛠️ Desarrollo de Módulos

### Estructura de un Módulo Remoto

```typescript
// apps/[module]/src/app/app.tsx
interface ModuleAppProps {
  user?: any;
  onNavigate?: (path: string) => void;
  theme?: 'light' | 'dark';
  permissions?: string[];
}

export function App({ user, onNavigate, theme, permissions }: ModuleAppProps) {
  // Lógica del módulo
  return (
    <div>
      {/* Contenido del módulo */}
    </div>
  );
}
```

### Configuración de Vite para Module Federation

```typescript
// vite.config.ts
import { federation } from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'moduleName',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/app/app.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
});
```

## 🔄 Comunicación entre Módulos

### Eventos Globales

```typescript
// Enviar evento
window.dispatchEvent(new CustomEvent('userUpdated', { detail: userData }));

// Escuchar evento
window.addEventListener('userUpdated', (event) => {
  console.log('User updated:', event.detail);
});
```

### PostMessage API

```typescript
// En módulo remoto
window.parent.postMessage({
  type: 'MODULE_INTERACTION',
  module: 'moduleName',
  action: 'feature_click',
  data: { feature: 'create_invoice' }
}, '*');
```

## 🎯 Mejores Prácticas

### 1. **Desarrollo Independiente**
- Cada módulo se puede desarrollar por separado
- Hot reload funciona independientemente
- Tests unitarios por módulo

### 2. **Gestión de Estado**
- Estado local por módulo
- Comunicación vía eventos globales
- Datos compartidos en localStorage

### 3. **Estilos**
- CSS Modules o Styled Components por módulo
- Variables CSS compartidas en el host
- Tema consistente entre módulos

### 4. **Routing**
- React Router en el host
- Rutas protegidas por permisos
- Navegación programática entre módulos

## 🐛 Debugging

### Herramientas de Desarrollo

1. **Console Logs**: Cada módulo tiene logs identificados
2. **Network Tab**: Verificar carga de remoteEntry.js
3. **Application Tab**: Revisar localStorage y sessionStorage
4. **Module Federation DevTools**: Extensión de Chrome disponible

### Problemas Comunes

#### Módulo no carga
```bash
# Verificar que el módulo remoto esté ejecutándose
curl http://localhost:4201/assets/remoteEntry.js

# Revisar configuración de CORS
# Verificar shared dependencies
```

#### Error de permisos
```typescript
// Verificar configuración de permisos en AuthContext
const hasPermission = (permission: string) => {
  return user?.permissions.includes(permission);
};
```

## 📦 Deployment

### Build para Producción

```bash
# Build todos los módulos
npm run build:federation

# Los archivos se generan en dist/apps/[module]/
```

### Configuración de Servidor

- **Host**: Servir desde `/`
- **Módulos**: Servir desde `/assets/remoteEntry.js`
- **CORS**: Configurar para permitir carga cross-origin

### Variables de Entorno

```bash
# .env.production
VITE_HOST_URL=https://host.rfacil.com
VITE_AUTOFACTURA_URL=https://autofactura.rfacil.com
VITE_GASTOS_URL=https://gastos.rfacil.com
VITE_PROVEEDORES_URL=https://proveedores.rfacil.com
```

## 🔮 Roadmap

### Próximas Características

- [ ] **SSR Support** con Next.js
- [ ] **State Management** con Redux/Zustand
- [ ] **API Gateway** centralizado
- [ ] **Microservices** backend
- [ ] **CI/CD** automatizado
- [ ] **Monitoring** y analytics

### Optimizaciones

- [ ] **Code Splitting** avanzado
- [ ] **Lazy Loading** de módulos
- [ ] **Cache** de módulos remotos
- [ ] **Prefetching** inteligente

## 📚 Recursos Adicionales

- [Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [Micro Frontends Guide](https://micro-frontends.org/)
- [React Router v6](https://reactrouter.com/)

## 🤝 Contribución

1. Fork el repositorio
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ para Rfacil ERP**
