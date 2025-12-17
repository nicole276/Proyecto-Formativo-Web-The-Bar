// src/pages/purchases/PurchaseForm.jsx
import { useState } from 'react';
import Alert from '../../components/ui/Alert';

export default function PurchaseForm({ purchase = null, suppliers, products, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    proveedorId: purchase?.proveedorId || '',
    fecha: purchase?.fecha || new Date().toISOString().split('T')[0],
    factura: purchase?.factura || '',
    productos: purchase?.productos || [],
    estado: purchase?.estado || 'Pendiente',
  });
  
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    productoId: '',
    cantidad: '',
    precio: ''
  });

  // Función para formatear a pesos colombianos
  const formatCOP = (value) => {
    if (!value && value !== 0) return '$0';
    const number = parseFloat(value);
    if (isNaN(number)) return '$0';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Función para parsear valor de pesos colombianos
  const parseCOP = (formattedValue) => {
    if (!formattedValue) return '';
    return formattedValue.replace(/[^0-9]/g, '');
  };

  // Calcular total
  const total = formData.productos.reduce((sum, p) => {
    const subtotal = (p.cantidad || 0) * (p.precio || 0);
    return sum + subtotal;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleNuevoProductoChange = (field, value) => {
    if (field === 'precio') {
      const numericValue = parseCOP(value);
      setNuevoProducto(prev => ({
        ...prev,
        [field]: numericValue
      }));
    } else {
      setNuevoProducto(prev => ({
        ...prev,
        [field]: field === 'productoId' ? value : (value === '' ? '' : Number(value))
      }));
    }
  };

  const agregarProducto = () => {
    console.log('Agregando producto:', nuevoProducto);
    console.log('Productos actuales:', formData.productos.length);
    
    if (!nuevoProducto.productoId || nuevoProducto.productoId === '') {
      setAlert({ type: 'warning', message: 'Seleccionar producto' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const cantidad = parseFloat(nuevoProducto.cantidad);
    const precio = parseFloat(nuevoProducto.precio);

    if (!cantidad || cantidad <= 0) {
      setAlert({ type: 'warning', message: 'Cantidad debe ser > 0' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (!precio || precio <= 0) {
      setAlert({ type: 'warning', message: 'Precio debe ser > 0' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const productoSeleccionado = products.find(p => String(p.id) === String(nuevoProducto.productoId));
    
    if (!productoSeleccionado) {
      setAlert({ type: 'error', message: 'Producto no encontrado' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    // Verificar si ya existe el producto en la lista
    const productoExistenteIndex = formData.productos.findIndex(p => 
      String(p.productoId) === String(nuevoProducto.productoId)
    );

    console.log('Índice encontrado:', productoExistenteIndex);

    if (productoExistenteIndex >= 0) {
      // Si el producto ya existe, actualizar la cantidad
      const nuevosProductos = [...formData.productos];
      const nuevaCantidad = nuevosProductos[productoExistenteIndex].cantidad + cantidad;
      const nuevoSubtotal = nuevaCantidad * nuevosProductos[productoExistenteIndex].precio;
      
      nuevosProductos[productoExistenteIndex] = {
        ...nuevosProductos[productoExistenteIndex],
        cantidad: nuevaCantidad,
        subtotal: nuevoSubtotal
      };
      
      setFormData(prev => ({ ...prev, productos: nuevosProductos }));
      setAlert({ type: 'success', message: `Cantidad actualizada para ${productoSeleccionado.nombre}` });
    } else {
      // Si el producto NO existe, agregarlo como nuevo
      const nuevoItem = {
        productoId: nuevoProducto.productoId,
        nombre: productoSeleccionado.nombre,
        cantidad: cantidad,
        precio: precio,
        subtotal: cantidad * precio
      };

      console.log('Agregando nuevo item:', nuevoItem);

      setFormData(prev => ({
        ...prev,
        productos: [...prev.productos, nuevoItem]
      }));
      
      setAlert({ type: 'success', message: `Producto "${productoSeleccionado.nombre}" agregado` });
    }

    // Resetear formulario
    setNuevoProducto({
      productoId: '',
      cantidad: 1,
      precio: ''
    });

    setTimeout(() => setAlert(null), 3000);
  };

  const actualizarProducto = (index, field, value) => {
    const nuevosProductos = [...formData.productos];
    
    if (field === 'cantidad') {
      const numValue = value === '' ? 0 : Number(value);
      nuevosProductos[index] = { 
        ...nuevosProductos[index], 
        [field]: numValue,
        subtotal: numValue * nuevosProductos[index].precio
      };
    } else if (field === 'precio') {
      const numValue = parseCOP(value) === '' ? 0 : Number(parseCOP(value));
      nuevosProductos[index] = { 
        ...nuevosProductos[index], 
        [field]: numValue,
        subtotal: nuevosProductos[index].cantidad * numValue
      };
    }

    setFormData({ ...formData, productos: nuevosProductos });
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = formData.productos.filter((_, i) => i !== index);
    setFormData({ ...formData, productos: nuevosProductos });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.proveedorId) newErrors.proveedorId = 'Proveedor obligatorio';
    if (!formData.factura.trim()) newErrors.factura = 'Factura obligatoria';
    if (formData.productos.length === 0) {
      newErrors.productos = 'Agregue al menos un producto';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlert({ type: 'warning', message: 'Complete los campos obligatorios' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      const payload = {
        ...formData,
        total,
        proveedorNombre: suppliers.find(s => String(s.id) === String(formData.proveedorId))?.nombre || '',
        productos: formData.productos.map(p => ({
          productoId: parseInt(p.productoId),
          nombre: p.nombre,
          cantidad: parseInt(p.cantidad),
          precio: parseFloat(p.precio),
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
    <div style={{ padding: '0 1rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <h2 style={{ 
        color: '#3B2E2A', 
        fontSize: '1.4rem', 
        fontWeight: '700',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #F4B73F'
      }}>
        {purchase ? 'Actualizar Compra' : 'Registrar Compra'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* SECCIÓN 1: INFORMACIÓN DE LA COMPRA */}
        <div style={{ 
          backgroundColor: '#f8f6f4',
          padding: '0.8rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e0d9d2'
        }}>
          <h3 style={{ 
            color: '#3B2E2A', 
            fontSize: '0.9rem', 
            fontWeight: '600',
            marginBottom: '0.8rem',
          }}>
            📋 Información de la Compra
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '0.8rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#3B2E2A',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}>
                Proveedor *
              </label>
              <select
                name="proveedorId"
                value={formData.proveedorId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: errors.proveedorId ? '1px solid #e53e3e' : '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
              >
                <option value="">Seleccionar proveedor</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#3B2E2A',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}>
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#3B2E2A',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}>
                N° Factura *
              </label>
              <input
                type="text"
                name="factura"
                value={formData.factura}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: errors.factura ? '1px solid #e53e3e' : '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: AGREGAR PRODUCTOS */}
        <div style={{ 
          backgroundColor: '#f8f6f4',
          padding: '0.8rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e0d9d2'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.8rem'
          }}>
            <h3 style={{ 
              color: '#3B2E2A', 
              fontSize: '0.9rem', 
              fontWeight: '600',
            }}>
              🛒 Agregar Productos
            </h3>
            
            <div style={{ 
              padding: '0.2rem 0.6rem', 
              backgroundColor: '#F4B73F', 
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '0.8rem',
              color: '#3B2E2A',
            }}>
              {formData.productos.length} producto(s)
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr auto', 
            gap: '0.6rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#3B2E2A',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}>
                Producto *
              </label>
              <select
                value={nuevoProducto.productoId}
                onChange={(e) => handleNuevoProductoChange('productoId', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
              >
                <option value="">Seleccionar producto</option>
                {products.map(prod => (
                  <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#3B2E2A',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}>
                Cantidad *
              </label>
              <input
                type="number"
                value={nuevoProducto.cantidad}
                onChange={(e) => handleNuevoProductoChange('cantidad', e.target.value)}
                min="1"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#3B2E2A',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}>
                Precio *
              </label>
              <input
                type="text"
                name="nuevo-precio"
                value={formatCOP(nuevoProducto.precio)}
                onChange={(e) => handleNuevoProductoChange('precio', e.target.value)}
                placeholder="$0"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <button
                type="button"
                onClick={agregarProducto}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '100px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#218838';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: TABLA DE PRODUCTOS */}
        <div style={{ 
          backgroundColor: '#f8f6f4',
          padding: formData.productos.length > 0 ? '0.8rem' : '0.6rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #e0d9d2',
        }}>
          {formData.productos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1.2rem',
              color: '#666',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem', opacity: 0.5 }}>📦</div>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.2rem', fontWeight: '600' }}>
                No hay productos agregados
              </p>
              <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Agrega productos usando el formulario de arriba
              </p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.6rem',
              }}>
                <h4 style={{ 
                  color: '#3B2E2A', 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                }}>
                  Productos en la compra
                </h4>
                <div style={{ 
                  fontSize: '0.8rem',
                  color: '#3B2E2A',
                  fontWeight: '500',
                }}>
                  Total: <span style={{ fontWeight: '700', color: '#F4B73F' }}>{formatCOP(total)}</span>
                </div>
              </div>

              {/* TABLA CON SCROLL */}
              <div style={{
                borderRadius: '5px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                overflow: 'hidden',
                maxHeight: formData.productos.length >= 3 ? '220px' : 'none',
                overflowY: formData.productos.length >= 3 ? 'auto' : 'visible',
              }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.8rem',
                }}>
                  <thead style={{
                    position: formData.productos.length >= 3 ? 'sticky' : 'static',
                    top: 0,
                    backgroundColor: '#f1f1f1',
                    zIndex: 2,
                  }}>
                    <tr>
                      <th style={{ 
                        padding: '0.5rem', 
                        textAlign: 'left', 
                        color: '#3B2E2A',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        borderBottom: '2px solid #ddd',
                      }}>Producto</th>
                      <th style={{ 
                        padding: '0.5rem', 
                        textAlign: 'center', 
                        color: '#3B2E2A',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        borderBottom: '2px solid #ddd',
                      }}>Cantidad</th>
                      <th style={{ 
                        padding: '0.5rem', 
                        textAlign: 'right', 
                        color: '#3B2E2A',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        borderBottom: '2px solid #ddd',
                      }}>Precio Unit.</th>
                      <th style={{ 
                        padding: '0.5rem', 
                        textAlign: 'right', 
                        color: '#3B2E2A',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        borderBottom: '2px solid #ddd',
                      }}>Subtotal</th>
                      <th style={{ 
                        padding: '0.5rem', 
                        textAlign: 'center', 
                        color: '#3B2E2A',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        borderBottom: '2px solid #ddd',
                      }}>Acción</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {formData.productos.map((producto, index) => (
                      <tr 
                        key={index}
                        style={{ 
                          borderBottom: index < formData.productos.length - 1 ? '1px solid #f0f0f0' : 'none',
                          backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                        }}
                      >
                        <td style={{ 
                          padding: '0.5rem',
                        }}>
                          <div style={{ 
                            fontWeight: '500', 
                            color: '#3B2E2A',
                          }}>
                            {producto.nombre}
                          </div>
                        </td>
                        <td style={{ 
                          padding: '0.5rem',
                          textAlign: 'center'
                        }}>
                          <input
                            type="number"
                            value={producto.cantidad}
                            onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)}
                            min="1"
                            style={{
                              width: '60px',
                              padding: '0.3rem',
                              borderRadius: '3px',
                              border: '1px solid #ccc',
                              backgroundColor: 'white',
                              color: '#3B2E2A',
                              fontSize: '0.8rem',
                              textAlign: 'center'
                            }}
                          />
                        </td>
                        <td style={{ 
                          padding: '0.5rem',
                          textAlign: 'right',
                          fontWeight: '500'
                        }}>
                          <input
                            type="text"
                            value={formatCOP(producto.precio)}
                            onChange={(e) => actualizarProducto(index, 'precio', e.target.value)}
                            style={{
                              width: '100px',
                              padding: '0.3rem',
                              borderRadius: '3px',
                              border: '1px solid #ccc',
                              backgroundColor: 'white',
                              color: '#3B2E2A',
                              fontSize: '0.8rem',
                              textAlign: 'right'
                            }}
                          />
                        </td>
                        <td style={{ 
                          padding: '0.5rem',
                          textAlign: 'right',
                          fontWeight: '600'
                        }}>
                          {formatCOP(producto.subtotal)}
                        </td>
                        <td style={{ 
                          padding: '0.5rem',
                          textAlign: 'center'
                        }}>
                          <button
                            type="button"
                            onClick={() => eliminarProducto(index)}
                            title="Eliminar producto"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#e53e3e',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              padding: '0.2rem',
                              borderRadius: '3px',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* SECCIÓN 4: BOTONES DE ACCIÓN */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.8rem 1.2rem',
          backgroundColor: '#f8f6f4',
          borderRadius: '8px',
          border: '1px solid #e0d9d2'
        }}>
          <div style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'white', 
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '1rem',
            color: '#3B2E2A',
            border: '2px solid #F4B73F',
          }}>
            Total: <span style={{ color: '#F4B73F' }}>{formatCOP(total)}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.6rem 1.5rem',
                backgroundColor: '#F4B73F',
                color: '#3B2E2A',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(244, 183, 63, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5C96B';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F4B73F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {purchase ? 'Actualizar Compra' : 'Registrar Compra'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}