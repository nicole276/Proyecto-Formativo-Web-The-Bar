import { useState } from 'react';
import UserForm from './UserForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function UsersList() {
  const [users, setUsers] = useState([
    { id: 1, nombre_completo: 'Admin User', email: 'admin@thebar.com', usuario: 'admin', estado: 'activo', rol: 'Administrador' },
    { id: 2, nombre_completo: 'Juan Pérez', email: 'juan@thebar.com', usuario: 'juanp', estado: 'activo', rol: 'Vendedor' },
    { id: 3, nombre_completo: 'María López', email: 'maria@thebar.com', usuario: 'marial', estado: 'inactivo', rol: 'Comprador' },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
      } else {
        if (users.some(u => u.usuario === data.usuario)) {
          setAlert({ type: 'error', message: 'El nombre de usuario ya está registrado' });
          setTimeout(() => setAlert(null), 3000);
          return;
        }
        setUsers([...users, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: 'Usuario registrado con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingUser(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setAlert({ type: 'success', message: `Usuario "${userToDelete.nombre_completo}" eliminado` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDelete = (user) => {
    if (user.estado === 'activo') {
      setAlert({
        type: 'error',
        message: `No se puede eliminar el usuario "${user.nombre_completo}" porque está activo.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u
    ));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.usuario.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' ||
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
        <div style={{flex: '1', minWidth: '250px' }}>
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

      {/* Modales */}
      {viewingUser && (
        <Modal
          isOpen={!!viewingUser}
          title={`📄 Detalle del Usuario: ${viewingUser.nombre_completo}`}
          onClose={() => setViewingUser(null)}
        >
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', color: '#3B2E2A', marginBottom: '0.5rem' }}>
              👤
            </div>
            <h2 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>{viewingUser.nombre_completo}</h2>
            <p><strong>Email:</strong> {viewingUser.email}</p>
            <p><strong>Usuario:</strong> {viewingUser.usuario}</p>
            <p>
              <strong>Estado:</strong>{' '}
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  backgroundColor: viewingUser.estado === 'activo' ? 'rgba(244, 183, 63, 0.2)' : 'rgba(216, 102, 51, 0.2)',
                  color: viewingUser.estado === 'activo' ? '#F4B73F' : '#D86633',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                {viewingUser.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
              </span>
            </p>
            <p><strong>Rol:</strong> {viewingUser.rol}</p>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={() => setViewingUser(null)}
                style={{
                  padding: '0.7rem 1.8rem',
                  backgroundColor: '#e0e0e0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showForm && (
        <Modal
          isOpen={showForm}
          title={editingUser ? '✏️ Editar Usuario' : '✅ Registrar Usuario'}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
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