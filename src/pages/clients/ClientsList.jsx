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

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setAlert({ type: 'success', message: `Cliente "${clientToDelete.nombre}" eliminado` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowDeleteDialog(false);
    setClientToDelete(null);
  };

  const handleDelete = (client) => {
    if (client.estado === 'activo') {
      setAlert({
        type: 'error',
        message: `No se puede eliminar al cliente "${client.nombre}" porque está activo.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
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
      'Cédula de Extranjería' : 'Cédula de Extranjería'
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
            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
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
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Tipo Documento</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Documento</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre Completo</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Teléfono</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                    {getDocTypeLabel(client.tipoDocumento)}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontWeight: '600' }}>
                    {client.documento}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                    {client.nombre}
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
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.6rem', 
                      justifyContent: 'center', 
                      flexWrap: 'nowrap',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => setViewingClient(client)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#e8f4ff',
                          color: '#007bff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#d0e7ff';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#e8f4ff';
                          e.currentTarget.style.transform = 'translateY(0)';
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
                          padding: '0.5rem',
                          backgroundColor: '#fff3cd',
                          color: '#856404',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffeaa7';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fff3cd';
                          e.currentTarget.style.transform = 'translateY(0)';
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
                            : 'Eliminar cliente'
                        }
                        style={{
                          padding: '0.5rem',
                          backgroundColor: client.estado === 'activo' ? '#f5f5f5' : '#ffe8e8',
                          color: client.estado === 'activo' ? '#999' : '#e53e3e',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: client.estado === 'activo' ? 'not-allowed' : 'pointer',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (client.estado !== 'activo') {
                            e.currentTarget.style.backgroundColor = '#fecaca';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (client.estado !== 'activo') {
                            e.currentTarget.style.backgroundColor = '#ffe8e8';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
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

      {/* Modal de Ver Detalle - CON DISEÑO ACTUALIZADO */}
      {viewingClient && (
        <Modal
          isOpen={!!viewingClient}
          title="📄 Detalles del Cliente"
          onClose={() => setViewingClient(null)}
          width="550px"
        >
          <div>
            {/* Header con nombre y estado */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '1rem',
              border: '1px solid #e0d9d2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#3B2E2A', 
                  margin: '0 0 0.3rem 0'
                }}>
                  {viewingClient.nombre}
                </h1>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.8rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: '#666',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    <span style={{ 
                      color: '#F4B73F', 
                      fontSize: '1.1rem'
                    }}>📄</span>
                    <strong style={{ color: '#3B2E2A' }}>{getDocTypeLabel(viewingClient.tipoDocumento)}:</strong> {viewingClient.documento}
                  </span>
                </div>
              </div>
              
              {/* Estado - CORREGIDO: usa viewingClient.estado */}
              <div style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                backgroundColor: viewingClient.estado === 'activo' 
                  ? 'rgba(40, 167, 69, 0.1)' 
                  : 'rgba(220, 53, 69, 0.1)',
                border: viewingClient.estado === 'activo' 
                  ? '1px solid #28a745' 
                  : '1px solid #dc3545',
                color: viewingClient.estado === 'activo' ? '#28a745' : '#dc3545',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {viewingClient.estado === 'activo' ? '✅' : '❌'}
                </span>
                <span>
                  {viewingClient.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Sección de Contacto */}
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
                marginBottom: '1rem'
              }}>
                <span style={{ 
                  color: '#F4B73F', 
                  fontSize: '1.4rem'
                }}>📞</span>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: '#3B2E2A', 
                  margin: 0
                }}>
                  Información de Contacto
                </h3>
              </div>
              
              <div style={{
                padding: '0.8rem',
                backgroundColor: '#fdfcf9',
                borderRadius: '8px',
                border: '1px solid #f0ece7'
              }}>
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  {/* Teléfono */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem'
                    }}>
                      <span style={{ 
                        color: '#F4B73F', 
                        fontSize: '1.1rem'
                      }}>📱</span>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#3B2E2A',
                        fontSize: '0.9rem'
                      }}>Teléfono:</span>
                    </div>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#3B2E2A',
                      fontSize: '0.95rem'
                    }}>
                      {viewingClient.telefono || '—'}
                    </span>
                  </div>
                  
                  {/* Línea divisoria */}
                  <div style={{ 
                    height: '1px', 
                    backgroundColor: '#e0d9d2',
                    margin: '0.2rem 0'
                  }} />
                  
                  {/* Email */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem'
                    }}>
                      <span style={{ 
                        color: '#F4B73F', 
                        fontSize: '1.1rem'
                      }}>📧</span>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#3B2E2A',
                        fontSize: '0.9rem'
                      }}>Email:</span>
                    </div>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#3B2E2A',
                      fontSize: '0.95rem'
                    }}>
                      {viewingClient.email || '—'}
                    </span>
                  </div>
                  
                  {/* Línea divisoria */}
                  <div style={{ 
                    height: '1px', 
                    backgroundColor: '#e0d9d2',
                    margin: '0.2rem 0'
                  }} />
                  
                  {/* Dirección */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '0.5rem 0'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '0.5rem',
                      minWidth: '100px'
                    }}>
                      <span style={{ 
                        color: '#F4B73F', 
                        fontSize: '1.1rem',
                        marginTop: '0.2rem'
                      }}>🏠</span>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#3B2E2A',
                        fontSize: '0.9rem'
                      }}>Dirección:</span>
                    </div>
                    <span style={{ 
                      fontWeight: '500', 
                      color: '#4b5563',
                      fontSize: '0.9rem',
                      textAlign: 'right',
                      lineHeight: '1.4',
                      flex: 1
                    }}>
                      {viewingClient.direccion || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de Cerrar */}
            <div style={{ 
              textAlign: 'center',
              paddingTop: '1rem'
            }}>
              <button
                onClick={() => setViewingClient(null)}
                style={{
                  padding: '0.8rem 2.5rem',
                  backgroundColor: '#3B2E2A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 3px 6px rgba(59, 46, 42, 0.2)',
                  width: '100%',
                  maxWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d241f';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 10px rgba(59, 46, 42, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B2E2A';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 6px rgba(59, 46, 42, 0.2)';
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
          title={editingClient ? '✏️ Editar Cliente' : '✅ Registrar Nuevo Cliente'}
          onClose={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
          width="700px"
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