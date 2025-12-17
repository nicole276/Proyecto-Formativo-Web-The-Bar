// src/pages/sales/SalesList.jsx
import { useState } from 'react';
import SaleForm from './SaleForm';
import SaleDetail from './SaleDetail';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import StatusDropdown from '../../components/ui/StatusDropdown'; 
import ConfirmDialog from '../../components/ui/ConfirmDialog';

// Datos simulados
const clients = [
  { id: 1, nombre: 'Carlos Mendoza' },
  { id: 2, nombre: 'Ana López' },
];

const products = [
  { id: 1, nombre: 'Ron Medellín', categoria: 'Licores', stock: 10 },
  { id: 2, nombre: 'Cerveza Águila', categoria: 'Licores', stock: 5 },
];

export default function SalesList() {
  const [sales, setSales] = useState([
    {
      id: 1,
      fecha: '2025-12-13',
      clienteId: 1,
      clienteNombre: 'Carlos Mendoza',
      productos: [
        { productoId: 1, nombre: 'Ron Medellín', cantidad: 2, precio: 55000, descuento: 0, subtotal: 110000 },
      ],
      total: 110000,
      estado: 'Completada',
    },
    {
      id: 2,
      fecha: '2025-12-14',
      clienteId: 2,
      clienteNombre: 'Ana López',
      productos: [
        { productoId: 2, nombre: 'Cerveza Águila', cantidad: 1, precio: 5000, descuento: 0, subtotal: 5000 },
      ],
      total: 5000,
      estado: 'Completada',
    },
    {
      id: 3,
      fecha: '2025-12-15',
      clienteId: 1,
      clienteNombre: 'Carlos Mendoza',
      productos: [
        { productoId: 1, nombre: 'Ron Medellín', cantidad: 1, precio: 55000, descuento: 10, subtotal: 49500 },
        { productoId: 2, nombre: 'Cerveza Águila', cantidad: 2, precio: 5000, descuento: 5, subtotal: 9500 },
      ],
      total: 59000,
      estado: 'Completada',
    },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [viewingSale, setViewingSale] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showAnularDialog, setShowAnularDialog] = useState(false);
  const [saleToAnular, setSaleToAnular] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingSale) {
        setSales(sales.map(s => s.id === editingSale.id ? { ...s, ...data } : s));
      } else {
        setSales([...sales, { id: Date.now(), ...data, fecha: new Date().toISOString().split('T')[0] }]);
      }
      setAlert({ type: 'success', message: 'Venta registrada con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingSale(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleAnularConfirm = () => {
    if (saleToAnular) {
      setSales(sales.map(s =>
        s.id === saleToAnular.id ? { ...s, estado: 'Anulada' } : s
      ));
      setAlert({ type: 'success', message: `Venta anulada correctamente` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowAnularDialog(false);
    setSaleToAnular(null);
  };

  const handleAnular = (sale) => {
    if (sale.estado !== 'Pendiente' && sale.estado !== 'Completada') return;
    setSaleToAnular(sale);
    setShowAnularDialog(true);
  };

  const handleChangeStatus = (saleId, newStatus) => {
    setSales(sales.map(s =>
      s.id === saleId ? { ...s, estado: newStatus } : s
    ));
    setAlert({ type: 'success', message: `Estado actualizado a ${newStatus}` });
    setTimeout(() => setAlert(null), 2000);
  };

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.clienteNombre.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'pendiente' && s.estado === 'Pendiente') ||
      (statusFilter === 'completada' && s.estado === 'Completada') ||
      (statusFilter === 'anulada' && s.estado === 'Anulada');
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
      <h1 style={{ color: '#3B2E2A', fontSize: '1.8rem', fontWeight: '700', margin: '0 0 1rem 0' }}>
        Ventas
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por cliente..."
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

        {/* ✅ Filtro como dropdown estilizado */}
        <StatusDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'todos', label: 'Todos' },,
            { value: 'completada', label: '✅ Completada' },
            { value: 'anulada', label: '❌ Anulada' },
          ]}
        />

        <button
          onClick={() => {
            setEditingSale(null);
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
          Registrar Venta
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Fecha</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Cliente</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'right', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Total</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem' }}>
                    {new Date(sale.fecha).toLocaleDateString('es-CO')}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                    {sale.clienteNombre}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'right', color: '#3B2E2A', fontWeight: '700' }}>
                    ${sale.total.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    {sale.estado === 'Pendiente' ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <StatusDropdown
                          value="pendiente"
                          onChange={(newStatus) => {
                            if (newStatus === 'completada') {
                              handleChangeStatus(sale.id, 'Completada');
                            }
                          }}
                          options={[
                            { value: 'completada', label: '✅ Completada' },
                          ]}
                          placeholder="⏳ Pendiente"
                        />
                      </div>
                    ) : sale.estado === 'Completada' ? (
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
                        ✅ Completada
                      </span>
                    ) : sale.estado === 'Anulada' ? (
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
                    ) : (
                      <span
                        style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '20px',
                          backgroundColor: 'rgba(108, 117, 125, 0.15)',
                          color: '#6c757d',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          border: '1px solid #6c757d',
                        }}
                      >
                        {sale.estado}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setViewingSale(sale)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#e8f4ff',
                          color: '#007bff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d0e7ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e8f4ff'}
                      >
                        👁️
                      </button>
                      {sale.estado === 'Pendiente' && (
                        <button
                          onClick={() => {
                            setEditingSale(sale);
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
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffeaa7'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff3cd'}
                        >
                          ✏️
                        </button>
                      )}
                      {(sale.estado === 'Pendiente' || sale.estado === 'Completada') && (
                        <button
                          onClick={() => handleAnular(sale)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            color: '#dc3545',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)'}
                        >
                          <BlockRoundedIcon sx={{ fontSize: '1.1rem' }} />
                        </button>
                      )}
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
        title="¿Anular Venta?"
        message={`¿Está seguro de anular esta venta? Esta acción no se puede deshacer.`}
        onConfirm={handleAnularConfirm}
        onCancel={() => {
          setShowAnularDialog(false);
          setSaleToAnular(null);
        }}
        confirmText="✅ Sí, anular"
        cancelText="❌ Cancelar"
        confirmColor="#dc3545"
        cancelColor="#6c757d"
      />

      {/* Modales */}
      {viewingSale && (
        <Modal
          isOpen={!!viewingSale}
          title="📄 Detalles de la Venta"
          onClose={() => setViewingSale(null)}
          width="600px"
        >
          <div style={{ padding: '0.5rem' }}>
            <div>
              {/* Factura y estado */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                padding: '0.3rem 0'
              }}>
                <div style={{ flex: 1 }}>
                  {/* Cliente y fecha */}
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
                      <strong style={{ color: '#3B2E2A' }}>Cliente:</strong> {viewingSale.clienteNombre || viewingSale.cliente}
                    </span>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      <strong style={{ color: '#3B2E2A' }}>Fecha:</strong> {new Date(viewingSale.fecha).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>
                
                {/* Estado de la venta */}
                <div style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  backgroundColor: viewingSale.estado === 'Completada' 
                    ? 'rgba(40, 167, 69, 0.1)' 
                    : viewingSale.estado === 'Pendiente'
                    ? 'rgba(255, 193, 7, 0.1)'
                    : 'rgba(220, 53, 69, 0.1)',
                  border: viewingSale.estado === 'Completada' 
                    ? '1px solid #28a745' 
                    : viewingSale.estado === 'Pendiente'
                    ? '1px solid #bb861eff'
                    : '1px solid #dc3545',
                  color: viewingSale.estado === 'Completada' 
                    ? '#28a745' 
                    : viewingSale.estado === 'Pendiente'
                    ? '#bb861eff'
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
                    {viewingSale.estado === 'Completada' ? '✅' : 
                    viewingSale.estado === 'Pendiente' ? '⏳' : '❌'}
                  </span>
                  <span>
                    {viewingSale.estado === 'Completada' ? 'Completada' : 
                    viewingSale.estado === 'Pendiente' ? 'Pendiente' : 'Anulada'}
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
                <span>Productos ({viewingSale.productos?.length || 0})</span>
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
                      {viewingSale.productos?.map((producto, index) => (
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
                            ${producto.precio?.toLocaleString() || '0'}
                          </td>
                          <td style={{ 
                            padding: '0.6rem', 
                            textAlign: 'right', 
                            color: '#3B2E2A',
                            fontWeight: '700',
                            fontSize: '0.85rem'
                          }}>
                            ${producto.subtotal?.toLocaleString() || '0'}
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="4" style={{ 
                            padding: '1rem', 
                            textAlign: 'center', 
                            color: '#666',
                            fontStyle: 'italic'
                          }}>
                            No hay productos en esta venta
                          </td>
                        </tr>
                      )}
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

            {/* Total de la venta */}
            <div style={{ 
              marginBottom: '1.2rem'
            }}>
              <div style={{
                padding: '0.9rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '2px solid #7dd3fc'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontWeight: '700', 
                    color: '#0369a1',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>💰</span>
                    <span>TOTAL DE LA VENTA</span>
                  </span>
                  <span style={{ 
                    fontWeight: '800', 
                    fontSize: '1.5rem', 
                    color: '#0369a1',
                    backgroundColor: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '2px solid #38bdf8',
                    boxShadow: '0 2px 4px rgba(3, 105, 161, 0.1)'
                  }}>
                    ${viewingSale.total?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón de Cerrar */}
            <div style={{ 
              textAlign: 'center',
              paddingTop: '0.5rem'
            }}>
              <button
                onClick={() => setViewingSale(null)}
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
          title={editingSale ? '✏️ Editar Venta' : '✅ Registrar Nueva Venta'}
          onClose={() => {
            setShowForm(false);
            setEditingSale(null);
          }}
        >
          <SaleForm
            sale={editingSale}
            clients={clients}
            products={products}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingSale(null);
            }}
          />
        </Modal>
      )}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}