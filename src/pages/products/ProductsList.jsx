import { useState } from 'react';
import ProductForm from './ProductForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';// Íconos de categorías
import WineBarIcon from '@mui/icons-material/WineBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import CakeIcon from '@mui/icons-material/Cake';

const categoryIcons = {
  Licores: WineBarIcon,
  Cigarrería: SmokingRoomsIcon,
  Confitería: CakeIcon,
};

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
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
      } else {
        setProducts([...products, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: 'Registro con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingProduct(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDelete = (product) => {
    if (product.estado === 'activo') {
      setAlert({
        type: 'error',
        message: `No se puede eliminar el producto "${product.nombre}" porque está activo.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }

    if (window.confirm(`¿Está seguro de eliminar el producto "${product.nombre}"?`)) {
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  const toggleStatus = (id) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, estado: p.estado === 'activo' ? 'inactivo' : 'activo' } : p
    ));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'todos' || p.categoria === categoryFilter;
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'activo' && p.estado === 'activo') ||
      (statusFilter === 'inactivo' && p.estado === 'inactivo');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderCategoryIcon = (categoria) => {
    const Icon = categoryIcons[categoria];
    return Icon ? <Icon sx={{ fontSize: '1.4rem', color: '#3B2E2A' }} /> : '❓';
  };

  // Conteo de productos con stock bajo y agotados
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div>
      {/* Alertas globales */}
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

      {/* Barra superior */}
      <div style={{ padding: '0.5rem 2rem 2rem'}}>
        <h1 style={{
          color: '#3B2E2A',
          fontSize: '1.8rem',
          fontWeight: '700',
          margin: '0',
          lineHeight: 2.2,
        }}>
          Productos
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
      </div>

      {/* Tabla */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
                <tr style={{ backgroundColor: '#f8f6f4' }}>
                    <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre</th>
                    <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Categoría</th>
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
                    <tr key={product.id} style={{ borderBottom: '1px solid #f0eee9', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                        {product.nombre}
                        </td>
                        <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                        {renderCategoryIcon(product.categoria)}
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
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
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
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
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
                    ))
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {viewingProduct && (
        <Modal
          isOpen={!!viewingProduct}
          title={`📄 Detalle del Producto: ${viewingProduct.nombre}`}
          onClose={() => setViewingProduct(null)}
        >
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f6f4', borderRadius: '12px' }}>
              <div style={{ fontSize: '2.5rem' }}>
                {renderCategoryIcon(viewingProduct.categoria)}
              </div>
              <div>
                <h2 style={{ color: '#3B2E2A', margin: 0 }}>{viewingProduct.nombre}</h2>
                <p style={{ margin: 0, color: '#666' }}>{viewingProduct.categoria}</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>💰</span> Precios
              </h3>
              <p><strong>Compra:</strong> ${viewingProduct.precio_compra.toLocaleString()}</p>
              <p><strong>Venta:</strong> ${viewingProduct.precio_venta.toLocaleString()}</p>
              <p><strong>Margen:</strong> ${viewingProduct.precio_venta - viewingProduct.precio_compra} ({Math.round(((viewingProduct.precio_venta - viewingProduct.precio_compra) / viewingProduct.precio_compra) * 100)}%)</p>
            </div>

            <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem' }}>
              <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📦</span> Inventario
              </h3>
              <p><strong>Stock actual:</strong> <span style={{ fontWeight: '700', fontSize: '1.2rem', color: '#3B2E2A' }}>{viewingProduct.stock}</span> unidades</p>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={() => setViewingProduct(null)}
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