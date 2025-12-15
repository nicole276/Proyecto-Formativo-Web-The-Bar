export default function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <label
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '48px',
        height: '24px',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: checked ? '#F4B73F' : '#ccc',
          borderRadius: '24px',
          transition: 'background-color 0.2s, transform 0.2s',
          border: '1px solid #e0d9d2',
        }}
      >
        <span
          style={{
            position: 'absolute',
            content: '""',
            height: '18px',
            width: '18px',
            left: checked ? '26px' : '3px',
            bottom: '2px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transition: 'left 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </span>
    </label>
  );
}