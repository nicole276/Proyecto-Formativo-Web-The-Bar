// src/pages/clients/ClientsList.jsx
import { useState } from 'react';
import ClientForm from './ClientForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function ClientsList() {
  const [clients, setClients] = useState([
    { id: 1, nombre: 'Carlos Mendoza', tipoDocumento: 'Cédula', documento: '1023456789', telefono: '3101234567', email: 'carlosm@gmail.com', direccion: 'Calle 50 #15-20', estado: 'activo' },
    { id: 2, nombre: 'Ana María López', tipoDocumento: 'Pasaporte', documento: 'PA-567890', telefono: '3209876543', email: 'anamaria@gmail.com', direccion: 'Carrera 30 #45-67', estado: 'activo' },
  ]);
  const [search, setSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingClient) {
        setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...data } : c));
      } else {
        if (clients.some(c => c.documento === data.documento)) {
          setAlert({ type: 'error', message: 'El número de documento ya está registrado' });
          setTimeout(() => setAlert(null), 3000);
          return;
        }
        setClients([...clients, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: 'Cliente registrado con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingClient(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // ✅ Validar eliminación solo si está inactivo
const handleDeleteConfirm = (client) => {
  if (client.estado === 'activo') {
    setAlert({
      type: 'error',
      message: `No se puede eliminar el cliente "${client.nombre}" porque está activo. Cambie su estado a "Inactivo" primero.`,
    });
    setTimeout(() => setAlert(null), 4000);
    return;
  }

  setClientToDelete(client);
  setShowDeleteDialog(true);
};

  const handleDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setClients(clients.map(c =>
      c.id === id ? { ...c, estado: c.estado === 'activo' ? 'inactivo' : 'activo' } : c
    ));
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          c.documento.includes(search);
    const matchesType = docTypeFilter === 'todos' || c.tipoDocumento === docTypeFilter;
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'activo' && c.estado === 'activo') ||
      (statusFilter === 'inactivo' && c.estado === 'inactivo');
    return matchesSearch && matchesType && matchesStatus;
  });

  const getDocTypeLabel = (tipo) => {
    const labels = {
      'Cédula': 'Cédula',
      'Pasaporte': 'Pasaporte',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
      <h1 style={{ color: '#3B2E2A', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 1rem 0' }}>
        Clientes
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1', minWidth: '200px', maxWidth: '240px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o documento..."
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

        <div style={{ minWidth: '160px' }}>
          <select
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              border: '1px solid #e0d9d2',
              fontSize: '0.95rem',
            }}
          >
            <option value="todos">Todos los documentos</option>
            <option value="Cédula">Cédula</option>
            <option value="Pasaporte">Pasaporte</option>
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
            setEditingClient(null);
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
          Registrar Cliente
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '850px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre Completo</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Documento</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Número</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Teléfono</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                  <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                    {client.nombre}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                    {getDocTypeLabel(client.tipoDocumento)}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontWeight: '600' }}>
                    {client.documento}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                    {client.telefono || '—'}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          backgroundColor: client.estado === 'activo' ? 'rgba(244, 183, 63, 0.15)' : 'rgba(216, 102, 51, 0.15)',
                          color: client.estado === 'activo' ? '#F4B73F' : '#D86633',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                        }}
                      >
                        {client.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                      </span>
                      <ToggleSwitch
                        checked={client.estado === 'activo'}
                        onChange={() => toggleStatus(client.id)}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setViewingClient(client)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#e8f4ff',
                          color: '#007bff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                        }}
                      >
                        👁️ 
                      </button>
                      <button
                        onClick={() => {
                          setEditingClient(client);
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
                        }}
                      >
                        ✏️ 
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        disabled={client.estado === 'activo'}
                        title={
                          client.estado === 'activo'
                            ? 'No se puede eliminar un cliente activo. Cambie su estado a "Inactivo" primero.'
                            : ''
                        }
                        style={{
                          padding: '0.5rem',
                          backgroundColor: client.estado === 'activo' ? '#f5f5f5' : '#ffe8e8',
                          color: client.estado === 'activo' ? '#999' : '#e53e3e',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: client.estado === 'activo' ? 'not-allowed' : 'pointer',
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal de ELIMINAR */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="¿Eliminar Cliente?"
        message={`¿Está seguro de eliminar al cliente "${clientToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setClientToDelete(null);
        }}
        confirmText="✅ Eliminar"
        cancelText="❌ Cancelar"
        confirmColor="#dc3545"
        cancelColor="#6c757d"
      />

      {/* Modales */}
      {viewingClient && (
        <Modal
          isOpen={!!viewingClient}
          title={`📄 Detalle del Cliente: ${viewingClient.nombre}`}
          onClose={() => setViewingClient(null)}
        >
          <div style={{ padding: '1.5rem' }}>
            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Información Personal</h3>
              <p><strong>Nombre:</strong> {viewingClient.nombre}</p>
              <p><strong>Tipo de Documento:</strong> {getDocTypeLabel(viewingClient.tipoDocumento)}</p>
              <p><strong>Número:</strong> {viewingClient.documento}</p>
            </div>

            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Contacto</h3>
              <p><strong>Teléfono:</strong> {viewingClient.telefono || '—'}</p>
              <p><strong>Email:</strong> {viewingClient.email || '—'}</p>
              <p><strong>Dirección:</strong> {viewingClient.direccion || '—'}</p>
            </div>

            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Estado</h3>
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  backgroundColor: viewingClient.estado === 'activo' ? 'rgba(244, 183, 63, 0.2)' : 'rgba(216, 102, 51, 0.2)',
                  color: viewingClient.estado === 'activo' ? '#F4B73F' : '#D86633',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                {viewingClient.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
              </span>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => setViewingClient(null)}
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
          title={editingClient ? '✏️ Editar Cliente' : '✅ Registrar Cliente'}
          onClose={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
        >
          <ClientForm
            client={editingClient}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingClient(null);
            }}
          />
        </Modal>
      )}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}