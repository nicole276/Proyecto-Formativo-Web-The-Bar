import { useState } from 'react';
import PurchaseForm from './PurchaseForm';
import PurchaseDetail from './PurchaseDetail';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import StatusDropdown from '../../components/ui/StatusDropdown';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

// Datos simulados
const suppliers = [
  { id: 1, nombre: 'Distribuidora Andina' },
  { id: 2, nombre: 'Importadora Caribe' },
];

const products = [
  { id: 1, nombre: 'Ron Medellín', categoria: 'Licores' },
  { id: 2, nombre: 'Cerveza Águila', categoria: 'Licores' },
];

export default function PurchasesList() {
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      fecha: '2025-12-10',
      proveedorId: 1,
      proveedorNombre: 'Distribuidora Andina',
      factura: 'FAC-001',
      productos: [
        { productoId: 1, nombre: 'Ron Medellín', cantidad: 12, precio: 40000, subtotal: 480000 },
      ],
      total: 480000,
      estado: 'Recibida',
    },
    {
      id: 2,
      fecha: '2025-12-12',
      proveedorId: 2,
      proveedorNombre: 'Importadora Caribe',
      factura: 'FAC-002',
      productos: [
        { productoId: 2, nombre: 'Cerveza Águila', cantidad: 10, precio: 12000, subtotal: 120000 },
      ],
      total: 120000,
      estado: 'Recibida',
    },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [viewingPurchase, setViewingPurchase] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showAnularDialog, setShowAnularDialog] = useState(false);
  const [purchaseToAnular, setPurchaseToAnular] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingPurchase) {
        setPurchases(purchases.map(p => p.id === editingPurchase.id ? { ...p, ...data } : p));
      } else {
        setPurchases([...purchases, { id: Date.now(), ...data, fecha: new Date().toISOString().split('T')[0] }]);
      }
      setAlert({ type: 'success', message: 'Compra registrada con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingPurchase(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleAnularConfirm = () => {
    if (purchaseToAnular) {
      setPurchases(purchases.map(p =>
        p.id === purchaseToAnular.id ? { ...p, estado: 'Anulada' } : p
      ));
      setAlert({ type: 'success', message: `Compra "${purchaseToAnular.factura}" anulada` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowAnularDialog(false);
    setPurchaseToAnular(null);
  };

  const handleAnular = (purchase) => {
    if (purchase.estado !== 'Pendiente') {
      setAlert({
        type: 'error',
        message: `No se puede anular la compra "${purchase.factura}" porque ya fue ${purchase.estado}.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setPurchaseToAnular(purchase);
    setShowAnularDialog(true);
  };

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.factura.toLowerCase().includes(search.toLowerCase()) ||
                          p.proveedorNombre.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'pendiente' && p.estado === 'Pendiente') ||
      (statusFilter === 'recibida' && p.estado === 'Recibida') ||
      (statusFilter === 'anulada' && p.estado === 'Anulada');
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
      <h1 style={{ color: '#3B2E2A', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 1rem 0' }}>
        Compras
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por factura o proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              border: '1px solid #e0d9d2',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <StatusDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'pendiente', label: '⏳ Pendiente' },
            { value: 'recibida', label: '✅ Recibida' },
            { value: 'anulada', label: '❌ Anulada' },
          ]}
        />

        <button
          onClick={() => {
            setEditingPurchase(null);
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
          Registrar Compra
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Fecha</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Proveedor</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Factura</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'right', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Total</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                    {new Date(purchase.fecha).toLocaleDateString('es-CO')}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                    {purchase.proveedorNombre}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontWeight: '600' }}>
                    {purchase.factura}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'right', color: '#3B2E2A', fontWeight: '700' }}>
                    ${purchase.total.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    {purchase.estado === 'Pendiente' ? (
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(244, 183, 63, 0.15)',
                          color: '#F4B73F',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          border: '1px solid #F4B73F',
                        }}
                      >
                        ⏳ Pendiente
                      </span>
                    ) : purchase.estado === 'Recibida' ? (
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(40, 167, 69, 0.15)',
                          color: '#28a745',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          border: '1px solid #28a745',
                        }}
                      >
                        ✅ Recibida
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(220, 53, 69, 0.15)',
                          color: '#dc3545',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          border: '1px solid #dc3545',
                        }}
                      >
                        ❌ Anulada
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setViewingPurchase(purchase)}
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
                      {purchase.estado === 'Pendiente' && (
                        <button
                          onClick={() => {
                            setEditingPurchase(purchase);
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
                        onClick={() => handleAnular(purchase)}
                        disabled={purchase.estado !== 'Pendiente'}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: purchase.estado === 'Pendiente' ? '#ffe8e8' : '#f5f5f5',
                          color: purchase.estado === 'Pendiente' ? '#e53e3e' : '#999',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: purchase.estado === 'Pendiente' ? 'pointer' : 'not-allowed',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <BlockRoundedIcon sx={{ fontSize: '1.1rem', color: '#dc3545' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal de ANULAR */}
      <ConfirmDialog
        isOpen={showAnularDialog}
        title="¿Anular Compra?"
        message={`¿Está seguro de anular la compra "${purchaseToAnular?.factura}"? Esta acción no se puede deshacer.`}
        onConfirm={handleAnularConfirm}
        onCancel={() => {
          setShowAnularDialog(false);
          setPurchaseToAnular(null);
        }}
        confirmText="✅ Sí, anular"
        cancelText="❌ Cancelar"
        confirmColor="#dc3545"
        cancelColor="#6c757d"
      />

      {/* Modales */}
      {viewingPurchase && (
        <Modal
          isOpen={!!viewingPurchase}
          title="📄 Detalles de la Compra"
          onClose={() => setViewingPurchase(null)}
          width="600px"
        >
          <div style={{ padding: '0.5rem' }}>
            {/* Encabezado principal */}
            <div style={{ marginBottom: '1rem' }}>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#000', 
                margin: '0 0 0.5rem 0',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                Detalles de la Compra
              </h1>
              
              {/* Factura y estado */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                padding: '0.3rem 0'
              }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: 'bold', 
                    color: '#000', 
                    margin: '0 0 0.2rem 0'
                  }}>
                    {viewingPurchase.factura}
                  </h2>
                  
                  {/* Proveedor y fecha */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '0.2rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      <strong style={{ color: '#3B2E2A' }}>Proveedor:</strong> {viewingPurchase.proveedorNombre}
                    </span>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      <strong style={{ color: '#3B2E2A' }}>Fecha:</strong> {new Date(viewingPurchase.fecha).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>
                
                {/* Estado de la compra - Misma posición que productos/proveedores */}
                <div style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  backgroundColor: viewingPurchase.estado === 'Recibida' 
                    ? 'rgba(40, 167, 69, 0.1)' 
                    : viewingPurchase.estado === 'Pendiente'
                    ? 'rgba(255, 193, 7, 0.1)'
                    : 'rgba(220, 53, 69, 0.1)',
                  border: viewingPurchase.estado === 'Recibida' 
                    ? '1px solid #28a745' 
                    : viewingPurchase.estado === 'Pendiente'
                    ? '1px solid #ffc107'
                    : '1px solid #dc3545',
                  color: viewingPurchase.estado === 'Recibida' 
                    ? '#28a745' 
                    : viewingPurchase.estado === 'Pendiente'
                    ? '#ffc107'
                    : '#dc3545',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    {viewingPurchase.estado === 'Recibida' ? '✅' : 
                    viewingPurchase.estado === 'Pendiente' ? '⏳' : '❌'}
                  </span>
                  <span>
                    {viewingPurchase.estado === 'Recibida' ? 'Recibida' : 
                    viewingPurchase.estado === 'Pendiente' ? 'Pendiente' : 'Anulada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de Productos */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: '#3B2E2A', 
                margin: '0 0 0.5rem 0',
                paddingLeft: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <span>📦</span>
                <span>Productos ({viewingPurchase.productos.length})</span>
              </h3>
              <div style={{
                padding: '0.9rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  overflowX: 'auto',
                  maxHeight: '250px',
                  overflowY: 'auto'
                }}>
                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    minWidth: '400px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <th style={{ 
                          padding: '0.6rem', 
                          textAlign: 'left', 
                          fontWeight: '600', 
                          color: '#3B2E2A', 
                          borderBottom: '2px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}>Producto</th>
                        <th style={{ 
                          padding: '0.6rem', 
                          textAlign: 'center', 
                          fontWeight: '600', 
                          color: '#3B2E2A', 
                          borderBottom: '2px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}>Cantidad</th>
                        <th style={{ 
                          padding: '0.6rem', 
                          textAlign: 'right', 
                          fontWeight: '600', 
                          color: '#3B2E2A', 
                          borderBottom: '2px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}>Precio</th>
                        <th style={{ 
                          padding: '0.6rem', 
                          textAlign: 'right', 
                          fontWeight: '600', 
                          color: '#3B2E2A', 
                          borderBottom: '2px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingPurchase.productos.map((producto, index) => (
                        <tr key={index} style={{ 
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc'
                        }}>
                          <td style={{ 
                            padding: '0.6rem', 
                            color: '#3B2E2A', 
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}>
                            {producto.nombre}
                          </td>
                          <td style={{ 
                            padding: '0.6rem', 
                            textAlign: 'center', 
                            color: '#666',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}>
                            {producto.cantidad}
                          </td>
                          <td style={{ 
                            padding: '0.6rem', 
                            textAlign: 'right', 
                            color: '#666',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}>
                            ${producto.precio.toLocaleString()}
                          </td>
                          <td style={{ 
                            padding: '0.6rem', 
                            textAlign: 'right', 
                            color: '#3B2E2A',
                            fontWeight: '700',
                            fontSize: '0.85rem'
                          }}>
                            ${producto.subtotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Línea divisoria */}
            <div style={{ 
              height: '1px', 
              backgroundColor: '#e5e7eb', 
              margin: '0.8rem 0',
              width: '100%'
            }}></div>

            {/* Total de la compra */}
            <div style={{ 
              marginBottom: '1.2rem'
            }}>
              <div style={{
                padding: '0.9rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '2px solid #bbf7d0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontWeight: '700', 
                    color: '#166534',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>💰</span>
                    <span>TOTAL DE LA COMPRA</span>
                  </span>
                  <span style={{ 
                    fontWeight: '800', 
                    fontSize: '1.5rem', 
                    color: '#166534',
                    backgroundColor: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '2px solid #86efac',
                    boxShadow: '0 2px 4px rgba(22, 101, 52, 0.1)'
                  }}>
                    ${viewingPurchase.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de Fechas (si existen) */}
            {(viewingPurchase.fecha_creacion || viewingPurchase.fecha_actualizacion) && (
              <>
                <div style={{ 
                  height: '1px', 
                  backgroundColor: '#e5e7eb', 
                  margin: '0.8rem 0',
                  width: '100%'
                }}></div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '0.8rem',
                  marginBottom: '1.5rem'
                }}>
                  {viewingPurchase.fecha_creacion && (
                    <div>
                      <h4 style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#3B2E2A', 
                        margin: '0 0 0.4rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>📅</span>
                        <span>Creado</span>
                      </h4>
                      <div style={{ 
                        color: '#4b5563',
                        fontSize: '0.85rem',
                        padding: '0.6rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>
                        {viewingPurchase.fecha_creacion}
                      </div>
                    </div>
                  )}
                  
                  {viewingPurchase.fecha_actualizacion && (
                    <div>
                      <h4 style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#3B2E2A', 
                        margin: '0 0 0.4rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>🔄</span>
                        <span>Actualizado</span>
                      </h4>
                      <div style={{ 
                        color: '#4b5563',
                        fontSize: '0.85rem',
                        padding: '0.6rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontWeight: '500',
                        textAlign: 'center'
                      }}>
                        {viewingPurchase.fecha_actualizacion}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Botón de Cerrar */}
            <div style={{ 
              textAlign: 'center',
              paddingTop: '0.5rem'
            }}>
              <button
                onClick={() => setViewingPurchase(null)}
                style={{
                  padding: '0.6rem 2rem',
                  backgroundColor: '#3B2E2A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(59, 46, 42, 0.2)',
                  width: '100%',
                  maxWidth: '150px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d241f';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 3px 6px rgba(59, 46, 42, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B2E2A';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 46, 42, 0.2)';
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
          title={editingPurchase ? '✏️ Editar Compra' : '✅ Registrar Compra'}
          onClose={() => {
            setShowForm(false);
            setEditingPurchase(null);
          }}
        >
          <PurchaseForm
            purchase={editingPurchase}
            suppliers={suppliers}
            products={products}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingPurchase(null);
            }}
          />
        </Modal>
      )}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}