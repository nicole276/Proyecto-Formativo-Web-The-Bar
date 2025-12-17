import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import UserForm from './UserForm'; // Asegúrate de importar UserForm

export default function UsersList() {
  // ✅ Usuarios iniciales con `descripcion`
  const [users, setUsers] = useState([
    { 
      id: 1, 
      nombre_completo: 'Admin User', 
      email: 'admin@thebar.com', 
      usuario: 'admin', 
      estado: 'activo', 
      rol: 'Administrador',
      descripcion: 'Usuario administrador con acceso total al sistema. No se puede eliminar ni desactivar.'
    },
    { 
      id: 2, 
      nombre_completo: 'Juan Pérez', 
      email: 'juan@thebar.com', 
      usuario: 'juanp', 
      estado: 'activo', 
      rol: 'Vendedor',
      descripcion: 'Encargado de ventas en el turno diurno. Responsable de caja y atención al cliente.'
    },
    { 
      id: 3, 
      nombre_completo: 'María López', 
      email: 'maria@thebar.com', 
      usuario: 'marial', 
      estado: 'inactivo', 
      rol: 'Comprador',
      descripcion: 'Gestiona compras y relaciones con proveedores. Actualmente en licencia.'
    },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // ✅ handleSave corregido: seguro, sin errores
  const handleSave = (data) => {
    try {
      // ✅ Validación segura: editingUser puede ser null
      if (editingUser?.id == null && editingUser != null) {
        throw new Error('Usuario en edición no tiene ID válido');
      }

      if (editingUser) {
        // ✅ Usa callback para evitar estado desactualizado
        setUsers(prev => 
          prev.map(u => 
            u.id === editingUser.id 
              ? { ...u, ...data } 
              : u
          )
        );
      } else {
        // ✅ Validación de usuario duplicado
        if (users.some(u => u.usuario === data.usuario)) {
          setAlert({ type: 'error', message: '❌ El nombre de usuario ya está registrado' });
          setTimeout(() => setAlert(null), 3000);
          return;
        }
        setUsers(prev => [...prev, { id: Date.now(), ...data }]);
      }

      setAlert({ type: 'success', message: '✅ Usuario guardado con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingUser(null);
      }, 2000);
    } catch (err) {
      console.error('💥 Error en handleSave:', err);
      setAlert({ 
        type: 'error', 
        message: `❌ ${err.message || 'No se pudo guardar el usuario'}` 
      });
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setAlert({ type: 'success', message: `✅ Usuario "${userToDelete.nombre_completo}" eliminado` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDelete = (user) => {
    if (user.estado === 'activo') {
      setAlert({
        type: 'error',
        message: `❌ No se puede eliminar a "${user.nombre_completo}" porque está activo.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id 
          ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } 
          : u
      )
    );
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.usuario.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'todos' ||
      (statusFilter === 'activo' && u.estado === 'activo') ||
      (statusFilter === 'inactivo' && u.estado === 'inactivo');
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
      <h1 style={{
        color: '#3B2E2A',
        fontSize: '1.8rem',
        fontWeight: '700',
        margin: '0',
        lineHeight: 2.2,
      }}>
        Usuarios
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, email o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              border: '1px solid #e0d9d2',
              fontSize: '0.95rem',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            }}
          />
        </div>

        <StatusDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'activo', label: '✅ Activo' },
            { value: 'inactivo', label: '❌ Inactivo' },
          ]}
        />

        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          style={{
            padding: '0.75rem 1.2rem',
            backgroundColor: '#F4B73F',
            color: '#3B2E2A',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(244, 183, 63, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: '1.3rem' }} />
          Registrar Usuario
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre Completo</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Email</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Rol</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                  <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>{user.nombre_completo}</td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          padding: '0.1rem 0.1rem',
                          borderRadius: '20px',
                          backgroundColor: user.estado === 'activo' ? 'rgba(244, 183, 63, 0.15)' : 'rgba(216, 102, 51, 0.1)',
                          color: user.estado === 'activo' ? '#F4B73F' : '#D86633',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                        }}
                      >
                        {user.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                      </span>
                      <ToggleSwitch
                        checked={user.estado === 'activo'}
                        onChange={() => toggleStatus(user.id)}
                        disabled={user.nombre_completo === 'Admin User'}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>{user.rol}</td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setViewingUser(user)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#e8f4ff',
                          color: '#007bff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowForm(true);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#fff3cd',
                          color: '#856404',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={user.estado === 'activo' || user.nombre_completo === 'Admin User'}
                        title={user.nombre_completo === 'Admin User' ? 'No se puede eliminar el usuario administrador' : user.estado === 'activo' ? 'No se puede eliminar un usuario activo' : ''}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: (user.estado === 'activo' || user.nombre_completo === 'Admin User') ? '#f5f5f5' : '#ffe8e8',
                          color: (user.estado === 'activo' || user.nombre_completo === 'Admin User') ? '#999' : '#e53e3e',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: (user.estado === 'activo' || user.nombre_completo === 'Admin User') ? 'not-allowed' : 'pointer',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal de eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="¿Eliminar Usuario?"
        message={`¿Está seguro de eliminar al usuario "${userToDelete?.nombre_completo}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setUserToDelete(null);
        }}
        confirmText="✅ Eliminar"
        cancelText="❌ Cancelar"
        confirmColor="#dc3545"
        cancelColor="#6c757d"
      />

      {/* ✅ Modal de detalle — con descripción */}
      {viewingUser && (
      <Modal
        isOpen={!!viewingUser}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>👤</span>
            <span style={{ color: '#3B2E2A', fontWeight: '700' }}>
              Detalles del Usuario
            </span>
          </div>
        }
        onClose={() => setViewingUser(null)}
        width="700px"
      >
        <div style={{ 
          backgroundColor: '#f8f6f4', 
          borderRadius: '12px', 
          padding: '1rem 1.5rem',
          border: '1px solid #e0d9d2',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          {/* Avatar y Nombre en una sola línea */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid #e0d9d2',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ 
              fontSize: '2.2rem', 
              background: 'linear-gradient(135deg, #F4B73F, #ffd166)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(244, 183, 63, 0.25)',
              color: '#3B2E2A',
              fontWeight: '700',
              flexShrink: 0
            }}>
              {viewingUser.nombre_completo.charAt(0).toUpperCase()}
            </div>
            
            <div style={{ flex: 1 }}>
              <h2 style={{ 
                color: '#3B2E2A', 
                marginBottom: '0.2rem',
                fontSize: '1.4rem',
                fontWeight: '700',
                lineHeight: 1.2
              }}>
                {viewingUser.nombre_completo}
              </h2>
              <div style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <span style={{ 
                  backgroundColor: '#f0f0f0',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  @{viewingUser.usuario}
                </span>
                <span style={{ color: '#F4B73F' }}>•</span>
                <span style={{ 
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  backgroundColor: viewingUser.estado === 'activo' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                  color: viewingUser.estado === 'activo' ? '#28a745' : '#dc3545',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  {viewingUser.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                </span>
                <span style={{ color: '#F4B73F' }}>•</span>
                <span style={{ 
                  color: '#3B2E2A',
                  fontWeight: '600'
                }}>
                  {viewingUser.rol}
                </span>
              </div>
            </div>
          </div>

          {/* Información Principal en Grid Compacto */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid #e0d9d2',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem'
            }}>
              {/* Email */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.3rem'
                }}>
                  <span style={{ 
                    color: '#F4B73F', 
                    fontSize: '1.1rem'
                  }}>📧</span>
                  <span style={{ 
                    color: '#3B2E2A', 
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>Email</span>
                </div>
                <div style={{
                  backgroundColor: '#fdfcf9',
                  border: '1px solid #f0ece7',
                  borderRadius: '8px',
                  padding: '0.7rem',
                  color: '#3B2E2A',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  minHeight: '42px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {viewingUser.email}
                </div>
              </div>

              {/* Usuario */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.3rem'
                }}>
                  <span style={{ 
                    color: '#F4B73F', 
                    fontSize: '1.1rem'
                  }}>👤</span>
                  <span style={{ 
                    color: '#3B2E2A', 
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>Usuario</span>
                </div>
                <div style={{
                  backgroundColor: '#fdfcf9',
                  border: '1px solid #f0ece7',
                  borderRadius: '8px',
                  padding: '0.7rem',
                  color: '#3B2E2A',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  minHeight: '42px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {viewingUser.usuario}
                </div>
              </div>

              {/* Estado */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.3rem'
                }}>
                  <span style={{ 
                    color: '#F4B73F', 
                    fontSize: '1.1rem'
                  }}>🔄</span>
                  <span style={{ 
                    color: '#3B2E2A', 
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>Estado</span>
                </div>
                <div
                  style={{
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: viewingUser.estado === 'activo' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                    border: viewingUser.estado === 'activo' ? '1px solid #28a745' : '1px solid #dc3545',
                    color: viewingUser.estado === 'activo' ? '#28a745' : '#dc3545',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    minHeight: '42px'
                  }}
                >
                  <span style={{ fontSize: '0.95rem' }}>
                    {viewingUser.estado === 'activo' ? '✅' : '❌'}
                  </span>
                  <span>
                    {viewingUser.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {/* Rol */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.3rem'
                }}>
                  <span style={{ 
                    color: '#F4B73F', 
                    fontSize: '1.1rem'
                  }}>👑</span>
                  <span style={{ 
                    color: '#3B2E2A', 
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>Rol</span>
                </div>
                <div style={{
                  backgroundColor: '#fdfcf9',
                  border: '1px solid #f0ece7',
                  borderRadius: '8px',
                  padding: '0.7rem',
                  color: '#3B2E2A',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  minHeight: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '3px solid #F4B73F'
                }}>
                  {viewingUser.rol}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ DESCRIPCIÓN — solo si no es null/undefined */}
          {viewingUser.descripcion != null && (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '10px', 
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #e0d9d2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ 
                  color: '#F4B73F', 
                  fontSize: '1.1rem'
                }}>📝</span>
                <h4 style={{ 
                  color: '#3B2E2A', 
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  Descripción
                </h4>
              </div>
              <div style={{
                backgroundColor: '#fdfcf9',
                border: '1px solid #f0ece7',
                borderRadius: '8px',
                padding: '0.8rem',
                color: '#555',
                lineHeight: 1.5,
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                minHeight: '60px',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {viewingUser.descripcion}
              </div>
            </div>
          )}

          {/* Botón de Cerrar más compacto */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e0d9d2'
          }}>
            <button
                onClick={() => setViewingUser(null)}
                style={{
                  padding: '0.8rem 2rem',
                  backgroundColor: '#3B2E2A',
                  color: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B2E2A';
                  e.currentTarget.style.borderColor = 'black';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B2E2A';
                  e.currentTarget.style.borderColor = '#3B2E2A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    )}

      {/* ✅ MODAL PARA REGISTRAR/EDITAR USUARIO - AÑADIDO */}
      {showForm && (
        <Modal
          isOpen={showForm}
          title={editingUser ? '✏️ Editar Usuario' : '✅ Registrar Nuevo Usuario'}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          width="700px"
        >
          <UserForm
            user={editingUser}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingUser(null);
            }}
          />
        </Modal>
      )}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}