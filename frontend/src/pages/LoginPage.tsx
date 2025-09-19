import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, Alert } from '../components/ui';
import { LoginRequest } from '../types';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setApiError(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name as keyof LoginRequest]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-lg">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title className="text-center">
            Bienvenido a FlySolo
          </Card.Title>
          <Card.Description className="text-center">
            Inicia sesión para explorar la galaxia
          </Card.Description>
        </Card.Header>

        <Card.Body>
          {apiError && (
            <Alert
              type="error"
              message={apiError}
              onClose={() => setApiError('')}
              className="mb-lg"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
            <Input
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="tu@email.com"
            />

            <Input
              name="password"
              type="password"
              label="Contraseña"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </Card.Body>

        <Card.Footer className="text-center">
          <p className="text-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:text-primary-hover">
              Regístrate aquí
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default LoginPage;