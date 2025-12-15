export default function Alert({ type, message, onClose }) {
  const styles = {
    success: {
      backgroundColor: '#d4edda',
      borderColor: '#c3e6cb',
      color: '#155724',
    },
    error: {
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
      color: '#721c24',
    },
    warning: {
      backgroundColor: '#fff3cd',
      borderColor: '#ffeaa7',
      color: '#856404',
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        padding: '0.75rem 1.25rem',
        borderRadius: '8px',
        border: '1px solid',
        zIndex: 3000,
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        ...styles[type],
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}