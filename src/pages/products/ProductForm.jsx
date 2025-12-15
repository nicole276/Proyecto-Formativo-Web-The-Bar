import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

export default function ProductForm({ product = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    categoria: product?.categoria || 'Licores',
    precio_compra: product?.precio_compra?.toString() || '',
    precio_venta: product?.precio_venta?.toString() || '',
    stock: product?.stock?.toString() || '',
    estado: product?.estado || 'activo',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const categorias = ['Licores', 'Cigarrería', 'Confitería'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.categoria) newErrors.categoria = 'La categoría es obligatoria';
    if (!formData.precio_compra || isNaN(formData.precio_compra) || parseFloat(formData.precio_compra) <= 0) {
      newErrors.precio_compra = 'El precio de compra debe ser mayor que 0';
    }
    if (!formData.precio_venta || isNaN(formData.precio_venta) || parseFloat(formData.precio_venta) <= 0) {
      newErrors.precio_venta = 'El precio de venta debe ser mayor que 0';
    }
    if (parseFloat(formData.precio_venta) <= parseFloat(formData.precio_compra)) {
      newErrors.precio_venta = 'El precio de venta debe ser mayor que el de compra';
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número entero ≥ 0';
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
      const payload = {
        ...formData,
        precio_compra: parseFloat(formData.precio_compra),
        precio_venta: parseFloat(formData.precio_venta),
        stock: parseInt(formData.stock),
      };
      onSave(payload);
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
            <FormField
              label="Nombre del Producto *"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={errors.nombre}
            />

            <FormField
              label="Categoría *"
              name="categoria"
            >
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: errors.categoria ? '1px solid #e53e3e' : '1px solid #e0d9d2',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                }}
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categoria && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.categoria}
                </p>
              )}
            </FormField>

            <FormField
              label="Precio de Compra *"
              name="precio_compra"
              type="number"
              value={formData.precio_compra}
              onChange={handleChange}
              error={errors.precio_compra}
            />

            <FormField
              label="Precio de Venta *"
              name="precio_venta"
              type="number"
              value={formData.precio_venta}
              onChange={handleChange}
              error={errors.precio_venta}
            />
          </div>

          <div>
            <FormField
              label="Stock *"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
            >
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: (() => {
                    const stock = parseInt(formData.stock);
                    if (stock === 0) return '1px solid #e53e3e';
                    if (stock > 0 && stock <= 10) return '1px solid #ffc107';
                    return errors.stock ? '1px solid #e53e3e' : '1px solid #e0d9d2';
                  })(),
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                }}
              />
              {errors.stock && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.stock}
                </p>
              )}
            </FormField>
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
            ✅ {product ? 'Actualizar' : 'Registrar'}
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