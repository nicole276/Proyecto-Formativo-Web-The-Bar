import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';

export default function UserForm({ user = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre_completo: user?.nombre_completo || '',
    email: user?.email || '',
    usuario: user?.usuario || '',
    contraseña: '',
    confirmar_contraseña: '',
    descripcion: user?.descripcion || '', // ✅ nuevo campo
    estado: user?.estado || 'activo',
    rol: user?.rol || 'Vendedor',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const roles = ['Administrador', 'Vendedor', 'Comprador', 'Almacén'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre_completo.trim()) newErrors.nombre_completo = 'El nombre completo es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.usuario.trim()) newErrors.usuario = 'El usuario es obligatorio';
    if (!user && !formData.contraseña) newErrors.contraseña = 'La contraseña es obligatoria';
    if (formData.contraseña && formData.contraseña.length < 6) newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    if (formData.contraseña && formData.contraseña !== formData.confirmar_contraseña) {
      newErrors.confirmar_contraseña = 'Las contraseñas no coinciden';
    }
    if (!formData.rol) newErrors.rol = 'Debe seleccionar un rol';
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

    // ✅ Construcción segura del payload
    const payload = {
      nombre_completo: formData.nombre_completo.trim(),
      email: formData.email.trim(),
      usuario: formData.usuario.trim(),
      descripcion: formData.descripcion.trim() || null, // ✅ incluido
      estado: formData.estado,
      rol: formData.rol,
    };

    if (formData.contraseña) {
      payload.contraseña = formData.contraseña;
    }

    if (typeof onSave !== 'function') {
      console.error('❌ onSave no es una función');
      setAlert({ type: 'error', message: 'Error interno: acción no disponible' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      onSave(payload);
    } catch (err) {
      console.error('💥 Error en onSave:', err);
      setAlert({ 
        type: 'error', 
        message: `Error al guardar: ${err.message || 'Desconocido'}` 
      });
      setTimeout(() => setAlert(null), 4000);
    }
  };

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {/* ✅ Dos columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
          
          {/* Columna 1: Datos básicos */}
          <div>
            <FormField
              label="Nombre Completo *"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              error={errors.nombre_completo}
            />

            <FormField
              label="Email *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FormField
              label={user ? 'Nueva Contraseña' : 'Contraseña *'}
              name="contraseña"
              type="password"
              value={formData.contraseña}
              onChange={handleChange}
              error={errors.contraseña}
            />
          </div>

          {/* Columna 2: Confirmar contraseña + Rol + ✅ Descripción debajo */}
          <div>
            <FormField
              label={user ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña *'}
              name="confirmar_contraseña"
              type="password"
              value={formData.confirmar_contraseña}
              onChange={handleChange}
              error={errors.confirmar_contraseña}
            />

            {/* ✅ Rol */}
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
                Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: errors.rol ? '1px solid #e53e3e' : '1px solid #e0d9d2',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                }}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((rol) => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
              {errors.rol && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.rol}
                </p>
              )}
            </div>

            {/* ✅ Descripción — debajo de Rol */}
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
                rows="3"
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
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.target.style.transform = 'none')}
          >
            {user ? 'Actualizar' : 'Registrar'}
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