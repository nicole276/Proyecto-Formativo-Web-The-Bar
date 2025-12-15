// src/pages/roles/RolesList.jsx
import { useState } from 'react';
import RoleForm from './RoleForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
 
export default function RolesList() {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrador', status: 'activo', modules: ['Dashboard', 'Roles', 'Usuarios', 'Categoría', 'Productos', 'Proveedores', 'Clientes', 'Compras', 'Ventas'] },
    { id: 2, name: 'Vendedor', status: 'activo', modules: ['Dashboard', 'Ventas', 'Clientes'] },
    { id: 3, name: 'Comprador', status: 'inactivo', modules: ['Dashboard', 'Compras', 'Proveedores'] },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [viewingRole, setViewingRole] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingRole) {
        setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...data } : r));
      } else {
        setRoles([...roles, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: 'Registro con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingRole(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      setRoles(roles.filter(r => r.id !== roleToDelete.id));
      setAlert({ type: 'success', message: `Rol "${roleToDelete.name}" eliminado` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowDeleteDialog(false);
    setRoleToDelete(null);
  };

  const handleDelete = (role) => {
    if (role.status === 'activo') {
      setAlert({
        type: 'error',
        message: `No se puede eliminar el rol "${role.name}" porque está activo.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setRoles(roles.map(r =>
      r.id === id ? { ...r, status: r.status === 'activo' ? 'inactivo' : 'activo' } : r
    ));
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'todos' || r.status === statusFilter)
  );

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
     <h1 style={{
          color: '#3B2E2A',
          fontSize: '1.8rem',
          fontWeight: '700',
          margin: '0',
          lineHeight: 2.2,
        }}>
            Roles
        </h1>
        {/* Barra superior */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{flex: '1', minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre..."
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
            setEditingRole(null);
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
          Registrar Rol
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Módulos</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                  <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>{role.name}</td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          backgroundColor: role.status === 'activo' ? 'rgba(244, 183, 63, 0.15)' : 'rgba(216, 102, 51, 0.1)',
                          color: role.status === 'activo' ? '#F4B73F' : '#D86633',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                        }}
                      >
                        {role.status === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                      </span>
                      <ToggleSwitch
                        checked={role.status === 'activo'}
                        onChange={() => toggleStatus(role.id)}
                        disabled={role.name === 'Administrador'}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem', maxWidth: '220px', wordBreak: 'break-word' }}>
                    {role.modules.join(', ')}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setViewingRole(role)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#e8f4ff',
                          color: '#007bff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => {
                          setEditingRole(role);
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
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
                        disabled={role.status === 'activo' || role.name === 'Administrador'}
                        title={role.name === 'Administrador' ? 'No se puede eliminar el rol Administrador' : role.status === 'activo' ? 'No se puede eliminar un rol activo' : ''}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: (role.status === 'activo' || role.name === 'Administrador') ? '#f5f5f5' : '#ffe8e8',
                          color: (role.status === 'activo' || role.name === 'Administrador') ? '#999' : '#e53e3e',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: (role.status === 'activo' || role.name === 'Administrador') ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
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
        title="¿Eliminar Rol?"
        message={`¿Está seguro de eliminar el rol "${roleToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setRoleToDelete(null);
        }}
        confirmText="✅ Eliminar"
        cancelText="❌ Cancelar"
        confirmColor="#dc3545"
        cancelColor="#6c757d"
      />

      {/* Modales de detalle y formulario */}
      {viewingRole && (
        <Modal
          isOpen={!!viewingRole}
          title={`📄 Detalle del Rol: ${viewingRole.name}`}
          onClose={() => setViewingRole(null)}
        >
          <div style={{ padding: '1.5rem' }}>
            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏷️</span> Información General
              </h3>
              <p><strong>Nombre:</strong> <span style={{ color: '#3B2E2A', fontWeight: '600' }}>{viewingRole.name}</span></p>
              <p>
                <strong>Estado:</strong>{' '}
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    backgroundColor: viewingRole.status === 'activo' ? 'rgba(244, 183, 63, 0.2)' : 'rgba(216, 102, 51, 0.2)',
                    color: viewingRole.status === 'activo' ? '#F4B73F' : '#D86633',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  {viewingRole.status === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                </span>
              </p>
            </div>

            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🔑</span> Módulos Asignados
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                {viewingRole?.modules.map((module) => (
                  <div
                    key={module}
                    style={{
                      padding: '0.6rem 1rem',
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e0d9d2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ color: '#F4B73F', fontSize: '1.1rem' }}>✓</span>
                    <span>{module}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => setViewingRole(null)}
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
          title={editingRole ? '✏️ Editar Rol' : '✅ Registrar Rol'}
          onClose={() => {
            setShowForm(false);
            setEditingRole(null);
          }}
        >
          <RoleForm
            role={editingRole}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingRole(null);
            }}
          />
        </Modal>
      )}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}