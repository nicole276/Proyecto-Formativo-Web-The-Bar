import { useState, useEffect } from 'react';
import RolesList from './RolesList';
import RoleForm from './RoleForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';

export default function RolesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [alert, setAlert] = useState(null);

  // ✅ Cerrar alerta automáticamente
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSave = (data) => {
    try {
      if (editingRole) {
        // ✅ Simular API: update
        console.log('Role updated:', { ...editingRole, ...data });
      } else {
        // ✅ Simular API: create
        console.log('Role created:', data);
      }
      setAlert({ type: 'success', message: 'Registro con éxito' });
      setShowForm(false);
      setEditingRole(null);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* ✅ Alertas globales */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <RolesList
        onEdit={(role) => {
          setEditingRole(role);
          setShowForm(true);
        }}
        onCreate={() => {
          setEditingRole(null);
          setShowForm(true);
        }}
      />

      {/* ✅ Modal para formulario */}
      <Modal
        isOpen={showForm}
        title={editingRole ? 'Editar Rol' : 'Registrar Rol'}
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
    </div>
  );
}