import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

import WineBarIcon from '@mui/icons-material/WineBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import CakeIcon from '@mui/icons-material/Cake';
const iconOptions = [
  { value: 'WineBarIcon', label: 'Licores', Icon: WineBarIcon },
  { value: 'SmokingRoomsIcon', label: 'Cigarrería', Icon: SmokingRoomsIcon },
  { value: 'CakeIcon', label: 'Confitería', Icon: CakeIcon },
  // 🔜 Futuro: añadir más aquí, ej:
  // { value: 'LocalDrinkIcon', label: 'Bebidas', Icon: LocalDrinkIcon },
];

export default function CategoryForm({ category = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    icon: category?.icon || 'WineBarIcon',
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
    if (!formData.icon) newErrors.icon = 'Debe seleccionar un ícono';
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

    onSave(formData);
  };

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
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
                Ícono *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {iconOptions.map((opt) => {
                  const Icon = opt.Icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: opt.value })}
                      style={{
                        padding: '0.8rem 0.5rem',
                        borderRadius: '12px',
                        border: formData.icon === opt.value ? '2px solid #F4B73F' : '1px solid #e0d9d2',
                        backgroundColor: formData.icon === opt.value ? 'rgba(244, 183, 63, 0.1)' : 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon sx={{ fontSize: '1.8rem', color: '#3B2E2A' }} />
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.icon && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.icon}
                </p>
              )}
            </div>
          </div>
        </div>

        

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
            }}
          >
            ✅ {category ? 'Actualizar' : 'Agregar'}
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
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}