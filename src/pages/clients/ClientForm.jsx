import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

export default function ClientForm({ client = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: client?.nombre || '',
    tipoDocumento: client?.tipoDocumento || 'Cédula',
    documento: client?.documento || '',
    telefono: client?.telefono || '',
    email: client?.email || '',
    direccion: client?.direccion || '',
    estado: client?.estado || 'activo',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const tiposDocumento = [
    'Cédula',
    'Cédula de Extranjería',
    'Pasaporte',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre completo es obligatorio';
    if (!formData.tipoDocumento) newErrors.tipoDocumento = 'El tipo de documento es obligatorio';
    if (!formData.documento.trim()) newErrors.documento = 'El número de documento es obligatorio';
    if (formData.telefono && !/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlert({ type: 'warning', message: 'Por favor complete los campos obligatorios' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      onSave(formData);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
          <div>
            {/* 1. Tipo de Documento */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  color: '#3B2E2A',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
              >
                Tipo de Documento *
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: errors.tipoDocumento ? '1px solid #e53e3e' : '1px solid #e0d9d2',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                }}
              >
                {tiposDocumento.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipoDocumento && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.tipoDocumento}
                </p>
              )}
            </div>

            {/* 2. Número de Documento */}
            <FormField
              label="Número de Documento *"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              error={errors.documento}
            />

            {/* 3. Nombre Completo */}
            <FormField
              label="Nombre Completo *"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={errors.nombre}
            />
          </div>

          <div>
            {/* 4. Teléfono */}
            <FormField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={errors.telefono}
            />

            {/* 5. Email */}
            <FormField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* 6. Dirección */}
            <FormField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: '#F4B73F',
              color: '#3B2E2A',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(244, 183, 63, 0.25)',
            }}
          >
            {client ? 'Actualizar' : 'Registrar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: '#e0e0e0',
              color: '#666',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1.05rem',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}