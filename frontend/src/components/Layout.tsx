import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Avatar, Badge } from '../components/ui';
import { UserRole } from '../types';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.PILOT:
        return 'info';
      case UserRole.USER:
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.PILOT:
        return 'Piloto';
      case UserRole.USER:
      default:
        return 'Pasajero';
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard' },
    ];

    if (user?.role === UserRole.USER) {
      return [
        ...baseItems,
        { path: '/trips', label: 'Mis Viajes' },
        { path: '/planets', label: 'Planetas' },
        { path: '/ships', label: 'Naves' },
      ];
    }

    if (user?.role === UserRole.PILOT) {
      return [
        ...baseItems,
        { path: '/pilot/trips', label: 'Mis Vuelos' },
        { path: '/pilot/schedule', label: 'Horarios' },
        { path: '/planets', label: 'Planetas' },
      ];
    }

    if (user?.role === UserRole.ADMIN) {
      return [
        ...baseItems,
        { path: '/admin/users', label: 'Usuarios' },
        { path: '/admin/trips', label: 'Todos los Viajes' },
        { path: '/admin/planets', label: 'Gestión Planetas' },
        { path: '/admin/ships', label: 'Gestión Naves' },
      ];
    }

    return baseItems;
  };

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-secondary border-b border-border sticky top-0 z-fixed">
        <div className="container mx-auto px-lg">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-md">
              <div className="text-2xl font-bold text-primary">
                🚀 FlySolo
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-lg">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${
                    isActivePath(item.path) ? 'nav-link--active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-md">
              <div className="flex items-center space-x-sm">
                <Avatar
                  src={user.profileImage ? `http://localhost:5000${user.profileImage}` : undefined}
                  alt={`${user.firstName} ${user.lastName}`}
                  fallback={`${user.firstName[0]}${user.lastName[0]}`}
                  size="md"
                />
                
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-sm">
                    <span className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <Badge variant={getRoleColor(user.role)} size="sm">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-sm">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    Perfil
                  </Button>
                </Link>
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Salir
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden pb-md">
            <div className="flex flex-wrap gap-sm">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link nav-link--mobile ${
                    isActivePath(item.path) ? 'nav-link--active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-tertiary border-t border-border py-lg mt-auto">
        <div className="container mx-auto px-lg text-center">
          <p className="text-muted text-sm">
            © 2024 FlySolo. Explorando la galaxia, un viaje a la vez.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;