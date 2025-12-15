import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LiquorIcon from '@mui/icons-material/Liquor';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlineIcon from '@mui/icons-material/LockOutline';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', formData.email);
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F4B73F 0%, #FFF9F0 40%, #ff9361ff 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'biege',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(59, 46, 42, 0.06)',
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          textAlign: 'center',
          border: '1px solid #ff9361ff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {/* Círculo amarillo con ícono */}
        <div
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#d6981cff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 8px rgba(244, 183, 63, 0.3)',
          }}
        >
          <LiquorIcon sx={{ fontSize: '2.5rem', color: '#3B2E2A' }} />
        </div>

        {/* Título "THE BAR" */}
        <h1
          style={{
            color: '#3B2E2A',
            margin: '0',
            fontWeight: '800',
            fontSize: '1.8rem',
            letterSpacing: '0.05em',
          }}
        >
          THE BAR
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            color: '#999',
            fontSize: '0.9rem',
            fontWeight: '500',
            margin: '0.3rem 0 0 0',
          }}
        >
          Sistema de Gestión
        </p>
      </div>

        <h2 style={{ color: '#3B2E2A', marginBottom: '0.5rem', fontSize: '1.4rem'  }}>Acceso al sistema</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
            <label htmlFor="email" style={{ display: 'block', color: '#3B2E2A', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Usuario o Email
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ff9361ff', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8f6f4', color: '#3B2E2A' }}>
                <PersonOutlineIcon sx={{ fontSize: '1.2rem' }} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                style={{ flex: 1, padding: '0.75rem 1rem', border: 'none', outline: 'none', fontSize: '1rem', color: '#3B2E2A' }}
              />
            </div>
            {errors.email && <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.4rem' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label htmlFor="password" style={{ display: 'block', color: '#3B2E2A', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ff9361ff', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8f6f4', color: '#3B2E2A' }}>
                <LockOutlineIcon sx={{ fontSize: '1.2rem' }} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                style={{ flex: 1, padding: '0.75rem 1rem', border: 'none', outline: 'none', fontSize: '1rem', color: '#3B2E2A' }}
              />
            </div>
            {errors.password && <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.4rem' }}>{errors.password}</p>}
          </div>

          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <Link to="/forgot-password" style={{ color: '#D86633', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              backgroundColor: '#d6981cff',
              color: '#3B2E2A',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Iniciar Sesión
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              <Link
                to="/"
                style={{
                  color: '#D86633',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                Visita nuestra página principal
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}