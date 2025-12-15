// src/components/layout/TopNav.jsx
import { useNavigate } from 'react-router-dom';
import LiquorIcon from '@mui/icons-material/Liquor';

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#3B2E2A',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        alignItems: 'center',
      }}
    >
      {/* Logo + Nombre a la izquierda */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#F4B73F',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(244, 183, 63, 0.3)',
          }}
        >
          <LiquorIcon sx={{ fontSize: '1.2rem', color: '#3B2E2A' }} />
        </div>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '0.9rem' }}>THE BAR</span>
      </div>

      {/* Enlaces a la derecha */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            color: 'white',
            background: 'none',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          Inicio
        </button>
        <button
          onClick={() => navigate('/productospage')}
          style={{
            color: 'white',
            background: 'none',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          Productos
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            color: '#F4B73F',
            background: 'none',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </nav>
  );
}