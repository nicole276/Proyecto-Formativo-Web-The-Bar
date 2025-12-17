export default function FormField({ label, name, value, onChange, error, type = 'text', children }) {
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          color: '#3B2E2A',
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </label>
      {children ? (
        children
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: error ? '1px solid #e53e3e' : '1px solid #e0e0e0',
            backgroundColor: 'white',
            color: '#3B2E2A',
            fontSize: '1rem',
          }}
        />
      )}
      {error && (
        <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.4rem' }}>{error}</p>
      )}
    </div>
  );
}