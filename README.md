# FlySolo - Sistema de Viajes Espaciales de Star Wars 🌌

FlySolo es una aplicación web completa inspirada en el universo de Star Wars que permite gestionar viajes espaciales entre planetas. Los usuarios pueden elegir su bando (Alianza Rebelde o Imperio Galáctico) y reservar viajes, mientras que los pilotos gestionan sus naves y misiones según su afiliación.

## 🚀 Características Principales

### 🏛️ **Sistema de Bandos Star Wars**
- **Alianza Rebelde** vs **Imperio Galáctico** vs **Neutral**
- Pilotos solo ven viajes de su bando o misiones encubiertas
- Viajes específicos por facción con temática immersiva
- Misiones encubiertas cross-faction para espionaje

### 💻 **Frontend (React + TypeScript)**
- **React 18** con TypeScript para desarrollo type-safe
- **Vite** como bundler ultrarrápido
- **React Router v6** para navegación SPA
- **CSS Modular** con tema Star Wars completo
- **Componentes Reutilizables** con sistema de design tokens
- **Responsive Design** mobile-first

### 🔧 **Backend (Express + Prisma)**
- **Express.js** con TypeScript para API REST
- **Prisma ORM** para gestión type-safe de base de datos
- **SQLite** como base de datos (fácil deployment)
- **JWT** para autenticación segura con payload extendido
- **bcryptjs** con pepper/salt para hashing de contraseñas
- **Multer** para subida de imágenes de perfil

## 🏗️ Arquitectura del Sistema

### � **Estructura del Monorepo**
```
FlySolo/
├── backend/                    # API REST en Express + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos con bandos
│   │   ├── dev.db             # Base de datos SQLite
│   │   └── seed.ts            # Datos de prueba con personajes SW
│   ├── src/
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── routes/           # Endpoints de API
│   │   ├── middlewares/      # Auth, CORS, error handling
│   │   ├── utils/            # Utilidades (auth, distance, files)
│   │   └── index.ts          # Servidor principal
│   └── uploads/              # Archivos subidos
├── frontend/                  # React App con TypeScript
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── ui/          # Sistema de componentes
│   │   │   └── FactionSelector.tsx  # Selector de bandos
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── hooks/           # React hooks personalizados
│   │   ├── services/        # Servicios API
│   │   ├── styles/          # CSS modular con tema Star Wars
│   │   └── types/           # Definiciones TypeScript
│   └── public/              # Assets estáticos
├── package.json              # Configuración workspace raíz
├── pnpm-workspace.yaml       # Configuración monorepo
└── README.md
```

### 🗄️ **Base de Datos (11 Modelos)**
- **User**: Usuarios con roles y **facciones** (REBEL/IMPERIAL/NEUTRAL)
- **Trip**: Viajes con **filtrado por bando** e **isCovert** para misiones secretas
- **SolarSystem**: Sistemas solares del universo Star Wars
- **Planet**: Planetas icónicos (Tatooine, Coruscant, Alderaan)
- **Ship**: Naves espaciales (Millennium Falcon, X-Wing)
- **Weapon**: Armas (Laser Cannon, Ion Cannon)
- **PilotShip**: Asignación piloto-nave con armamento
- **PilotStats**: Estadísticas de pilotos
- **Review**: Sistema de reseñas post-viaje

## 👥 Usuarios Precargados

El sistema incluye usuarios de prueba con temática Star Wars:

### 🛡️ **Administrador**
- **Email**: `admin@flysolo.com`
- **Password**: `admin123`
- **Rol**: ADMIN
- **Bando**: Neutral
- **Descripción**: Administrador del sistema FlySolo

### ⚡ **Alianza Rebelde**

#### Piloto Rebelde
- **Email**: `han.solo@flysolo.com`
- **Password**: `pilot123`
- **Rol**: PILOT
- **Bando**: REBEL
- **Descripción**: Han Solo, el contrabandista convertido en héroe

#### Usuario Rebelde  
- **Email**: `luke.skywalker@flysolo.com`
- **Password**: `user123`
- **Rol**: USER
- **Bando**: REBEL
- **Descripción**: Luke Skywalker, joven granjero convertido en Jedi

### ⭐ **Imperio Galáctico**

#### Piloto Imperial
- **Email**: `vader@empire.gov`
- **Password**: `empire123`
- **Rol**: PILOT
- **Bando**: IMPERIAL
- **Descripción**: Darth Vader, Lord Sith del Imperio

#### Usuario Imperial
- **Email**: `palpatine@empire.gov`
- **Password**: `empire123`
- **Rol**: USER
- **Bando**: IMPERIAL
- **Descripción**: Emperador Palpatine, líder del Imperio Galáctico

## 🚀 Guía de Instalación y Deployment

### 📋 **Prerrequisitos**
- **Node.js** 18.0.0 o superior
- **pnpm** 8.0.0+ (recomendado) o npm/yarn
- **Git** para clonar el repositorio

### 📥 **Instalación Completa**

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd FlySolo
```

2. **Instalar todas las dependencias**
```bash
# Instala dependencias del workspace completo
pnpm install
```

3. **Configurar base de datos**
```bash
# Aplicar schema a la base de datos
cd backend
pnpm run db:push

# Poblar con datos de prueba (usuarios Star Wars)
pnpm run db:seed
```

4. **Configurar variables de entorno**
```bash
# En backend/ crear .env si no existe
cd backend
echo "DATABASE_URL=\"file:./prisma/dev.db\"" > .env
echo "JWT_SECRET=\"your-super-secret-jwt-key-change-in-production\"" >> .env
echo "PASSWORD_PEPPER=\"flysolo-pepper-2025\"" >> .env
echo "FRONTEND_URL=\"http://localhost:5173\"" >> .env
```

### 🏃‍♂️ **Ejecutar en Desarrollo**

#### Opción 1: Ambos servidores juntos
```bash
# Desde la raíz del proyecto
pnpm run dev
```

#### Opción 2: Servidores separados
```bash
# Terminal 1 - Backend API
cd backend
pnpm run dev

# Terminal 2 - Frontend React
cd frontend  
pnpm run dev
```

### 🌐 **URLs de Desarrollo**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health
- **Base de Datos**: `backend/prisma/dev.db` (SQLite)

### 📊 **Verificar Instalación**
```bash
# Verificar backend
curl http://localhost:5000/api/health

# Verificar usuarios en base de datos
cd backend
pnpm run db:studio  # Abre Prisma Studio en el navegador
```

## 🎮 Funcionalidades por Rol y Bando

### 👤 **Usuario Regular (USER)**
- ✅ Registro con selección de bando
- ✅ Perfil con imagen personalizable
- ✅ Ver planetas disponibles por bando
- ✅ Reservar viajes de su facción
- ✅ Ver historial de viajes
- ✅ Sistema de reseñas post-viaje

### 🚁 **Piloto (PILOT)**
- ✅ Todas las funciones de usuario
- ✅ Ver solo viajes de su bando o encubiertos
- ✅ Asignarse a misiones disponibles
- ✅ Gestionar naves asignadas
- ✅ Actualizar estado de viajes
- ✅ Estadísticas de vuelos

### 🛡️ **Administrador (ADMIN)**
- ✅ Gestión completa de usuarios
- ✅ Ver todos los viajes sin restricciones
- ✅ Gestionar planetas y sistemas
- ✅ Gestionar naves y armamento
- ✅ Estadísticas del sistema

## 🎨 Sistema de Diseño Star Wars

### 🎨 **Paleta de Colores por Bando**
```css
/* Alianza Rebelde */
--rebel-primary: #ff6b3d;
--rebel-secondary: #dc2626;

/* Imperio Galáctico */  
--imperial-primary: #6366f1;
--imperial-secondary: #4338ca;

/* Neutral/General */
--neutral: #6b7280;
--covert: #f59e0b;  /* Misiones encubiertas */
```

### 🧩 **Componentes Star Wars**
- **FactionSelector**: Selector inmersivo de bandos
- **FactionBadge**: Insignias de bando con iconos
- **TripCard**: Tarjetas con colores de facción
- **StarWarsButton**: Botones temáticos por bando
- **StarWarsInput**: Inputs con estilo futurista

### 🎭 **Temática Visual**
- Tipografía: `Orbitron` para elementos futuristas
- Iconos: Emojis temáticos (⚡ Rebeldes, ⭐ Imperio)
- Gradientes: Fondos con degradados espaciales
- Efectos: Box-shadows y transitions suaves

## 📡 API Endpoints Completos

### 🔐 **Autenticación**
```
POST /api/auth/register     # Registro con selección de bando
POST /api/auth/login        # Login con datos de bando en JWT
GET  /api/auth/profile      # Perfil de usuario con facción
PUT  /api/auth/profile      # Actualizar perfil
POST /api/auth/profile/image # Subir imagen de perfil
```

### 🚀 **Viajes (con filtrado por bando)**
```
GET  /api/trips             # Viajes filtrados por facción del usuario
GET  /api/trips/available   # Viajes disponibles para pilotos de su bando
GET  /api/trips/my-trips    # Viajes del usuario (como pasajero/piloto)
POST /api/trips             # Crear nuevo viaje
GET  /api/trips/:id         # Detalle de viaje específico
POST /api/trips/:id/assign  # Asignarse como piloto (verificación de bando)
PATCH /api/trips/:id/status # Actualizar estado del viaje
```

### 🌍 **Recursos**
```
GET  /api/planets           # Planetas del universo Star Wars
GET  /api/ships             # Naves disponibles  
GET  /api/weapons           # Armamento (admin)
GET  /api/users             # Usuarios (admin)
GET  /api/pilots            # Pilotos con estadísticas
```

## 🛠️ Scripts de Desarrollo

### Backend
```bash
pnpm run dev         # Desarrollo con hot-reload (tsx watch)
pnpm run build       # Compilar TypeScript
pnpm run start       # Ejecutar versión compilada
pnpm run db:generate # Generar cliente Prisma
pnpm run db:push     # Aplicar schema a BD
pnpm run db:migrate  # Crear migración
pnpm run db:seed     # Poblar datos Star Wars
pnpm run db:studio   # GUI de base de datos
```

### Frontend  
```bash
pnpm run dev         # Desarrollo con HMR
pnpm run build       # Build optimizado para producción
pnpm run preview     # Preview del build
pnpm run type-check  # Verificar tipos TypeScript
```

### Workspace Root
```bash
pnpm run dev         # Backend + Frontend simultáneo
pnpm install         # Instalar todas las dependencias
pnpm run backend:dev # Solo backend
pnpm run frontend:dev # Solo frontend
```

## 🔒 Características de Seguridad

### 🛡️ **Autenticación JWT**
- Tokens con información de bando y roles
- Expiración configurable (7 días por defecto)
- Payload extendido: `{ id, userId, email, role, faction }`

### 🔐 **Hashing de Contraseñas**  
- bcryptjs con 14 salt rounds
- Pepper adicional para seguridad extra
- Verificación en login con pepper

### 🚨 **Middleware de Seguridad**
- Helmet para headers de seguridad
- CORS configurado para frontend
- Validación de archivos de imagen
- Rate limiting (futuro)

### 🎯 **Autorización por Bandos**
- Filtrado automático de viajes por facción
- Verificación de bando en asignación de vuelos  
- Misiones encubiertas accesibles a todos
- Admin puede ver todo sin restricciones

## 🌟 Lógica del Sistema de Bandos

### 👁️ **Visibilidad de Viajes**

**Para Pilotos REBEL:**
- ✅ Viajes faction='REBEL' 
- ✅ Viajes isCovert=true (cualquier bando)
- ✅ Viajes faction=null (neutral)
- ❌ Viajes faction='IMPERIAL' (no encubiertos)

**Para Pilotos IMPERIAL:**
- ✅ Viajes faction='IMPERIAL'
- ✅ Viajes isCovert=true (cualquier bando)  
- ✅ Viajes faction=null (neutral)
- ❌ Viajes faction='REBEL' (no encubiertos)

**Para ADMIN:**
- ✅ Todos los viajes sin restricciones

### 🕵️‍♂️ **Misiones Encubiertas**
- Marcadas con `isCovert: true`
- Visibles a pilotos de ambos bandos
- Permiten espionaje cross-faction
- Identificadas con badge especial 🕵️‍♂️

### 🎨 **Indicadores Visuales**
- **Rebelde**: Borde naranja (#ff6b3d)
- **Imperial**: Borde azul (#6366f1)  
- **Encubierto**: Borde dorado (#f59e0b) + gradiente
- **Neutral**: Borde gris (#6b7280)

## 🚀 Deployment en Producción

### 📦 **Build para Producción**
```bash
# Frontend
cd frontend
pnpm run build
# Genera dist/ con archivos optimizados

# Backend  
cd backend
pnpm run build
# Genera dist/ con JavaScript compilado
```

### 🌐 **Variables de Entorno Producción**
```env
# Backend .env
DATABASE_URL="file:./prisma/prod.db"
JWT_SECRET="your-super-secure-production-jwt-secret-256-bits"
PASSWORD_PEPPER="production-pepper-very-secure-2025"
FRONTEND_URL="https://your-domain.com"
PORT=5000
NODE_ENV=production
```

### 🐳 **Docker (Futuro)**
```dockerfile
# Ejemplo Dockerfile futuro
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build
CMD ["pnpm", "start"]
```

## 🎯 Testing y Calidad

### 🧪 **Usuarios de Prueba por Escenario**

**Testing Bando Rebelde:**
- Login: `han.solo@flysolo.com` / `pilot123`
- Verificar: Solo ve viajes REBEL + encubiertos
- Crear viaje rebelde y verificar visibilidad

**Testing Bando Imperial:**  
- Login: `vader@empire.gov` / `empire123`
- Verificar: Solo ve viajes IMPERIAL + encubiertos
- Intentar asignarse a viaje rebelde (debe fallar)

**Testing Admin:**
- Login: `admin@flysolo.com` / `admin123` 
- Verificar: Ve todos los viajes sin filtros
- Gestionar usuarios de ambos bandos

## 🔮 Roadmap y Mejoras Futuras

### 📈 **Próximas Características**
- [ ] **Chat en tiempo real** entre piloto/pasajero
- [ ] **Mapa interactivo** de la galaxia Star Wars
- [ ] **Sistema de reputación** por bando
- [ ] **Misiones grupales** multi-piloto
- [ ] **Economía** con créditos galácticos
- [ ] **Push notifications** para vuelos
- [ ] **PWA** para móviles

### 🔧 **Mejoras Técnicas**
- [ ] **Tests unitarios** con Jest/Vitest
- [ ] **Tests E2E** con Playwright
- [ ] **Docker containerization**
- [ ] **CI/CD pipeline** con GitHub Actions
- [ ] **PostgreSQL** en producción
- [ ] **Redis** para sesiones
- [ ] **CDN** para assets estáticos

### 🎮 **Gamificación**
- [ ] **Logros** por bandos completados
- [ ] **Ranking** de pilotos por facción
- [ ] **Eventos temporales** del universo SW
- [ ] **Rewards** por lealtad al bando

## 🆘 Solución de Problemas

### ❌ **Problemas Comunes**

**Puerto 5000 ocupado:**
```bash
# Windows
netstat -aon | findstr :5000
taskkill /F /PID <PID>

# Linux/Mac  
lsof -ti:5000 | xargs kill -9
```

**Error Prisma EPERM (Windows):**
```bash
# Ejecutar como Administrador o cambiar permisos
pnpm run db:push
```

**CSS no carga:**
- Verificar que ambos servidores estén corriendo
- Clear cache del navegador
- Verificar console errors

**Login falla:**
- Verificar que db:seed se ejecutó correctamente
- Revisar que JWT_SECRET esté configurado
- Check network tab para errores 401/403

## 📞 Soporte y Contribución

### 🐛 **Reportar Bugs**
1. Describir pasos para reproducir
2. Incluir logs de consola (F12)
3. Especificar sistema operativo y navegador
4. Mencionar bando/rol del usuario

### ✨ **Contribuir**
1. Fork del repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. Seguir convenciones de código TypeScript
4. Actualizar documentación si es necesario
5. Abrir Pull Request con descripción detallada

---

## 🌟 **Sobre FlySolo**

FlySolo es más que una aplicación de viajes espaciales - es una experiencia inmersiva en el universo de Star Wars que demuestra las mejores prácticas de desarrollo full-stack moderno:

### ✅ **Características Técnicas Destacadas**
- **TypeScript Full-Stack** para type safety completo
- **Monorepo** con pnpm workspace para desarrollo eficiente  
- **Sistema de Bandos** con lógica de negocio compleja
- **Autenticación Segura** JWT con payload extendido
- **Base de Datos Relacional** con Prisma ORM
- **API REST** completa con filtrado inteligente
- **Componentes Reutilizables** con sistema de diseño
- **CSS Modular** con temática Star Wars inmersiva
- **Responsive Design** mobile-first

### 🎯 **Valor Educativo**
- Implementación de sistemas de roles y permisos
- Filtrado de datos basado en contexto de usuario
- Arquitectura escalable con separación de concerns
- Manejo de archivos y autenticación
- CSS avanzado con custom properties y themes

*"May the Force be with you, and may FlySolo take you across the galaxy!"* 🚀✨

---

**Desarrollado con ❤️ y mucha cafeína ☕**

### API Endpoints
```
Auth:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
POST /api/auth/profile/image

Resources:
GET  /api/planets
GET  /api/ships
GET  /api/trips
GET  /api/users (admin)
GET  /api/weapons (admin)
```

## 🎨 Sistema de Diseño

### Tema Star Wars
- **Colores**: Azul Imperial, Dorado, Verde Rebelde
- **Tipografía**: Sistema de fuentes moderno
- **Componentes**: Botones, Cards, Modals, Alerts, etc.
- **Espaciado**: Sistema consistente con design tokens
- **Responsive**: Mobile-first con breakpoints

### Componentes Reutilizables
- `Button`: 4 variantes, 3 tamaños, estados de loading
- `Input`: Con validación, errores, helper text
- `Card`: Con header, body, footer modulares  
- `Modal`: Diferentes tamaños, accesible
- `Alert`: 4 tipos, dismissible
- `Avatar`: Con fallback, múltiples tamaños
- `Badge`: Para estados y roles
- `Spinner`: Indicadores de carga

## 🔐 Usuarios de Prueba

El sistema incluye usuarios de prueba con diferentes roles:

### Administrador
- **Email**: admin@flysolo.com
- **Password**: admin123
- **Rol**: ADMIN

### Piloto
- **Email**: han.solo@flysolo.com  
- **Password**: pilot123
- **Rol**: PILOT

### Usuario Regular
- **Email**: luke.skywalker@flysolo.com
- **Password**: user123
- **Rol**: USER

## 🚀 Cómo Ejecutar

### Prerrequisitos
- Node.js 18+
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar repositorio
git clone <repo-url>
cd FlySolo

# Instalar dependencias
pnpm install
```

### Desarrollo
```bash
# Terminal 1 - Backend
cd backend
pnpm run dev

# Terminal 2 - Frontend  
cd frontend
pnpm run dev
```

### URLs de Desarrollo
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Base de Datos**: backend/prisma/dev.db

### Scripts Disponibles

#### Backend
```bash
pnpm run dev      # Servidor desarrollo con hot-reload
pnpm run build    # Compilar TypeScript a JavaScript
pnpm run start    # Ejecutar versión compilada
pnpm run seed     # Poblar base de datos con datos de prueba
pnpm run studio   # Abrir Prisma Studio (GUI de BD)
```

#### Frontend
```bash
pnpm run dev      # Servidor desarrollo con hot-reload
pnpm run build    # Build para producción
pnpm run preview  # Previsualizar build de producción
```

## 🎯 Funcionalidades por Rol

### Usuario Regular (USER)
- Registrarse e iniciar sesión
- Ver y editar perfil con imagen
- Explorar planetas disponibles
- Ver naves disponibles
- Reservar viajes espaciales
- Ver historial de viajes
- Dejar reseñas de viajes

### Piloto (PILOT)  
- Todas las funciones de usuario
- Gestionar sus naves y armas
- Ver vuelos asignados
- Gestionar horarios
- Confirmar/cancelar vuelos

### Administrador (ADMIN)
- Todas las funciones anteriores
- Gestionar todos los usuarios
- Gestionar planetas y sistemas solares
- Gestionar naves y armas
- Ver todos los viajes
- Estadísticas del sistema

## 📱 Características de UX

### Navegación Intuitiva
- Navbar responsivo con navegación específica por rol
- Breadcrumbs para navegación jerárquica
- Estados de carga y feedback visual

### Accesibilidad
- Componentes con ARIA labels apropiados
- Navegación por teclado
- Contraste de colores accesible
- Textos alternativos para imágenes

### Rendimiento
- Componentes optimizados con React
- CSS modular para carga eficiente
- Imágenes optimizadas
- Estados de carga progresivos

## 🔧 Tecnologías Utilizadas

### Frontend Stack
- React 18 + TypeScript
- React Router DOM v6
- Vite (Build tool)
- CSS3 con Custom Properties
- Fetch API para HTTP requests

### Backend Stack
- Express.js + TypeScript
- Prisma ORM
- SQLite Database
- bcryptjs + JWT
- Multer (file uploads)
- CORS, Morgan (middleware)

### DevTools
- TypeScript Compiler
- ESLint (linting)
- Hot Module Replacement
- Prisma Studio
- VS Code Extensions

## 📄 Archivos de Configuración

### Workspace (pnpm)
- `pnpm-workspace.yaml`: Configuración monorepo
- `package.json` raíz: Scripts principales

### Backend
- `prisma/schema.prisma`: Esquema de base de datos
- `tsconfig.json`: Configuración TypeScript
- `.env`: Variables de entorno

### Frontend  
- `vite.config.ts`: Configuración de Vite
- `tsconfig.json`: Configuración TypeScript
- `index.html`: Punto de entrada HTML

## 🎨 Patrones de Diseño

### Components Pattern
- Componentes funcionales con hooks
- Props tipadas con TypeScript
- Composición sobre herencia

### Service Layer
- Servicios para comunicación con API
- Hook personalizado `useApi`
- Context API para estado global

### CSS Architecture
- CSS Custom Properties para temas
- Utility-first classes
- Component-specific styles
- Mobile-first responsive design

## 🔮 Roadmap Futuro

### Funcionalidades Pendientes
- [ ] Sistema de pagos integrado
- [ ] Notificaciones en tiempo real
- [ ] Chat entre pilotos y pasajeros
- [ ] Sistema de puntuación/reputación
- [ ] Mapas interactivos de la galaxia
- [ ] Modo offline/PWA
- [ ] Tests unitarios e integración
- [ ] Docker containerization
- [ ] CI/CD pipeline

### Mejoras Técnicas
- [ ] Optimización de rendimiento
- [ ] SSR con Next.js
- [ ] GraphQL API
- [ ] WebSockets para tiempo real
- [ ] CDN para assets estáticos
- [ ] Monitoring y analytics
- [ ] Database migrations
- [ ] API rate limiting

## 📞 Soporte

Este proyecto fue desarrollado como demostración de un sistema full-stack moderno con las mejores prácticas de desarrollo web.

**Características destacadas**:
- ✅ Monorepo con pnpm workspace
- ✅ TypeScript full-stack
- ✅ Componentes reutilizables
- ✅ Sistema de diseño consistente
- ✅ Autenticación segura
- ✅ Base de datos relacional
- ✅ API REST completa
- ✅ Responsive design
- ✅ Código limpio y documentado

---

*"En una galaxia muy, muy lejana... FlySolo te lleva a casa."* 🚀✨
