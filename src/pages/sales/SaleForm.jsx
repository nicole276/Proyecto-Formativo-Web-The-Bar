// src/pages/sales/SaleForm.jsx
import { useState, useEffect } from 'react';
import FormField from '../../components/ui/FormField';
import Alert from '../../components/ui/Alert';

export default function SaleForm({ sale = null, clients, products, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    clienteId: sale?.clienteId || clients[0]?.id || '',
    fecha: sale?.fecha || new Date().toISOString().split('T')[0],
    factura: sale?.factura || '',
    productos: sale?.productos || [{ productoId: '', cantidad: 1, precio: 0, descuento: 0, subtotal: 0 }],
    estado: sale?.estado || 'Pendiente',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  // Cargar nombres de productos al montar o cambiar productos
  useEffect(() => {
    if (!sale) return;

    const nuevosProductos = formData.productos.map(p => {
      const prod = products.find(pr => pr.id === parseInt(p.productoId));
      return {
        ...p,
        nombre: prod?.nombre || '',
        stock: prod?.stock || 0,
      };
    });

    setFormData(prev => ({ ...prev, productos: nuevosProductos }));
  }, [sale, products]);

  // Calcular subtotal y total
  useEffect(() => {
    const nuevosProductos = formData.productos.map(p => {
      const descuentoValor = (p.precio * p.cantidad * p.descuento) / 100;
      const subtotal = p.precio * p.cantidad - descuentoValor;
      return { ...p, subtotal };
    });
    setFormData(prev => ({ ...prev, productos: nuevosProductos }));
  }, [formData.productos]);

  const total = formData.productos.reduce((sum, p) => sum + p.subtotal, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleProductChange = (index, field, value) => {
  const nuevosProductos = [...formData.productos];
  
    if (field === 'productoId') {
      // ✅ productoId como string
      const prod = products.find(p => String(p.id) === value);
      nuevosProductos[index] = { 
        ...nuevosProductos[index], 
        productoId: value,
        nombre: prod?.nombre || '',
        stock: prod?.stock || 0,
      };
    } 
    else if (field === 'cantidad' || field === 'precio' || field === 'descuento') {
      // ✅ Conversión segura a número (o string vacío)
      const numValue = value === '' ? '' : Number(value);
      nuevosProductos[index] = { 
        ...nuevosProductos[index], 
        [field]: numValue,
      };
    } 
    else {
      nuevosProductos[index] = { ...nuevosProductos[index], [field]: value };
    }

    setFormData({ ...formData, productos: nuevosProductos });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { 
        productoId: '', 
        cantidad: 1, 
        precio: 0, 
        descuento: 0, 
        subtotal: 0, 
        nombre: '', 
        stock: 0 
      }]
    });
  };

  const removeProduct = (index) => {
    if (formData.productos.length > 1) {
      const nuevosProductos = formData.productos.filter((_, i) => i !== index);
      setFormData({ ...formData, productos: nuevosProductos });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clienteId) newErrors.clienteId = 'El cliente es obligatorio';
    if (!formData.factura.trim()) newErrors.factura = 'El número de factura es obligatorio';
    if (formData.productos.length === 0) {
      newErrors.productos = 'Debe agregar al menos un producto';
    } else {
      let productosValidos = true;
      formData.productos.forEach((p, i) => {
        if (!p.productoId) {
          newErrors[`producto-${i}`] = 'Seleccione un producto';
          productosValidos = false;
        }
        if (!p.cantidad || p.cantidad <= 0) {
          newErrors[`cantidad-${i}`] = 'La cantidad debe ser > 0';
          productosValidos = false;
        }
        if (p.cantidad > p.stock) {
          newErrors[`cantidad-${i}`] = `Solo hay ${p.stock} en stock`;
          productosValidos = false;
        }
        if (!p.precio || p.precio <= 0) {
          newErrors[`precio-${i}`] = 'El precio debe ser > 0';
          productosValidos = false;
        }
        if (p.descuento < 0 || p.descuento > 100) {
          newErrors[`descuento-${i}`] = 'Descuento entre 0% y 100%';
          productosValidos = false;
        }
      });
      if (!productosValidos) newErrors.productos = 'Corrija los errores en los productos';
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
        total,
        clienteNombre: clients.find(c => c.id === formData.clienteId)?.nombre || '',
        productos: formData.productos.map(p => ({
          productoId: parseInt(p.productoId),
          nombre: p.nombre,
          cantidad: parseInt(p.cantidad),
          precio: parseFloat(p.precio),
          descuento: parseFloat(p.descuento),
          subtotal: parseFloat(p.subtotal),
        })),
      };
      onSave(payload);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div style={{ padding: '0 1rem' }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
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
                Cliente *
              </label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: errors.clienteId ? '1px solid #e53e3e' : '1px solid #e0d9d2',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '1rem',
                }}
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.clienteId && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {errors.clienteId}
                </p>
              )}
            </div>

            <FormField
              label="Fecha *"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              error={errors.fecha}
            />

            <FormField
              label="Número de Factura *"
              name="factura"
              value={formData.factura}
              onChange={handleChange}
              error={errors.factura}
            />
          </div>

          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <label style={{
                  color: '#3B2E2A',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}>
                  Productos *
                </label>
                <button
                  type="button"
                  onClick={addProduct}
                  style={{
                    padding: '0.6rem 1rem',
                    backgroundColor: '#F4B73F',
                    color: '#3B2E2A',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 6px rgba(244, 183, 63, 0.3)',
                  }}
                >
                  + Agregar producto
                </button>
              </div>

              {errors.productos && (
                <p style={{
                  color: '#e53e3e',
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  ⚠️ {errors.productos}
                </p>
              )}

              <div style={{
                maxHeight: '320px',
                overflowY: 'auto',
                border: '1px solid #e0d9d2',
                borderRadius: '8px',
                padding: '0.5rem',
                backgroundColor: '#faf8f5',
              }}>
                {formData.productos.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1rem',
                      marginBottom: i < formData.productos.length - 1 ? '0.8rem' : '0',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      border: '1px solid #f5f3f0',
                    }}
                  >
                    {/* Producto */}
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{
                        display: 'block',
                        color: '#3B2E2A',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '0.3rem',
                      }}>
                        Producto *
                      </label>
                      <select
                        value={p.productoId || ''}
                        onChange={(e) => handleProductChange(i, 'productoId', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '6px',
                          border: errors[`producto-${i}`] ? '2px solid #e53e3e' : '1px solid #e0d9d2',
                          backgroundColor: 'white',
                          color: '#3B2E2A',
                          fontSize: '1rem',
                          fontWeight: '500',
                        }}
                      >
                        <option value=""> Seleccionar producto </option>
                        {products.map(prod => (
                          <option key={prod.id} value={String(prod.id)}>
                            {prod.nombre}
                          </option>
                        ))}
                      </select>
                      {errors[`producto-${i}`] && (
                        <p style={{
                          color: '#e53e3e',
                          fontSize: '0.8rem',
                          marginTop: '0.3rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}>
                          ⚠️ {errors[`producto-${i}`]}
                        </p>
                      )}
                    </div>

                    {/* Cantidad, Precio, Descuento */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '0.8rem',
                      marginBottom: '0.8rem',
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          color: '#3B2E2A',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          marginBottom: '0.3rem',
                        }}>
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          value={p.cantidad ?? ''}
                          onChange={(e) => handleProductChange(i, 'cantidad', e.target.value)}
                          min="1"
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.8rem',
                            borderRadius: '6px',
                            border: errors[`cantidad-${i}`] ? '2px solid #e53e3e' : '1px solid #e0d9d2',
                            backgroundColor: 'white',
                            color: '#3B2E2A',
                            fontSize: '1rem',
                            fontWeight: '500',
                          }}
                          placeholder="Cantidad"
                        />
                        {errors[`cantidad-${i}`] && (
                          <p style={{
                            color: '#e53e3e',
                            fontSize: '0.8rem',
                            marginTop: '0.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}>
                            ⚠️ {errors[`cantidad-${i}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          color: '#3B2E2A',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          marginBottom: '0.3rem',
                        }}>
                          Precio *
                        </label>
                        <input
                          type="number"
                          value={p.precio ?? ''}
                          onChange={(e) => handleProductChange(i, 'precio', e.target.value)}
                          min="0"
                          step="0.01"
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.8rem',
                            borderRadius: '6px',
                            border: errors[`precio-${i}`] ? '2px solid #e53e3e' : '1px solid #e0d9d2',
                            backgroundColor: 'white',
                            color: '#3B2E2A',
                            fontSize: '1rem',
                            fontWeight: '500',
                          }}
                          placeholder="Precio"
                        />
                        {errors[`precio-${i}`] && (
                          <p style={{
                            color: '#e53e3e',
                            fontSize: '0.8rem',
                            marginTop: '0.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}>
                            ⚠️ {errors[`precio-${i}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          color: '#3B2E2A',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          marginBottom: '0.3rem',
                        }}>
                          Descuento (%)
                        </label>
                        <input
                          type="number"
                          value={p.descuento ?? ''}
                          onChange={(e) => handleProductChange(i, 'descuento', e.target.value)}
                          min="0"
                          max="100"
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.8rem',
                            borderRadius: '6px',
                            border: errors[`descuento-${i}`] ? '2px solid #e53e3e' : '1px solid #e0d9d2',
                            backgroundColor: 'white',
                            color: '#3B2E2A',
                            fontSize: '1rem',
                            fontWeight: '500',
                          }}
                          placeholder="0"
                        />
                        {errors[`descuento-${i}`] && (
                          <p style={{
                            color: '#e53e3e',
                            fontSize: '0.8rem',
                            marginTop: '0.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}>
                            ⚠️ {errors[`descuento-${i}`]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subtotal y Stock */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid #eee',
                    }}>
                      <div style={{
                        fontWeight: '700',
                        color: '#3B2E2A',
                        fontSize: '1.05rem',
                      }}>
                        Subtotal: ${p.subtotal.toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(i)}
                        disabled={formData.productos.length === 1}
                        title={formData.productos.length === 1 ? 'Debe haber al menos un producto' : 'Eliminar producto'}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: formData.productos.length === 1 ? '#ccc' : '#e53e3e',
                          fontSize: '1.4rem',
                          cursor: formData.productos.length === 1 ? 'not-allowed' : 'pointer',
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (formData.productos.length > 1) {
                            e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.08)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Stock info */}
                    {p.stock !== undefined && (
                      <p style={{
                        fontSize: '0.8rem',
                        color: p.cantidad > p.stock ? '#e53e3e' : '#666',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}>
                        📦 Stock disponible: <strong>{p.stock}</strong>
                        {p.cantidad > p.stock && (
                          <span style={{ color: '#e53e3e', fontWeight: '600' }}>⚠️ Insuficiente</span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f8f6f4', 
              borderRadius: '12px',
              textAlign: 'right',
              fontWeight: '700',
              fontSize: '1.2rem',
              color: '#3B2E2A',
            }}>
              Total: ${total.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
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
            ✅ {sale ? 'Actualizar' : 'Registrar'}
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