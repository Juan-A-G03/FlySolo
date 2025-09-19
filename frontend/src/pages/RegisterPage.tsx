import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, Alert } from '../components/ui';
import { FactionSelector } from '../components/FactionSelector';
import { RegisterRequest, UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.USER,
    faction: undefined,
  });
  
  const [errors, setErrors] = useState<Partial<RegisterRequest>>({});
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterRequest> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

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
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrarse';
      setApiError(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'role' ? value as UserRole : value 
    }));
    
    // Clear specific error when user starts typing
    if (errors[name as keyof RegisterRequest]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-lg py-xl">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title className="text-center">
            Únete a FlySolo
          </Card.Title>
          <Card.Description className="text-center">
            Crea tu cuenta y comienza tu aventura espacial
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

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="grid grid-cols-2 gap-md">
              <Input
                name="firstName"
                type="text"
                label="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                placeholder="Tu nombre"
              />

              <Input
                name="lastName"
                type="text"
                label="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                placeholder="Tu apellido"
              />
            </div>

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
              helperText="Mínimo 6 caracteres"
            />

            <FactionSelector
              value={formData.faction}
              onChange={(faction) => setFormData(prev => ({ ...prev, faction }))}
              required
            />

            <div className="form-field">
              <label htmlFor="role" className="form-field__label">
                Tipo de Usuario
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                required
              >
                <option value={UserRole.USER}>Pasajero</option>
                <option value={UserRole.PILOT}>Piloto</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </Card.Body>

        <Card.Footer className="text-center">
          <p className="text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover">
              Inicia sesión aquí
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default RegisterPage;