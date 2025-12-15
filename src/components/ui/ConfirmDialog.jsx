export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = '✅ Confirmar',
  cancelText = '❌ Cancelar',
  confirmColor = '#28a745',
  cancelColor = '#dc3545',
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          textAlign: 'center',
          border: '1px solid #e0d9d2',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '2.5rem', color: '#D86633', marginBottom: '0.5rem' }}>
          {title.includes('Eliminar') ? '🗑️' : title.includes('estado') ? '🔄' : '⚠️'}
        </div>
        <h2 style={{ color: '#3B2E2A', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          {title}
        </h2>
        <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e0e0e0',
              color: '#666',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              flex: 1,
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: confirmColor,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              flex: 1,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}