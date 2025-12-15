// src/pages/purchases/PurchasesList.jsx
import { useState } from 'react';
import PurchaseForm from './PurchaseForm';
import PurchaseDetail from './PurchaseDetail';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import StatusDropdown from '../../components/ui/StatusDropdown'; // ✅ Filtros estilizados
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
      estado: 'Pendiente',
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

        {/* ✅ Filtro como dropdown estilizado */}
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
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'left', color: '#666', fontSize: '0.9rem', maxWidth: '200px', wordBreak: 'break-word' }}>
                      {purchase.productos.map((p, i) => (
                        <div key={i} style={{ marginBottom: '0.2rem' }}>
                          {p.nombre} x{p.cantidad}
                        </div>
                      ))}
                    </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                    {purchase.estado === 'Pendiente' ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <StatusDropdown
                          value="pendiente"
                          onChange={(newStatus) => {
                            if (newStatus === 'recibida') {
                              handleChangeStatus(purchase.id, 'Recibida');
                            }
                          }}
                          options={[
                            { value: 'recibida', label: '✅ Recibida' },
                          ]}
                          placeholder="Pendiente"
                        />
                      </div>
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
                      {purchase.estado === 'Pendiente' && (
                        <button
                          onClick={() => {
                            setEditingPurchase(purchase);
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
                        onClick={() => handleAnular(purchase)}
                        disabled={purchase.estado !== 'Pendiente'}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: purchase.estado === 'Pendiente' ? 'rgba(220, 53, 69, 0.1)' : '#f5f5f5',
                          color: purchase.estado === 'Pendiente' ? '#dc3545' : '#999',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: purchase.estado === 'Pendiente' ? 'pointer' : 'not-allowed',
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
          title={`📄 Detalle de Compra: ${viewingPurchase.factura}`}
          onClose={() => setViewingPurchase(null)}
        >
          <PurchaseDetail purchase={viewingPurchase} />
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