import { useState } from 'react';
import Alert from '../../components/ui/Alert';

export default function SaleForm({ sale = null, clients, products, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    clienteId: sale?.clienteId || '',
    fecha: sale?.fecha || new Date().toISOString().split('T')[0],
    productos: sale?.productos || [],
    estado: 'Completada', // Siempre "Completada" para nuevas ventas
  });
  
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    productoId: '',
    cantidad: '',
    precio: '',
    descuento: 0
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
    const descuentoValor = (subtotal * (p.descuento || 0)) / 100;
    return sum + (subtotal - descuentoValor);
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
    if (!nuevoProducto.productoId || nuevoProducto.productoId === '') {
      setAlert({ type: 'warning', message: 'Seleccionar producto' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const cantidad = parseFloat(nuevoProducto.cantidad);
    const precio = parseFloat(nuevoProducto.precio);
    const descuento = parseFloat(nuevoProducto.descuento) || 0;

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

    if (descuento < 0 || descuento > 100) {
      setAlert({ type: 'warning', message: 'Descuento debe estar entre 0% y 100%' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const productoSeleccionado = products.find(p => String(p.id) === String(nuevoProducto.productoId));
    
    if (!productoSeleccionado) {
      setAlert({ type: 'error', message: 'Producto no encontrado' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (cantidad > productoSeleccionado.stock) {
      setAlert({ type: 'warning', message: `Stock insuficiente. Disponible: ${productoSeleccionado.stock}` });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    // Verificar si ya existe el producto en la lista
    const productoExistenteIndex = formData.productos.findIndex(p => 
      String(p.productoId) === String(nuevoProducto.productoId)
    );

    if (productoExistenteIndex >= 0) {
      const nuevosProductos = [...formData.productos];
      const nuevaCantidad = nuevosProductos[productoExistenteIndex].cantidad + cantidad;
      
      if (nuevaCantidad > productoSeleccionado.stock) {
        setAlert({ type: 'warning', message: `Stock insuficiente. Disponible: ${productoSeleccionado.stock}` });
        setTimeout(() => setAlert(null), 3000);
        return;
      }
      
      const nuevoSubtotal = nuevaCantidad * nuevosProductos[productoExistenteIndex].precio;
      const nuevoDescuentoValor = (nuevoSubtotal * (nuevoProducto.descuento || 0)) / 100;
      
      nuevosProductos[productoExistenteIndex] = {
        ...nuevosProductos[productoExistenteIndex],
        cantidad: nuevaCantidad,
        descuento: nuevoProducto.descuento,
        subtotal: nuevoSubtotal - nuevoDescuentoValor
      };
      
      setFormData(prev => ({ ...prev, productos: nuevosProductos }));
      setAlert({ type: 'success', message: `Cantidad actualizada para ${productoSeleccionado.nombre}` });
    } else {
      const subtotal = cantidad * precio;
      const descuentoValor = (subtotal * descuento) / 100;
      
      const nuevoItem = {
        productoId: nuevoProducto.productoId,
        nombre: productoSeleccionado.nombre,
        stock: productoSeleccionado.stock,
        cantidad: cantidad,
        precio: precio,
        descuento: descuento,
        subtotal: subtotal - descuentoValor
      };

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
      precio: '',
      descuento: 0
    });

    setTimeout(() => setAlert(null), 3000);
  };

  const actualizarProducto = (index, field, value) => {
    const nuevosProductos = [...formData.productos];
    const producto = nuevosProductos[index];
    
    if (field === 'cantidad') {
      const numValue = value === '' ? 0 : Number(value);
      
      if (numValue > producto.stock) {
        setAlert({ type: 'warning', message: `Stock insuficiente. Disponible: ${producto.stock}` });
        setTimeout(() => setAlert(null), 3000);
        return;
      }
      
      nuevosProductos[index] = { 
        ...producto, 
        [field]: numValue
      };
    } else if (field === 'precio') {
      const numValue = parseCOP(value) === '' ? 0 : Number(parseCOP(value));
      nuevosProductos[index] = { 
        ...producto, 
        [field]: numValue
      };
    } else if (field === 'descuento') {
      const numValue = value === '' ? 0 : Number(value);
      if (numValue < 0 || numValue > 100) {
        setAlert({ type: 'warning', message: 'Descuento debe estar entre 0% y 100%' });
        setTimeout(() => setAlert(null), 3000);
        return;
      }
      nuevosProductos[index] = { 
        ...producto, 
        [field]: numValue
      };
    }

    // Recalcular subtotal
    const subtotal = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    const descuentoValor = (subtotal * (nuevosProductos[index].descuento || 0)) / 100;
    nuevosProductos[index].subtotal = subtotal - descuentoValor;

    setFormData({ ...formData, productos: nuevosProductos });
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = formData.productos.filter((_, i) => i !== index);
    setFormData({ ...formData, productos: nuevosProductos });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clienteId) newErrors.clienteId = 'Cliente obligatorio';
    if (formData.productos.length === 0) {
      newErrors.productos = 'Agregue al menos un producto';
    } else {
      formData.productos.forEach((p, i) => {
        if (p.cantidad > p.stock) {
          newErrors[`cantidad-${i}`] = `Stock insuficiente (${p.stock} disponible)`;
        }
        if (p.descuento < 0 || p.descuento > 100) {
          newErrors[`descuento-${i}`] = 'Descuento inválido (0-100%)';
        }
      });
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
        clienteNombre: clients.find(c => String(c.id) === String(formData.clienteId))?.nombre || '',
        productos: formData.productos.map(p => ({
          productoId: parseInt(p.productoId),
          nombre: p.nombre,
          stock: p.stock,
          cantidad: parseInt(p.cantidad),
          precio: parseFloat(p.precio),
          descuento: parseFloat(p.descuento),
          subtotal: parseFloat(p.subtotal),
        })),
      };
      onSave(payload);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar la venta' });
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
        {sale ? 'Actualizar Venta' : 'Registrar Venta'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* SECCIÓN 1: INFORMACIÓN DE LA VENTA - SOLO 2 CAMPOS */}
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
            📋 Información de la Venta
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
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
                Cliente *
              </label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: errors.clienteId ? '1px solid #e53e3e' : '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.clienteId && (
                <p style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                  {errors.clienteId}
                </p>
              )}
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
            gridTemplateColumns: '1fr 1fr 1fr 1fr auto', 
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
              <label style={{
                display: 'block',
                color: '#3B2E2A',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}>
                Descuento (%)
              </label>
              <input
                type="number"
                value={nuevoProducto.descuento}
                onChange={(e) => handleNuevoProductoChange('descuento', e.target.value)}
                min="0"
                max="100"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  color: '#3B2E2A',
                  fontSize: '0.85rem',
                }}
                placeholder="0"
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
                  Productos en la venta
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
                      }}>Stock</th>
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
                      }}>Precio</th>
                      <th style={{ 
                        padding: '0.5rem', 
                        textAlign: 'center', 
                        color: '#3B2E2A',
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        borderBottom: '2px solid #ddd',
                      }}>Desc. %</th>
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
                          textAlign: 'center',
                          color: '#666',
                          fontSize: '0.75rem'
                        }}>
                          {producto.stock}
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
                            max={producto.stock}
                            style={{
                              width: '60px',
                              padding: '0.3rem',
                              borderRadius: '3px',
                              border: errors[`cantidad-${index}`] ? '1px solid #e53e3e' : '1px solid #ccc',
                              backgroundColor: producto.cantidad > producto.stock ? '#ffe6e6' : 'white',
                              color: producto.cantidad > producto.stock ? '#e53e3e' : '#3B2E2A',
                              fontSize: '0.8rem',
                              textAlign: 'center'
                            }}
                          />
                          {errors[`cantidad-${index}`] && (
                            <div style={{
                              color: '#e53e3e',
                              fontSize: '0.7rem',
                              marginTop: '0.2rem',
                            }}>
                              {errors[`cantidad-${index}`]}
                            </div>
                          )}
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
                          textAlign: 'center'
                        }}>
                          <input
                            type="number"
                            value={producto.descuento}
                            onChange={(e) => actualizarProducto(index, 'descuento', e.target.value)}
                            min="0"
                            max="100"
                            style={{
                              width: '60px',
                              padding: '0.3rem',
                              borderRadius: '3px',
                              border: errors[`descuento-${index}`] ? '1px solid #e53e3e' : '1px solid #ccc',
                              backgroundColor: 'white',
                              color: '#3B2E2A',
                              fontSize: '0.8rem',
                              textAlign: 'center'
                            }}
                          />
                          {errors[`descuento-${index}`] && (
                            <div style={{
                              color: '#e53e3e',
                              fontSize: '0.7rem',
                              marginTop: '0.2rem',
                            }}>
                              {errors[`descuento-${index}`]}
                            </div>
                          )}
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
            Total Venta: <span style={{ color: '#F4B73F' }}>{formatCOP(total)}</span>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#28a745',
              fontWeight: '600',
              marginTop: '0.2rem'
            }}>
            </div>
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
              {sale ? 'Actualizar Venta' : 'Registrar Venta'}
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