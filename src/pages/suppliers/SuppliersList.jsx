import { useState } from 'react';
import SupplierForm from './SupplierForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, nombre: 'Distribuidora Andina', tipo: 'Jurídica', identificacion: '901234567', nit: '901234567-8', telefono: '3101234567', email: 'contacto@andina.com', direccion: 'Calle 100 #20-30', estado: 'activo' },
    { id: 2, nombre: 'Juan Pérez', tipo: 'Natural', identificacion: '1023456789', nit: '', telefono: '3209876543', email: 'juanperez@gmail.com', direccion: 'Carrera 15 #45-67', estado: 'activo' },
  ]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingSupplier) {
        setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...data } : s));
      } else {
        setSuppliers([...suppliers, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: 'Proveedor registrado con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingSupplier(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // ✅ Validar eliminación solo si está inactivo
const handleDeleteConfirm = (supplier) => {
  if (supplier.estado === 'activo') {
    setAlert({
      type: 'error',
      message: `No se puede eliminar el proveedor "${supplier.nombre}" porque está activo. Cambie su estado a "Inactivo" primero.`,
    });
    setTimeout(() => setAlert(null), 4000);
    return;
  }

  setSupplierToDelete(supplier);
  setShowDeleteDialog(true);
};

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setSuppliers(suppliers.map(s =>
      s.id === id ? { ...s, estado: s.estado === 'activo' ? 'inactivo' : 'activo' } : s
    ));
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          s.identificacion.includes(search) ||
                          (s.telefono && s.telefono.includes(search));
    const matchesType = typeFilter === 'todos' || s.tipo === typeFilter;
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'activo' && s.estado === 'activo') ||
      (statusFilter === 'inactivo' && s.estado === 'inactivo');
    return matchesSearch && matchesType && matchesStatus;
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
            Proveedores
        </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, ID o teléfono..."
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

        <div style={{ minWidth: '140px' }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              border: '1px solid #e0d9d2',
              fontSize: '0.95rem',
            }}
          >
            <option value="todos">Todos</option>
            <option value="Natural">Persona Natural</option>
            <option value="Jurídica">Persona Jurídica</option>
          </select>
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
            setEditingSupplier(null);
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
          Registrar Proveedor
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre / Razón Social</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Tipo</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>ID</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Teléfono</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Email</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => {
                const style = supplier.estado === 'activo' 
                  ? { bg: 'rgba(244, 183, 63, 0.15)', color: '#F4B73F', border: '#F4B73F' }
                  : { bg: 'rgba(216, 102, 51, 0.15)', color: '#D86633', border: '#D86633' };
                return (
                  <tr key={supplier.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                    <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                      {supplier.nombre}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                      {supplier.tipo === 'Jurídica' ? 'Jurídica' : 'Natural'}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                      {supplier.identificacion}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                      {supplier.telefono || '—'}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                      {supplier.email || '—'}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            backgroundColor: style.bg,
                            color: style.color,
                            fontSize: '0.85rem',
                            fontWeight: '600',
                          }}
                        >
                          {supplier.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                        </span>
                        <ToggleSwitch
                          checked={supplier.estado === 'activo'}
                          onChange={() => toggleStatus(supplier.id)}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setViewingSupplier(supplier)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#e8f4ff',
                            color: '#007bff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          👁️
                        </button>
                        {supplier.estado === 'activo' && (
                          <button
                            onClick={() => {
                              setEditingSupplier(supplier);
                              setShowForm(true);
                            }}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fff3cd',
                              color: '#856404',
                              border: 'none',
                              borderRadius: '10px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            ✏️
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(supplier)}
                          disabled={supplier.estado === 'activo'}
                          title={
                            supplier.estado === 'activo'
                              ? 'No se puede eliminar un proveedor activo. Cambie su estado a "Inactivo" primero.'
                              : ''
                          }
                          style={{
                            padding: '0.5rem',
                            backgroundColor: supplier.estado === 'activo' ? '#f5f5f5' : '#ffe8e8',
                            color: supplier.estado === 'activo' ? '#999' : '#e53e3e',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: supplier.estado === 'activo' ? 'not-allowed' : 'pointer',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal de eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="¿Eliminar Proveedor?"
        message={`¿Está seguro de eliminar al proveedor "${supplierToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSupplierToDelete(null);
        }}
        confirmText="✅ Eliminar"
        cancelText="❌ Cancelar"
        confirmColor="#dc3545"
        cancelColor="#6c757d"
      />

      {/* Modales */}
      {viewingSupplier && (
        <Modal
          isOpen={!!viewingSupplier}
          title={`📄 Detalle del Proveedor: ${viewingSupplier.nombre}`}
          onClose={() => setViewingSupplier(null)}
        >
          <div style={{ padding: '1.5rem' }}>
            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Información General</h3>
              <p><strong>Tipo:</strong> {viewingSupplier.tipo === 'Jurídica' ? '🏢 Persona Jurídica' : '👤 Persona Natural'}</p>
              <p><strong>{viewingSupplier.tipo === 'Jurídica' ? 'Razón Social' : 'Nombre'}:</strong> {viewingSupplier.nombre}</p>
              <p><strong>Identificación:</strong> {viewingSupplier.identificacion}</p>
              {viewingSupplier.tipo === 'Jurídica' && (
                <p><strong>NIT:</strong> {viewingSupplier.nit}</p>
              )}
            </div>

            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Contacto</h3>
              <p><strong>Teléfono:</strong> {viewingSupplier.telefono || '—'}</p>
              <p><strong>Email:</strong> {viewingSupplier.email || '—'}</p>
              <p><strong>Dirección:</strong> {viewingSupplier.direccion || '—'}</p>
            </div>

            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Estado</h3>
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  backgroundColor: viewingSupplier.estado === 'activo' ? 'rgba(244, 183, 63, 0.2)' : 'rgba(216, 102, 51, 0.2)',
                  color: viewingSupplier.estado === 'activo' ? '#F4B73F' : '#D86633',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                {viewingSupplier.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
              </span>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => setViewingSupplier(null)}
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
          title={editingSupplier ? '✏️ Editar Proveedor' : '✅ Registrar Proveedor'}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        >
          <SupplierForm
            supplier={editingSupplier}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingSupplier(null);
            }}
          />
        </Modal>
      )}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}