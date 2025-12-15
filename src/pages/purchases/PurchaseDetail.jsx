import { useState } from 'react';

export default function PurchaseDetail({ purchase }) {
  const [estado, setEstado] = useState(purchase.estado);

  const handleChangeStatus = (newStatus) => {
    if (purchase.estado !== 'Recibida') {
      setEstado(newStatus);
      // Aquí iría la llamada a la API para actualizar el estado
      console.log(`Estado cambiado a: ${newStatus}`);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Información General</h3>
        <p><strong>Proveedor:</strong> {purchase.proveedorNombre}</p>
        <p><strong>Factura:</strong> {purchase.factura}</p>
        <p><strong>Fecha:</strong> {new Date(purchase.fecha).toLocaleDateString('es-CO')}</p>
        <p><strong>Total:</strong> <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#3B2E2A' }}>${purchase.total.toLocaleString()}</span></p>
      </div>

      <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#3B2E2A', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Productos
          {purchase.estado === 'Pendiente' && (
            <div style={{ fontSize: '0.9rem' }}>
              <button
                onClick={() => handleChangeStatus('Recibida')}
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                ✅ Recibir Compra
              </button>
            </div>
          )}
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                <th style={{ padding: '0.6rem', textAlign: 'left', fontWeight: '600', color: '#3B2E2A' }}>Producto</th>
                <th style={{ padding: '0.6rem', textAlign: 'center', fontWeight: '600', color: '#3B2E2A' }}>Cantidad</th>
                <th style={{ padding: '0.6rem', textAlign: 'right', fontWeight: '600', color: '#3B2E2A' }}>Precio</th>
                <th style={{ padding: '0.6rem', textAlign: 'right', fontWeight: '600', color: '#3B2E2A' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {purchase.productos.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.6rem', color: '#3B2E2A' }}>{p.nombre}</td>
                  <td style={{ padding: '0.6rem', textAlign: 'center', color: '#666' }}>{p.cantidad}</td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', color: '#666' }}>${p.precio.toLocaleString()}</td>
                  <td style={{ padding: '0.6rem', textAlign: 'right', fontWeight: '600', color: '#3B2E2A' }}>${p.subtotal.toLocaleString()}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #333', fontWeight: '700' }}>
                <td colSpan="3" style={{ padding: '0.6rem', textAlign: 'right' }}>TOTAL:</td>
                <td style={{ padding: '0.6rem', textAlign: 'right', color: '#3B2E2A' }}>${purchase.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8f6f4', borderRadius: '12px', padding: '1.2rem' }}>
        <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Estado Actual</h3>
        <span
          style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            backgroundColor: 
              estado === 'Pendiente' ? 'rgba(255, 193, 7, 0.15)' :
              estado === 'Recibida' ? 'rgba(40, 167, 69, 0.15)' :
              'rgba(220, 53, 69, 0.15)',
            color: 
              estado === 'Pendiente' ? '#856404' :
              estado === 'Recibida' ? '#28a745' :
              '#dc3545',
            fontSize: '0.95rem',
            fontWeight: '600',
          }}
        >
          {estado}
        </span>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          onClick={() => {}}
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
  );
}