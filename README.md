# 🚀 Rfacil ERP Frontend

Sistema ERP modular construido con **Nx** y **Module Federation** para crear una arquitectura de micro-frontends escalable y mantenible.

## 📋 Tabla de Contenidos

- [🚀 Instalación](#-instalación)
- [🏗️ Arquitectura](#️-arquitectura)
- [🛠️ Desarrollo](#️-desarrollo)
- [🔐 Autenticación](#-autenticación)
- [📦 Build y Deploy](#-build-y-deploy)
- [🧪 Testing](#-testing)
- [🐛 Troubleshooting](#-troubleshooting)
- [📚 Recursos](#-recursos)

## 🚀 Instalación

### Prerrequisitos

- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior
- **Git**: Para clonar el repositorio

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ControlVersionesTeckioSoftware/Rfacil-ERP-FrontEnd.git
   cd Rfacil-ERP-FrontEnd
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Nx Cloud (Opcional)**
   ```bash
   npx nx connect-to-nx-cloud
   ```

4. **Verificar instalación**
   ```bash
   npx nx graph
   ```

## 🏗️ Arquitectura

### Estructura del Proyecto

```
Rfacil-ERP-FrontEnd/
├── apps/
│   ├── host/                 # 🏠 Aplicación Host (Shell)
│   ├── autofactura/         # 📄 Módulo de Autofactura
│   ├── gastos/              # 💰 Módulo de Gastos
│   └── proveedores/         # 🏢 Módulo de Proveedores
├── scripts/
│   └── dev-federation.js    # 🛠️ Script de desarrollo
├── dist/                    # 📦 Builds de producción
└── tmp/                     # 🔄 Archivos temporales
```

### Tecnologías Utilizadas

- **Framework**: React 19.0.0
- **Bundler**: Vite 7.0.0
- **Module Federation**: @module-federation/vite
- **Styling**: Tailwind CSS 4.1.14
- **Routing**: React Router 7.2.0
- **Testing**: Vitest 3.0.0
- **Linting**: ESLint 9.8.0
- **Monorepo**: Nx 21.6.4

### Configuración de Module Federation

| Módulo | Puerto | Descripción |
|--------|--------|-------------|
| **host** | 4200 | Aplicación principal que consume los módulos |
| **autofactura** | 4201 | Gestión de facturas automáticas |
| **gastos** | 4202 | Control de gastos empresariales |
| **proveedores** | 4203 | Gestión de proveedores |

## 🛠️ Desarrollo

### Comandos Principales

#### Desarrollo con Module Federation
```bash
# Iniciar todos los módulos en paralelo
npm run dev:federation

# O usar el comando directo
node scripts/dev-federation.js
```

#### Desarrollo Individual
```bash
# Host application
npm run start:host
# o
npx nx serve host

# Módulos individuales
npm run start:autofactura
npm run start:gastos
npm run start:proveedores
```

#### Comandos Nx
```bash
# Ver todos los proyectos
npx nx graph

# Ejecutar tareas específicas
npx nx serve <project-name>
npx nx build <project-name>
npx nx test <project-name>
npx nx lint <project-name>

# Ejecutar tareas en múltiples proyectos
npx nx run-many -t build
npx nx run-many -t test
npx nx run-many -t lint
```

### URLs de Desarrollo

- **🏠 Host Application**: http://localhost:4200
- **📄 Autofactura**: http://localhost:4201
- **💰 Gastos**: http://localhost:4202
- **🏢 Proveedores**: http://localhost:4203

### Flujo de Desarrollo

1. **Acceder al Host** (http://localhost:4200)
2. **Iniciar sesión** con credenciales de prueba
3. **Navegar a módulos** según permisos del usuario
4. **Desarrollar independientemente** cada módulo

## 🔐 Autenticación

### Usuarios de Prueba

| Email | Contraseña | Rol | Permisos |
|-------|------------|-----|----------|
| admin@rfacil.com | password123 | Admin | Todos los módulos |
| manager@rfacil.com | password123 | Manager | Autofactura + Gastos |
| user@rfacil.com | password123 | User | Solo Gastos |

### Características del Sistema

- ✅ **Autenticación persistente** con LocalStorage
- ✅ **Control de permisos** por módulo
- ✅ **Estados de carga** y manejo de errores
- ✅ **Comunicación entre módulos** vía eventos globales
- ✅ **UI responsive** y moderna

## 📦 Build y Deploy

### Build para Producción

```bash
# Build todos los módulos
npm run build:federation

# Build individual
npx nx build <project-name>

# Build con paralelización
npx nx run-many -t build --parallel=4
```

### Preview de Producción

```bash
# Preview todos los módulos
npm run preview

# Preview individual
npx nx preview <project-name>
```

### Limpieza

```bash
# Limpiar cache y builds
npm run clean

# Limpiar solo cache de Nx
npx nx reset
```

### Estructura de Build

Los archivos de producción se generan en:
```
dist/
├── apps/
│   ├── host/
│   ├── autofactura/
│   ├── gastos/
│   └── proveedores/
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests de todos los proyectos
npm run test

# Tests individuales
npx nx test <project-name>

# Tests con coverage
npx nx test <project-name> --coverage

# Tests en modo watch
npx nx test <project-name> --watch
```

### Linting

```bash
# Lint todos los proyectos
npx nx run-many -t lint

# Lint individual
npx nx lint <project-name>

# Lint con fix automático
npx nx lint <project-name> --fix
```

### Type Checking

```bash
# Type check todos los proyectos
npx nx run-many -t typecheck

# Type check individual
npx nx typecheck <project-name>
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Módulo no carga
```bash
# Verificar que el módulo remoto esté ejecutándose
curl http://localhost:4201/assets/remoteEntry.js

# Revisar configuración de CORS
# Verificar shared dependencies
```

#### 2. Error de permisos
```typescript
// Verificar configuración de permisos en AuthContext
const hasPermission = (permission: string) => {
  return user?.permissions.includes(permission);
};
```

#### 3. Puerto ocupado
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :4200

# Terminar proceso (Windows)
taskkill /PID <PID> /F
```

#### 4. Cache corrupto
```bash
# Limpiar cache de Nx
npx nx reset

# Limpiar node_modules
rm -rf node_modules
npm install
```

### Herramientas de Debug

1. **Console Logs**: Cada módulo tiene logs identificados
2. **Network Tab**: Verificar carga de remoteEntry.js
3. **Application Tab**: Revisar localStorage y sessionStorage
4. **Module Federation DevTools**: Extensión de Chrome disponible

## 📚 Recursos

### Documentación Oficial

- [Nx Documentation](https://nx.dev)
- [Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [React Router v7](https://reactrouter.com/)

### Comandos Útiles

```bash
# Ver información del workspace
npx nx show projects

# Ver dependencias del proyecto
npx nx graph

# Generar nuevo proyecto
npx nx g @nx/react:app <name>

# Generar componente
npx nx g @nx/react:component <name> --project=<project>

# Ver configuración de proyecto
npx nx show project <project-name>
```

### Nx Cloud

Este proyecto está configurado con Nx Cloud para:
- **Remote Caching**: Compartir cache entre desarrolladores
- **Distributed Task Execution**: Ejecutar tareas en paralelo
- **Analytics**: Métricas de rendimiento

[Configurar Nx Cloud](https://cloud.nx.app/connect/O7xIlYUkGn)


### Estándares de Código

- Usar **ESLint** para linting
- Usar **Prettier** para formateo
- Escribir **tests** para nuevas funcionalidades
- Seguir **convenciones de naming** de React


**Desarrollado por Grupo Rfacil Empresarial**

