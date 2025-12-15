import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LiquorIcon from '@mui/icons-material/Liquor';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function Sidebar() {
  const location = useLocation();
  const userEmail = localStorage.getItem('userEmail') || 'admin@thebar.com';
  const userName = userEmail.split('@')[0] || 'Admin';

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Roles', path: '/roles', icon: <AdminPanelSettingsIcon /> },
    { name: 'Usuarios', path: '/usuarios', icon: <PeopleIcon /> },
    { name: 'Categorías', path: '/categorias', icon: <CategoryIcon /> },
    { name: 'Productos', path: '/productos', icon: <InventoryIcon /> },
    { name: 'Proveedores', path: '/proveedores', icon: <LocalShippingIcon /> },
    { name: 'Clientes', path: '/clientes', icon: <PersonIcon /> },
    { name: 'Compras', path: '/compras', icon: <ShoppingCartIcon /> },
    { name: 'Ventas', path: '/ventas', icon: <AttachMoneyIcon /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <aside
      style={{
        backgroundColor: '#3B2E2A',
        width: '250px',
        minHeight: '100vh',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* ✅ Logo centrado + Sistema de Gestión */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Icono dorado y centrado */}
        <div style={{ marginBottom: '0.8rem' }}>
          <LiquorIcon
            sx={{
              fontSize: 60,
              color: '#F4B73F',
              filter: 'drop-shadow(0 2px 6px rgba(244, 183, 63, 0.3))',
            }}
          />
        </div>

        {/* Texto THE BAR en dos líneas, centrado, bold */}
        <h1
          style={{
            color: '#FFFFFF',
            margin: '0 0 0.3rem',
            fontWeight: '800',
            fontSize: '1.6rem',
            letterSpacing: '-0.5px',
          }}
        >
          THE BAR
        </h1>

        {/* Subtítulo: Sistema de Gestión */}
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            margin: 0,
            fontSize: '0.85rem',
            fontWeight: '500',
          }}
        >
          Sistema de Gestión
        </p>
      </div>

     {/* Menú */}
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '0.7rem' }}>
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                  ...(location.pathname === item.path
                    ? {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        color: '#F4B73F',
                        fontWeight: '600',
                      }
                    : {
                        color: '#FFFFFF',
                        opacity: 0.85,
                      }),
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Parte inferior */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1rem',
          fontSize: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.3rem',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F4B73F',
              fontSize: '0.8rem',
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.9rem' }}>
            {userName}
          </span>

          {/* ✅ Ícono PowerSettingsNew */}
          <button
            onClick={() => setShowLogoutDialog(true)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#D86633',
              cursor: 'pointer',
              fontSize: '1.3rem',
              padding: '0.2rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(216, 102, 51, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            title="Cerrar sesión"
          >
            <PowerSettingsNewIcon sx={{ fontSize: '1.4rem', color: '#D86633' }} />
          </button>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0', fontSize: '0.8rem' }}>
          {userEmail}
        </p>
      </div>

      {/* ✅ Modal de confirmación */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="¿Cerrar sesión?"
        message="¿Está seguro que desea cerrar sesión?"
        onConfirm={() => {
          setShowLogoutDialog(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </aside>
  );
}