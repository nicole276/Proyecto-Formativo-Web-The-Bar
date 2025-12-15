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
      factura: 'VEN-001',
      productos: [
        { productoId: 1, nombre: 'Ron Medellín', cantidad: 2, precio: 55000, descuento: 0, subtotal: 110000 },
      ],
      total: 110000,
      estado: 'Finalizada',
    },
    {
      id: 2,
      fecha: '2025-12-14',
      clienteId: 2,
      clienteNombre: 'Ana López',
      factura: 'VEN-002',
      productos: [
        { productoId: 2, nombre: 'Cerveza Águila', cantidad: 1, precio: 5000, descuento: 0, subtotal: 5000 },
      ],
      total: 5000,
      estado: 'Pendiente',
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
      setAlert({ type: 'success', message: `Venta "${saleToAnular.factura}" anulada` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowAnularDialog(false);
    setSaleToAnular(null);
  };

  const handleAnular = (sale) => {
    if (sale.estado !== 'Pendiente') return;
    setSaleToAnular(sale);
    setShowAnularDialog(true);
  };

  const handleProductChange = (index, field, value) => {
  const nuevosProductos = [...formData.productos];
  
    if (field === 'productoId') {
      // ✅ productoId como string
      const prod = products.find(p => String(p.id) === value);
      nuevosProductos[index] = { 
        ...nuevosProductos[index], 
        productoId: value,
        nombre: prod?.nombre || '',
        stock: prod?.stock || 0,
      };
    } 
    else if (field === 'cantidad' || field === 'precio' || field === 'descuento') {
      // ✅ Conversión segura a número (o string vacío)
      const numValue = value === '' ? '' : Number(value);
      nuevosProductos[index] = { 
        ...nuevosProductos[index], 
        [field]: numValue,
      };
    } 
    else {
      nuevosProductos[index] = { ...nuevosProductos[index], [field]: value };
    }

    setFormData({ ...formData, productos: nuevosProductos });
  };

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.factura.toLowerCase().includes(search.toLowerCase()) ||
                          s.clienteNombre.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'pendiente' && s.estado === 'Pendiente') ||
      (statusFilter === 'finalizada' && s.estado === 'Finalizada') ||
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
            placeholder="🔍 Buscar por factura o cliente..."
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
            { value: 'todos', label: 'Todos' },
            { value: 'pendiente', label: '⏳ Pendiente' },
            { value: 'finalizada', label: '✅ Finalizada' },
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Fecha</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Cliente</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Factura</th>
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
                  <td style={{ padding: '1rem 1.2rem', color: '#666', fontWeight: '600' }}>
                    {sale.factura}
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
                            if (newStatus === 'finalizada') {
                              handleChangeStatus(sale.id, 'Finalizada');
                            }
                          }}
                          options={[
                            { value: 'finalizada', label: '✅ Finalizada' },
                          ]}
                          placeholder="Pendiente"
                        />
                      </div>
                    ) : sale.estado === 'Finalizada' ? (
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
                        ✅ Finalizada
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
                        onClick={() => setViewingSale(sale)}
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
                          }}
                        >
                          ✏️ 
                        </button>
                      )}
                      <button
                        onClick={() => handleAnular(sale)}
                        disabled={sale.estado !== 'Pendiente'}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: sale.estado === 'Pendiente' ? 'rgba(220, 53, 69, 0.1)' : '#f5f5f5',
                          color: sale.estado === 'Pendiente' ? '#dc3545' : '#999',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: sale.estado === 'Pendiente' ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
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
        title="¿Anular Venta?"
        message={`¿Está seguro de anular la venta "${saleToAnular?.factura}"? Esta acción no se puede deshacer.`}
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
          title={`📄 Detalle de Venta: ${viewingSale.factura}`}
          onClose={() => setViewingSale(null)}
        >
          <SaleDetail sale={viewingSale} />
        </Modal>
      )}

      {showForm && (
        <Modal
          isOpen={showForm}
          title={editingSale ? '✏️ Editar Venta' : '✅ Registrar Venta'}
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