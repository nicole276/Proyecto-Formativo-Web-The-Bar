import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';

export default function RoleForm({ role = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '', // ✅ Nuevo campo
    status: role?.status || 'activo',
    modules: role?.modules || [],
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const modules = [
    'Dashboard',
    'Roles',
    'Usuarios',
    'Categorías',
    'Productos',
    'Proveedores',
    'Clientes',
    'Compras',
    'Ventas',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const newModules = checked
        ? [...formData.modules, value]
        : formData.modules.filter((m) => m !== value);
      setFormData({ ...formData, modules: newModules });
      if (errors.modules) setErrors({ ...errors, modules: '' });
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) setErrors({ ...errors, [name]: '' });
    }
  };

  const handleModuleToggle = (module) => {
    const newModules = formData.modules.includes(module)
      ? formData.modules.filter((m) => m !== module)
      : [...formData.modules, module];
    setFormData({ ...formData, modules: newModules });
    if (errors.modules) setErrors({ ...errors, modules: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (formData.modules.length === 0) newErrors.modules = 'Debe seleccionar al menos un módulo';
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

    // ✅ Incluye 'description' al guardar (puede ser vacía)
    onSave({
      ...formData,
      // Normalizar: eliminar espacios extremos, pero permitir null/vacío
      description: formData.description.trim() || null,
    });
  };

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {/* ✅ Grid de 2 columnas: Izquierda (Nombre + Descripción) / Derecha (Módulos) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
          {/* Columna 1: Nombre y Descripción */}
          <div>
            {/* Nombre */}
            <FormField
              label="Nombre del Rol *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            {/* Descripción ✅ */}
            <div style={{ marginTop: '1.8rem' }}>
              <label
                style={{
                  display: 'block',
                  color: '#3B2E2A',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.8rem',
                }}
              >
                Descripción
                <span style={{ color: '#888', fontWeight: 'normal', marginLeft: '0.3rem' }}>
                  (opcional)
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
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

          {/* Columna 2: Módulos */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  color: '#3B2E2A',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.8rem',
                }}
              >
                Permisos *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {modules.map((module) => (
                  <label
                    key={module}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: formData.modules.includes(module)
                        ? 'rgba(244, 183, 63, 0.1)'
                        : 'white',
                      border: `1px solid ${
                        formData.modules.includes(module) ? '#F4B73F' : '#e0d9d2'
                      }`,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      value={module}
                      checked={formData.modules.includes(module)}
                      onChange={() => handleModuleToggle(module)}
                      style={{ marginRight: '0.5rem', accentColor: '#F4B73F' }}
                    />
                    <span style={{ color: '#3B2E2A' }}>{module}</span>
                  </label>
                ))}
              </div>
              {errors.modules && (
                <p
                  style={{
                    color: '#e53e3e',
                    fontSize: '0.85rem',
                    marginTop: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  ⚠️ {errors.modules}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem',
            justifyContent: 'center',
          }}
        >
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
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.target.style.transform = 'none')}
          >
            Registar
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
              transition: 'all 0.2s',
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}