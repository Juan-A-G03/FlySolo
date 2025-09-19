import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Spinner } from './components/ui';

// Temporary Dashboard component
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-lg py-xl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-xl">
          Bienvenido, {user?.firstName}! 🚀
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {/* Quick Stats Cards would go here */}
          <div className="card">
            <div className="card__header">
              <div className="card__title">Próximos Viajes</div>
            </div>
            <div className="card__body">
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-muted">viajes programados</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card__header">
              <div className="card__title">Planetas Visitados</div>
            </div>
            <div className="card__body">
              <div className="text-2xl font-bold text-secondary">12</div>
              <p className="text-muted">mundos explorados</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card__header">
              <div className="card__title">Créditos</div>
            </div>
            <div className="card__body">
              <div className="text-2xl font-bold text-success">25,000</div>
              <p className="text-muted">créditos galácticos</p>
            </div>
          </div>
        </div>
        
        <div className="mt-2xl">
          <h2 className="text-xl font-semibold mb-lg">¿Qué quieres hacer hoy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="card card--outlined hover:card--elevated transition-shadow cursor-pointer">
              <div className="card__body">
                <div className="flex items-center space-x-md">
                  <div className="text-2xl">🌌</div>
                  <div>
                    <h3 className="font-semibold">Explorar Planetas</h3>
                    <p className="text-muted text-sm">Descubre nuevos mundos</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card card--outlined hover:card--elevated transition-shadow cursor-pointer">
              <div className="card__body">
                <div className="flex items-center space-x-md">
                  <div className="text-2xl">🚀</div>
                  <div>
                    <h3 className="font-semibold">Reservar Viaje</h3>
                    <p className="text-muted text-sm">Planifica tu próxima aventura</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-lg" />
          <p className="text-muted">Iniciando FlySolo...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-lg" />
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Placeholder routes for future pages */}
        <Route path="/trips" element={<div className="container mx-auto px-lg py-xl"><h1>Mis Viajes</h1><p>Próximamente...</p></div>} />
        <Route path="/planets" element={<div className="container mx-auto px-lg py-xl"><h1>Planetas</h1><p>Próximamente...</p></div>} />
        <Route path="/ships" element={<div className="container mx-auto px-lg py-xl"><h1>Naves</h1><p>Próximamente...</p></div>} />
        <Route path="/profile" element={<div className="container mx-auto px-lg py-xl"><h1>Mi Perfil</h1><p>Próximamente...</p></div>} />
        
        {/* Pilot Routes */}
        <Route path="/pilot/trips" element={<div className="container mx-auto px-lg py-xl"><h1>Mis Vuelos</h1><p>Próximamente...</p></div>} />
        <Route path="/pilot/schedule" element={<div className="container mx-auto px-lg py-xl"><h1>Horarios</h1><p>Próximamente...</p></div>} />
        
        {/* Admin Routes */}
        <Route path="/admin/users" element={<div className="container mx-auto px-lg py-xl"><h1>Gestión de Usuarios</h1><p>Próximamente...</p></div>} />
        <Route path="/admin/trips" element={<div className="container mx-auto px-lg py-xl"><h1>Todos los Viajes</h1><p>Próximamente...</p></div>} />
        <Route path="/admin/planets" element={<div className="container mx-auto px-lg py-xl"><h1>Gestión de Planetas</h1><p>Próximamente...</p></div>} />
        <Route path="/admin/ships" element={<div className="container mx-auto px-lg py-xl"><h1>Gestión de Naves</h1><p>Próximamente...</p></div>} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;