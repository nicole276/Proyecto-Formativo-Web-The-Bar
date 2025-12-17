import { useState } from 'react';
import ProductForm from './ProductForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function ProductsList() {
  const [products, setProducts] = useState([
    { id: 1, nombre: 'Ron Medellín', categoria: 'Licores', precio_compra: 40000, precio_venta: 55000, stock: 24, estado: 'activo' },
    { id: 2, nombre: 'Cigarrillos Marlboro', categoria: 'Cigarrería', precio_compra: 12000, precio_venta: 18000, stock: 8, estado: 'activo' },
    { id: 3, nombre: 'Galletas Festival', categoria: 'Confitería', precio_compra: 1500, precio_venta: 2500, stock: 0, estado: 'inactivo' },
    { id: 4, nombre: 'Cerveza Águila', categoria: 'Licores', precio_compra: 3000, precio_venta: 5000, stock: 3, estado: 'activo' },
  ]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingProduct) {
        setProducts(prev => 
          prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p)
        );
      } else {
        setProducts(prev => [...prev, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: '✅ Producto guardado con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingProduct(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: '❌ Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDelete = (product) => {
    if (product.estado === 'activo') {
      setAlert({
        type: 'error',
        message: `❌ No se puede eliminar "${product.nombre}" porque está activo.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }

    if (window.confirm(`¿Está seguro de eliminar "${product.nombre}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    }
  };

  const toggleStatus = (id) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, estado: p.estado === 'activo' ? 'inactivo' : 'activo' } : p
      )
    );
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'todos' || p.categoria === categoryFilter;
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'activo' && p.estado === 'activo') ||
      (statusFilter === 'inactivo' && p.estado === 'inactivo');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Conteos (sin cambios)
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
      {/* Alertas */}
      {lowStockCount > 0 && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          color: '#856404', 
          padding: '0.75rem 1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>⚠️</span>
          <strong>Atención:</strong> Hay {lowStockCount} producto(s) con stock bajo.
        </div>
      )}

      {outOfStockCount > 0 && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          color: '#721c24', 
          padding: '0.75rem 1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>❗</span>
          <strong>Importante:</strong> Hay {outOfStockCount} producto(s) agotado(s).
        </div>
      )}

      <h1 style={{
        color: '#3B2E2A',
        fontSize: '1.8rem',
        fontWeight: '700',
        margin: '0 0 1.5rem',
        lineHeight: 1.3,
      }}>
        Productos
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
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
            setEditingProduct(null);
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
          Registrar Producto
        </button>
      </div>

      {/* Tabla */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Categoría</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'right', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Venta</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Stock</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                    <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                      {product.nombre}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem', textAlign: 'left' }}>
                      {product.categoria}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right', color: '#666' }}>
                      ${product.precio_venta.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '600' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          backgroundColor: 
                            product.stock === 0 
                              ? 'rgba(229, 62, 62, 0.15)' 
                              : product.stock <= 10 
                              ? 'rgba(255, 193, 7, 0.15)' 
                              : 'rgba(40, 167, 69, 0.15)',
                          color: 
                            product.stock === 0 
                              ? '#e53e3e' 
                              : product.stock <= 10 
                              ? '#856404' 
                              : '#28a745',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                        }}
                      >
                        {product.stock === 0 ? '❌ Agotado' : product.stock}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            backgroundColor: product.estado === 'activo' ? 'rgba(244, 183, 63, 0.15)' : 'rgba(216, 102, 51, 0.1)',
                            color: product.estado === 'activo' ? '#F4B73F' : '#D86633',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                          }}
                        >
                          {product.estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                        </span>
                        <ToggleSwitch
                          checked={product.estado === 'activo'}
                          onChange={() => toggleStatus(product.id)}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setViewingProduct(product)}
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
                            setEditingProduct(product);
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
                          onClick={() => handleDelete(product)}
                          disabled={product.estado === 'activo'}
                          title={product.estado === 'activo' ? 'No se puede eliminar un producto activo' : ''}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: product.estado === 'activo' ? '#f5f5f5' : '#ffe8e8',
                            color: product.estado === 'activo' ? '#999' : '#e53e3e',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: product.estado === 'activo' ? 'not-allowed' : 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalle — sin íconos */}
      {viewingProduct && (
        <Modal
          isOpen={!!viewingProduct}
          title="📄 Detalles del Producto"
          onClose={() => setViewingProduct(null)}
          width="600px"
        >
          <div style={{ padding: '0.5rem' }}>
            {/* Encabezado principal */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#000', 
                margin: '0 0 0.5rem 0',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                Detalles del Producto
              </h1>
              
              {/* Nombre del producto con estado */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                padding: '0.5rem 0'
              }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: 'bold', 
                    color: '#000', 
                    margin: '0 0 0.3rem 0'
                  }}>
                    {viewingProduct.nombre}
                  </h2>
                  
                  {/* Categoría */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.25rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      <strong style={{ color: '#3B2E2A' }}>Categoría:</strong> {viewingProduct.categoria}
                    </span>
                  </div>
                </div>
                
                {/* Estado del producto (checkbox rojo/verde) */}
                <div style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                backgroundColor: viewingProduct.status === 'activo' 
                  ? 'rgba(40, 167, 69, 0.1)' 
                  : 'rgba(220, 53, 69, 0.1)',
                border: viewingProduct.status === 'activo' 
                  ? '1px solid #28a745' 
                  : '1px solid #dc3545',
                color: viewingProduct.status === 'activo' ? '#28a745' : '#dc3545',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {viewingProduct.status === 'activo' ? '✅' : '❌'}
                </span>
                <span>
                  {viewingProduct.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              </div>
            </div>

            {/* Sección de Descripción */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#3B2E2A', 
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.1rem' }}>📝</span>
                <span>Descripción</span>
              </h3>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: '#475569', 
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  fontStyle: viewingProduct.descripcion ? 'normal' : 'italic'
                }}>
                  {viewingProduct.descripcion || 'Dulces, chocolates, galletas y snacks colombianos e importados.'}
                </p>
              </div>
            </div>

            {/* Sección de Precios e Inventario en grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1.25rem'
            }}>
              {/* Precios */}
              <div style={{ 
                backgroundColor: '#fefce8',
                borderRadius: '10px',
                padding: '1rem',
                border: '2px solid #fde047'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ 
                    fontSize: '1.3rem',
                    color: '#ca8a04'
                  }}>💰</span>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    color: '#713f12',
                    margin: 0
                  }}>
                    Precios
                  </h3>
                </div>
                
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.4rem',
                    borderBottom: '1px solid #fde047'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#57534e',
                      fontSize: '0.9rem'
                    }}>Compra:</span>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: '#854d0e',
                      fontSize: '1.05rem'
                    }}>
                      ${viewingProduct.precio_compra?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.4rem',
                    borderBottom: '1px solid #fde047'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#57534e',
                      fontSize: '0.9rem'
                    }}>Venta:</span>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: '#854d0e',
                      fontSize: '1.05rem'
                    }}>
                      ${viewingProduct.precio_venta?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.4rem'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#57534e',
                      fontSize: '0.9rem'
                    }}>Margen:</span>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: '#16a34a',
                      fontSize: '1.05rem',
                      backgroundColor: '#f0fdf4',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #bbf7d0'
                    }}>
                      {viewingProduct.precio_compra > 0
                        ? `${Math.round(((viewingProduct.precio_venta - viewingProduct.precio_compra) / viewingProduct.precio_compra) * 100)}%`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inventario */}
              <div style={{ 
                backgroundColor: '#f0f9ff',
                borderRadius: '10px',
                padding: '1rem',
                border: '2px solid #7dd3fc'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ 
                    fontSize: '1.3rem',
                    color: '#0369a1'
                  }}>📦</span>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    color: '#0c4a6e',
                    margin: 0
                  }}>
                    Inventario
                  </h3>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  <div style={{ 
                    fontSize: '2.2rem', 
                    fontWeight: '800', 
                    color: '#1e40af',
                    marginBottom: '0.25rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {viewingProduct.stock || 0}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#475569',
                    fontWeight: '600',
                    backgroundColor: '#fff',
                    padding: '0.3rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    unidades disponibles
                  </div>
                </div>
              </div>
            </div>

            {/* Línea divisoria */}
            <div style={{ 
              height: '1px', 
              backgroundColor: '#e5e7eb', 
              margin: '1rem 0',
              width: '100%'
            }}></div>
            
            {/* Botón de Cerrar */}
            <div style={{ 
              textAlign: 'center',
              paddingTop: '0.5rem'
            }}>
              <button
                onClick={() => setViewingProduct(null)}
                style={{
                  padding: '0.75rem 2.5rem',
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
                  maxWidth: '180px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d241f';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 46, 42, 0.25)';
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

      {/* Modal de formulario */}
      {showForm && (
        <Modal
          isOpen={showForm}
          title={editingProduct ? '✏️ Editar Producto' : '✅ Registrar Producto'}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        >
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </Modal>
      )}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}