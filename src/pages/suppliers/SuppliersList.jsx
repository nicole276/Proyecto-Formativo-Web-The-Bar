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
        setSuppliers(prev => 
          prev.map(s => s.id === editingSupplier.id ? { ...s, ...data } : s)
        );
      } else {
        setSuppliers(prev => [...prev, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: '✅ Proveedor guardado con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingSupplier(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: '❌ Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteConfirm = () => {
    if (supplierToDelete.estado === 'activo') {
      setAlert({
        type: 'error',
        message: `❌ No se puede eliminar "${supplierToDelete.nombre}" porque está activo.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id));
    setAlert({ type: 'success', message: `✅ "${supplierToDelete.nombre}" eliminado` });
    setTimeout(() => {
      setAlert(null);
      setShowDeleteDialog(false);
      setSupplierToDelete(null);
    }, 2000);
  };

  const handleDelete = (supplier) => {
    if (supplier.estado === 'activo') {
      setAlert({
        type: 'error',
        message: `❌ No se puede eliminar "${supplier.nombre}". Cambie su estado a "Inactivo" primero.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setSupplierToDelete(supplier);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setSuppliers(prev =>
      prev.map(s =>
        s.id === id ? { ...s, estado: s.estado === 'activo' ? 'inactivo' : 'activo' } : s
      )
    );
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
        <div style={{ flex: '1', minWidth: '250px' }}>
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
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f6f4' }}>
              <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre / Razón Social</th>
              <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Tipo</th>
              <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>ID</th>
              <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Teléfono</th>
              <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
              <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => {
              const isActive = supplier.estado === 'activo';
              const statusStyle = {
                bg: isActive ? 'rgba(244, 183, 63, 0.15)' : 'rgba(216, 102, 51, 0.15)',
                color: isActive ? '#F4B73F' : '#D86633',
              };
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
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          border: `1px solid ${statusStyle.color}`,
                        }}
                      >
                        {isActive ? '🟢 Activo' : '🔴 Inactivo'}
                      </span>
                      <ToggleSwitch
                        checked={isActive}
                        onChange={() => toggleStatus(supplier.id)}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
        message={`¿Está seguro de eliminar a "${supplierToDelete?.nombre}"? Esta acción no se puede deshacer.`}
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

      {/* ✅ Modal de detalle — con EMAIL incluido */}
      {viewingSupplier && (
        <Modal
          isOpen={!!viewingSupplier}
          title="📄 Detalles del Proveedor"
          onClose={() => setViewingSupplier(null)}
          width="550px"
        >
          <div style={{ 
            backgroundColor: '#f8f6f4',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid #e0d9d2',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
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
                  {viewingSupplier.nombre}
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
                    }}>🏷️</span>
                    <strong style={{ color: '#3B2E2A' }}>Tipo:</strong> {viewingSupplier.tipo}
                  </span>
                  
                  <span style={{ color: '#F4B73F' }}>•</span>
                  
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
                    }}>🆔</span>
                    <strong style={{ color: '#3B2E2A' }}>ID:</strong> {viewingSupplier.identificacion}
                  </span>
                </div>
              </div>
              
              {/* Estado - CAMBIADO: usa viewingSupplier.estado en lugar de viewingSupplier.status */}
              <div style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                backgroundColor: viewingSupplier.estado === 'activo' 
                  ? 'rgba(40, 167, 69, 0.1)' 
                  : 'rgba(220, 53, 69, 0.1)',
                border: viewingSupplier.estado === 'activo' 
                  ? '1px solid #28a745' 
                  : '1px solid #dc3545',
                color: viewingSupplier.estado === 'activo' ? '#28a745' : '#dc3545',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {viewingSupplier.estado === 'activo' ? '✅' : '❌'}
                </span>
                <span>
                  {viewingSupplier.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* NIT si es jurídica */}
            {viewingSupplier.tipo === 'Jurídica' && viewingSupplier.nit && (
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                marginBottom: '1rem',
                border: '1px solid #e0d9d2',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ 
                  color: '#F4B73F', 
                  fontSize: '1.1rem'
                }}>📋</span>
                <div>
                  <div style={{ 
                    color: '#3B2E2A', 
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.2rem'
                  }}>
                    NIT
                  </div>
                  <div style={{ 
                    color: '#3B2E2A', 
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    {viewingSupplier.nit}
                  </div>
                </div>
              </div>
            )}

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
                      {viewingSupplier.telefono || '—'}
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
                      {viewingSupplier.email || '—'}
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
                      {viewingSupplier.direccion || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Descripción si existe */}
            {viewingSupplier.descripcion && (
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
                  marginBottom: '0.8rem'
                }}>
                  <span style={{ 
                    color: '#F4B73F', 
                    fontSize: '1.4rem'
                  }}>📝</span>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    color: '#3B2E2A', 
                    margin: 0
                  }}>
                    Descripción
                  </h3>
                </div>
                <div style={{
                  padding: '0.8rem',
                  backgroundColor: '#fdfcf9',
                  borderRadius: '8px',
                  border: '1px solid #f0ece7',
                  color: '#555',
                  lineHeight: 1.5,
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingSupplier.descripcion}
                </div>
              </div>
            )}

            {/* Botón de Cerrar */}
            <div style={{ 
              textAlign: 'center',
              paddingTop: '1rem'
            }}>
              <button
                onClick={() => setViewingSupplier(null)}
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