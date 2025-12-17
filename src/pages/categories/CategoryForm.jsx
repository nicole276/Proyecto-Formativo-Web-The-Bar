import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';

export default function CategoryForm({ category = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    descripcion: category?.descripcion || '', // ✅ nuevo campo
    status: category?.status || 'activo',
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
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
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

    // ✅ Normalizamos: descripción vacía → null
    const payload = {
      name: formData.name.trim(),
      descripcion: formData.descripcion.trim() || null,
      status: formData.status,
    };

    onSave(payload);
  };

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {/* ✅ Fila: Nombre + Descripción (2 columnas) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem', marginBottom: '1.5rem' }}>
          <div>
            <FormField
              label="Nombre de la Categoría *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>

          <div>
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
                Descripción
                <span style={{ color: '#888', fontWeight: 'normal', marginLeft: '0.3rem' }}>
                  (opcional)
                </span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                rows="2"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e0d9d2',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        {/* ✅ Botones centrados */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.target.style.transform = 'none')}
          >
            {category ? 'Actualizar' : 'Registrar'}
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
              transition: 'transform 0.2s',
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}