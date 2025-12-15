import { useState, useRef, useEffect } from 'react';

export default function StatusDropdown({ value, onChange, options, placeholder = '.todos' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getOptionStyle = (optValue) => {
    const isSelected = value === optValue;
    const isActive = optValue === 'activo' || optValue === 'completado' || optValue === 'realizado';
    const isPendiente = optValue === 'pendiente';
    const isInactive = optValue === 'inactivo' || optValue === 'anulada';

    let bgColor = 'white';
    let color = '#666';
    let borderColor = '#e0d9d2';

    if (isSelected) {
      if (isActive) bgColor = 'rgba(244, 183, 63, 0.2)';
      else if (isPendiente) bgColor = 'rgba(255, 193, 7, 0.2)';
      else if (isInactive) bgColor = 'rgba(216, 102, 51, 0.2)';
      else bgColor = '#e0e0e0';

      color = isActive ? '#F4B73F' : isPendiente ? '#856404' : isInactive ? '#D86633' : '#3B2E2A';
      borderColor = isActive ? '#F4B73F' : isPendiente ? '#FFC107' : isInactive ? '#D86633' : '#999';
    }

    return {
      padding: '0.5rem 1rem',
      backgroundColor: bgColor,
      color: color,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: isSelected ? '600' : 'normal',
      fontSize: '0.9rem',
    };
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        minWidth: '140px',
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={getOptionStyle(value || 'todos')}
      >
        {options.find(opt => opt.value === (value || 'todos'))?.label || placeholder}
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>▼</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #e0d9d2',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            marginTop: '0.3rem',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                ...getOptionStyle(opt.value),
                borderRadius: '0',
                borderBottom: '1px solid #f0eee9',
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}