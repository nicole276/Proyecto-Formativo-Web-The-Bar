import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

export default function SupplierForm({ supplier = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: supplier?.nombre || '',
    tipo: supplier?.tipo || 'Natural',
    tipo_documento: supplier?.tipo_documento || 'Cédula',
    identificacion: supplier?.identificacion || '',
    nit: supplier?.nit || '',
    telefono: supplier?.telefono || '',
    email: supplier?.email || '',
    direccion: supplier?.direccion || '',
    estado: supplier?.estado || 'activo',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre o razón social es obligatorio';
    if (!formData.tipo) newErrors.tipo = 'El tipo de persona es obligatorio';
    if (!formData.tipo_documento) newErrors.tipo_documento = 'El tipo de documento es obligatorio';
    if (!formData.identificacion.trim()) newErrors.identificacion = 'La identificación es obligatoria';
    if (formData.tipo === 'Jurídica' && !formData.nit.trim()) {
      newErrors.nit = 'El NIT es obligatorio para personas jurídicas';
    }
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
            {/* 1. Tipo de Persona */}
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
                Tipo de Persona *
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['Natural', 'Jurídica'].map((tipo) => (
                  <label
                    key={tipo}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: formData.tipo === tipo ? 'rgba(244, 183, 63, 0.1)' : 'white',
                      border: `1px solid ${formData.tipo === tipo ? '#F4B73F' : '#e0d9d2'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={tipo}
                      checked={formData.tipo === tipo}
                      onChange={handleChange}
                      style={{ accentColor: '#F4B73F' }}
                    />
                    {tipo === 'Natural' ? 'Natural' : 'Jurídica'}
                  </label>
                ))}
              </div>
              {errors.tipo && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.tipo}
                </p>
              )}
            </div>

            {/* 2. Tipo de Documento */}
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
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: errors.tipo_documento ? '1px solid #e53e3e' : '1px solid #e0d9d2',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                }}
              >
                <option value="Cédula">Cédula</option>
                <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
              {errors.tipo_documento && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.tipo_documento}
                </p>
              )}
            </div>

            {/* 3. Documento (identificación) */}
            <FormField
              label="Documento *"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              error={errors.identificacion}
            />

            {/* 4. Nombre / Razón Social */}
            <FormField
              label={`${formData.tipo === 'Jurídica' ? 'Razón Social' : 'Nombre Completo'} *`}
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={errors.nombre}
            />
          </div>

          <div>
            {/* 8. NIT (solo para Jurídica) — colocado aquí para mantener flujo visual limpio */}
            {formData.tipo === 'Jurídica' && (
              <FormField
                label="NIT *"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                error={errors.nit}
              />
            )}

            {/* 5. Teléfono */}
            <FormField
              label="Teléfono *"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={errors.telefono}
            />

            {/* 6. Email */}
            <FormField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* 7. Dirección */}
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
            {supplier ? 'Actualizar' : 'Registrar'}
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