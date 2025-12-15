import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LiquorIcon from '@mui/icons-material/Liquor';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Correo inválido');
      return;
    }

    setSuccess(true);
    setError('');
    setTimeout(() => navigate('/login'), 3000);
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
          backgroundColor: 'white',
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
          <LiquorIcon sx={{ fontSize: '2.5rem', color: '3B2E2A' }} />
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

        <h2 style={{ color: '#3B2E2A', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
          Recuperar Contraseña
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Ingresa tu correo y te enviaremos un código.
        </p>

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  color: '#3B2E2A',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: `1px solid ${error ? '#e53e3e' : '#ff9361ff'}`,
                  backgroundColor: '#fdfdfd',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                }}
              />
              {error && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.9rem',
                backgroundColor: '#D86633',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Enviar Enlace
            </button>
          </form>
        ) : (
          <div>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 183, 63, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
              }}
            >
              <span style={{ fontSize: '2rem', color: '#F4B73F' }}>✓</span>
            </div>
            <h3 style={{ color: '#F4B73F', fontWeight: '700', marginBottom: '0.5rem' }}>
              ¡Listo!
            </h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Revisa tu bandeja de entrada.  
              Redirigiendo...
            </p>
          </div>
        )}

        <p style={{ marginTop: '1.75rem' }}>
          <Link
            to="/login"
            style={{
              color: '#F4B73F',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            ← Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}