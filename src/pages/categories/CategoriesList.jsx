// src/pages/categories/CategoriesList.jsx
import { useState } from 'react';
import CategoryForm from './CategoryForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function CategoriesList() {
  // ✅ Datos iniciales con `descripcion`
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Licores', 
      descripcion: 'Bebidas alcohólicas nacionales e importadas: ron, whisky, vino, etc.', 
      status: 'activo' 
    },
    { 
      id: 2, 
      name: 'Cigarrería', 
      descripcion: 'Cigarrillos, tabacos, puros y accesorios relacionados.', 
      status: 'activo' 
    },
    { 
      id: 3, 
      name: 'Confitería', 
      descripcion: 'Dulces, chocolates, galletas y snacks colombianos e importados.', 
      status: 'inactivo' 
    },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // ✅ handleSave corregido: usa prev + validación segura
  const handleSave = (data) => {
    try {
      if (editingCategory?.id == null && editingCategory != null) {
        throw new Error('Categoría en edición no tiene ID válido');
      }

      if (editingCategory) {
        setCategories(prev => 
          prev.map(c => 
            c.id === editingCategory.id 
              ? { ...c, ...data } 
              : c
          )
        );
      } else {
        if (categories.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
          setAlert({ type: 'error', message: '❌ Ya existe una categoría con ese nombre' });
          setTimeout(() => setAlert(null), 3000);
          return;
        }
        setCategories(prev => [...prev, { id: Date.now(), ...data }]);
      }

      setAlert({ type: 'success', message: '✅ Categoría guardada con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingCategory(null);
      }, 2000);
    } catch (err) {
      console.error('💥 Error en handleSave:', err);
      setAlert({ 
        type: 'error', 
        message: `❌ ${err.message || 'No se pudo guardar la categoría'}` 
      });
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setAlert({ type: 'success', message: `✅ Categoría "${categoryToDelete.name}" eliminada` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleDelete = (category) => {
    if (category.status === 'activo') {
      setAlert({
        type: 'error',
        message: `❌ No se puede eliminar "${category.name}" porque está activa.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === id 
          ? { ...c, status: c.status === 'activo' ? 'inactivo' : 'activo' } 
          : c
      )
    );
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = 
      statusFilter === 'todos' ||
      (statusFilter === 'activo' && c.status === 'activo') ||
      (statusFilter === 'inactivo' && c.status === 'inactivo');
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
      <h1 style={{
        color: '#3B2E2A',
        fontSize: '1.8rem',
        fontWeight: '700',
        margin: '0',
        lineHeight: 2.2,
      }}>
        Categorías
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              border: '1px solid #e0d9d2',
              fontSize: '0.95rem',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            }}
          />
        </div>

        <StatusDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'activo', label: '✅ Activo' },
            { value: 'inactivo', label: '❌ Inactivo' },
          ]}
        />

        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          style={{
            padding: '0.75rem 1.2rem',
            backgroundColor: '#F4B73F',
            color: '#3B2E2A',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(244, 183, 63, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: '1.3rem' }} />
          Registrar Categoría
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Descripción</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => {
                const isActive = category.status === 'activo';
                const statusStyle = {
                  bg: isActive ? 'rgba(244, 183, 63, 0.15)' : 'rgba(216, 102, 51, 0.15)',
                  color: isActive ? '#F4B73F' : '#D86633',
                  border: isActive ? '#F4B73F' : '#D86633',
                };
                return (
                  <tr key={category.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                    <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                      {category.name}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#666', fontSize: '0.9rem', maxWidth: '250px', wordBreak: 'break-word' }}>
                      {category.descripcion || '—'}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        >
                          {isActive ? '🟢 Activo' : '🔴 Inactivo'}
                        </span>
                        <ToggleSwitch
                          checked={isActive}
                          onChange={() => toggleStatus(category.id)}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setViewingCategory(category)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#e8f4ff',
                            color: '#007bff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setShowForm(true);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          disabled={isActive}
                          title={isActive ? 'No se puede eliminar una categoría activa' : ''}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: isActive ? '#f5f5f5' : '#ffe8e8',
                            color: isActive ? '#999' : '#e53e3e',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: isActive ? 'not-allowed' : 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal de eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="¿Eliminar Categoría?"
        message={`¿Está seguro de eliminar la categoría "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setCategoryToDelete(null);
        }}
        confirmText="✅ Eliminar"
        cancelText="❌ Cancelar"
        confirmColor="#dc3545"
        cancelColor="#6c757d"
      />

      {/* ✅ Modal de detalle — con Nombre y Descripción */}
      {viewingCategory && (
        <Modal
          isOpen={!!viewingCategory}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🏷️</span>
              <span style={{ color: '#3B2E2A', fontWeight: '700' }}>
                Detalles de la Categoría
              </span>
            </div>
          }
          onClose={() => setViewingCategory(null)}
          width="500px"
        >
          <div style={{ 
            backgroundColor: '#f8f6f4', 
            borderRadius: '12px', 
            padding: '1rem 1.5rem',
            border: '1px solid #e0d9d2'
          }}>
            {/* Encabezado compacto: Nombre y Estado en una línea */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #e0d9d2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ 
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #F4B73F, #ffd166)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: '0 3px 8px rgba(244, 183, 63, 0.25)',
                  color: '#3B2E2A',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  🏷️
                </div>
                
                <div>
                  <h2 style={{ 
                    color: '#3B2E2A', 
                    marginBottom: '0.2rem',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    lineHeight: 1.2
                  }}>
                    {viewingCategory.name}
                  </h2>
                </div>
              </div>

              {/* Estado al lado derecho */}
              <div style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                backgroundColor: viewingCategory.status === 'activo' 
                  ? 'rgba(40, 167, 69, 0.1)' 
                  : 'rgba(220, 53, 69, 0.1)',
                border: viewingCategory.status === 'activo' 
                  ? '1px solid #28a745' 
                  : '1px solid #dc3545',
                color: viewingCategory.status === 'activo' ? '#28a745' : '#dc3545',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.9rem' }}>
                  {viewingCategory.status === 'activo' ? '✅' : '❌'}
                </span>
                <span>
                  {viewingCategory.status === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* ✅ Descripción Mejorada */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '10px', 
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #e0d9d2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ 
                  color: '#F4B73F', 
                  fontSize: '1.1rem'
                }}>📝</span>
                <h3 style={{ 
                  color: '#3B2E2A', 
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  Descripción
                </h3>
              </div>
              <div style={{
                backgroundColor: '#fdfcf9',
                border: '1px solid #f0ece7',
                borderRadius: '8px',
                padding: '0.8rem',
                color: '#555',
                lineHeight: 1.5,
                fontSize: '0.9rem',
                minHeight: '60px',
                display: 'flex',
                alignItems: viewingCategory.descripcion ? 'flex-start' : 'center',
                whiteSpace: 'pre-wrap'
              }}>
                {viewingCategory.descripcion 
                  ? <span style={{ whiteSpace: 'pre-wrap' }}>{viewingCategory.descripcion}</span>
                  : <span style={{ 
                      color: '#888', 
                      fontStyle: 'italic',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ opacity: 0.5 }}>—</span>
                      No hay descripción disponible
                      <span style={{ opacity: 0.5 }}>—</span>
                    </span>
                }
              </div>
            </div>
            </div>

            {/* Botón de Cerrar más compacto */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e0d9d2'
            }}>
              <button
                onClick={() => setViewingCategory(null)}
                style={{
                  padding: '0.8rem 2rem',
                  backgroundColor: '#3B2E2A',
                  color: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B2E2A';
                  e.currentTarget.style.borderColor = 'black';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B2E2A';
                  e.currentTarget.style.borderColor = '#3B2E2A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Cerrar
              </button>
            </div>
        </Modal>
      )}

{/* ✅ Modal de formulario */}
{showForm && (
  <Modal
    isOpen={showForm}
    title={editingCategory ? '✏️ Editar Categoría' : '✅ Registrar Nueva Categoría'}
    onClose={() => {
      setShowForm(false);
      setEditingCategory(null);
    }}
  >
    <CategoryForm
      category={editingCategory}
      onSave={handleSave}
      onCancel={() => {
        setShowForm(false);
        setEditingCategory(null);
      }}
    />
  </Modal>
)}

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}