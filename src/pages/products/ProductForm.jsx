import { useState, useEffect } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';

export default function ProductForm({ product = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    categoria: product?.categoria || '',
    precio_compra: product?.precio_compra?.toString() || '',
    cantidad_paquete: product?.cantidad_paquete?.toString() || '',
    porcentaje_ganancia: product?.porcentaje_ganancia?.toString() || '',
    precio_venta: product?.precio_venta?.toString() || '',
    stock: product?.stock?.toString() || '',
    estado: product?.estado || 'activo',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const categorias = ['Licores', 'Cigarrería', 'Confitería'];

  // Función para formatear a pesos colombianos
  const formatCOP = (value) => {
    if (!value) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return '';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Función para parsear valor de pesos colombianos a número
  const parseCOP = (formattedValue) => {
    if (!formattedValue) return '';
    // Remover símbolos y puntos de miles, mantener solo números
    const numericString = formattedValue
      .replace(/[^0-9,-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    
    return numericString || '';
  };

  // Calcular precio de venta automáticamente
  useEffect(() => {
    const precioCompra = parseFloat(parseCOP(formData.precio_compra));
    const cantidad = parseInt(formData.cantidad_paquete) || 1;
    const porcentaje = parseFloat(formData.porcentaje_ganancia) || 0;

    if (precioCompra > 0 && cantidad > 0 && !isNaN(precioCompra) && !isNaN(cantidad)) {
      const precioUnitarioSinGanancia = precioCompra / cantidad;
      const ganancia = (precioUnitarioSinGanancia * porcentaje) / 100;
      const precioVentaCalculado = precioUnitarioSinGanancia + ganancia;
      
      // Formatear el precio de venta calculado
      const precioVentaFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(precioVentaCalculado);
      
      setFormData(prev => ({
        ...prev,
        precio_venta: precioVentaCalculado.toFixed(0)
      }));
    }
  }, [formData.precio_compra, formData.cantidad_paquete, formData.porcentaje_ganancia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es precio_compra, formatear al mostrar
    if (name === 'precio_compra') {
      const numericValue = parseCOP(value);
      setFormData({ ...formData, [name]: numericValue });
      
      // Formatear para mostrar mientras se escribe
      if (numericValue) {
        const formatted = formatCOP(numericValue);
        e.target.value = formatted;
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Formatear precio_compra al perder el foco
    if (name === 'precio_compra' && value) {
      const numericValue = parseCOP(value);
      const formatted = formatCOP(numericValue);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      // Actualizar el valor formateado en el input
      setTimeout(() => {
        if (e.target) {
          e.target.value = formatted;
        }
      }, 0);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.categoria) newErrors.categoria = 'La categoría es obligatoria';
    
    const precioCompraNum = parseFloat(parseCOP(formData.precio_compra));
    if (!formData.precio_compra || isNaN(precioCompraNum) || precioCompraNum <= 0) {
      newErrors.precio_compra = 'El precio de compra debe ser mayor que 0';
    }
    
    const cantidad = parseInt(formData.cantidad_paquete);
    if (!formData.cantidad_paquete || isNaN(cantidad) || cantidad <= 0) {
      newErrors.cantidad_paquete = 'La cantidad debe ser mayor que 0';
    }
    
    const porcentaje = parseFloat(formData.porcentaje_ganancia);
    if (!formData.porcentaje_ganancia || isNaN(porcentaje) || porcentaje < 0) {
      newErrors.porcentaje_ganancia = 'El porcentaje debe ser un número positivo';
    }
    
    const precioVentaNum = parseFloat(formData.precio_venta);
    if (!formData.precio_venta || isNaN(precioVentaNum) || precioVentaNum <= 0) {
      newErrors.precio_venta = 'El precio de venta debe ser mayor que 0';
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
        precio_compra: parseFloat(parseCOP(formData.precio_compra)),
        cantidad_paquete: parseInt(formData.cantidad_paquete),
        porcentaje_ganancia: parseFloat(formData.porcentaje_ganancia),
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
              label="Precio de Compra (Paquete) *"
              name="precio_compra"
              value={formatCOP(formData.precio_compra)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.precio_compra}
            />

            <FormField
              label="Cantidad por Paquete *"
              name="cantidad_paquete"
              type="number"
              value={formData.cantidad_paquete}
              onChange={handleChange}
              error={errors.cantidad_paquete}
              min="1"
            />
          </div>

          <div>
            <FormField
              label="Porcentaje de Ganancia (%) *"
              name="porcentaje_ganancia"
              type="number"
              value={formData.porcentaje_ganancia}
              onChange={handleChange}
              error={errors.porcentaje_ganancia}
              min="0"
              step="0.1"
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="number"
                  name="porcentaje_ganancia"
                  value={formData.porcentaje_ganancia}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: errors.porcentaje_ganancia ? '1px solid #e53e3e' : '1px solid #e0d9d2',
                    backgroundColor: 'white',
                    color: '#3B2E2A',
                    fontSize: '1rem',
                  }}
                  min="0"
                  step="0.1"
                  placeholder="0"
                />
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontWeight: 'bold',
                }}>%</span>
              </div>
              {errors.porcentaje_ganancia && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.porcentaje_ganancia}
                </p>
              )}
            </FormField>

            <FormField
              label="Precio de Venta (Unitario) *"
              name="precio_venta"
              value={formatCOP(formData.precio_venta)}
              readOnly
              error={errors.precio_venta}
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  name="precio_venta"
                  value={formatCOP(formData.precio_venta)}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: errors.precio_venta ? '1px solid #e53e3e' : '1px solid #e0d9d2',
                    backgroundColor: '#f8f9fa',
                    color: '#3B2E2A',
                    fontSize: '1rem',
                    cursor: 'not-allowed',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.85rem',
                  color: '#666',
                  fontStyle: 'italic',
                  backgroundColor: '#f8f9fa',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                }}>
                </div>
              </div>
              {formData.precio_venta && (
                <p style={{ color: '#28a745', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Precio unitario calculado con {formData.porcentaje_ganancia}% de ganancia
                </p>
              )}
            </FormField>

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
                min="0"
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
            {product ? 'Actualizar' : 'Registrar'}
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