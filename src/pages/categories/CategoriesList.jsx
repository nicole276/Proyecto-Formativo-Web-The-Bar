// src/pages/categories/CategoriesList.jsx
import { useState } from 'react';
import CategoryForm from './CategoryForm';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import StatusDropdown from '../../components/ui/StatusDropdown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

// Íconos
import WineBarIcon from '@mui/icons-material/WineBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import CakeIcon from '@mui/icons-material/Cake';

const iconMap = {
  WineBarIcon: WineBarIcon,
  SmokingRoomsIcon: SmokingRoomsIcon,
  CakeIcon: CakeIcon,
};

export default function CategoriesList() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Licores', icon: 'WineBarIcon', status: 'activo' },
    { id: 2, name: 'Cigarrería', icon: 'SmokingRoomsIcon', status: 'activo' },
    { id: 3, name: 'Confitería', icon: 'CakeIcon', status: 'inactivo' },
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleSave = (data) => {
    try {
      if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...data } : c));
      } else {
        setCategories([...categories, { id: Date.now(), ...data }]);
      }
      setAlert({ type: 'success', message: 'Categoría registrada con éxito' });
      setTimeout(() => {
        setAlert(null);
        setShowForm(false);
        setEditingCategory(null);
      }, 2000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al guardar' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setAlert({ type: 'success', message: `Categoría "${categoryToDelete.name}" eliminada` });
      setTimeout(() => setAlert(null), 2000);
    }
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleDelete = (category) => {
    if (category.status === 'activo') {
      setAlert({
        type: 'error',
        message: `No se puede eliminar la categoría "${category.name}" porque está activa.`,
      });
      setTimeout(() => setAlert(null), 4000);
      return;
    }
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  const toggleStatus = (id) => {
    setCategories(categories.map(c =>
      c.id === id ? { ...c, status: c.status === 'activo' ? 'inactivo' : 'activo' } : c
    ));
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'todos' ||
      (statusFilter === 'activo' && c.status === 'activo') ||
      (statusFilter === 'inactivo' && c.status === 'inactivo');
    return matchesSearch && matchesStatus;
  });

  const renderIcon = (iconName) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon sx={{ fontSize: '1.4rem', color: '#3B2E2A' }} /> : '❓';
  };

  return (
    <div style={{ padding: '0.5rem 2rem 2rem' }}>
      <h1 style={{
          color: '#3B2E2A',
          fontSize: '1.8rem',
          fontWeight: '700',
          margin: '0',
          lineHeight: 2.2,
        }}>
            Categoría
        </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{flex: '1', minWidth: '250px' }}>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f6f4' }}>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Ícono</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'left', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Nombre</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Estado</th>
                <th style={{ padding: '1rem 1.2rem', textAlign: 'center', fontWeight: '700', color: '#3B2E2A', borderBottom: '2px solid #e0d9d2' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => {
                const style = category.status === 'activo' 
                  ? { bg: 'rgba(244, 183, 63, 0.15)', color: '#F4B73F', border: '#F4B73F' }
                  : { bg: 'rgba(216, 102, 51, 0.15)', color: '#D86633', border: '#D86633' };
                return (
                  <tr key={category.id} style={{ borderBottom: '1px solid #f0eee9' }}>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      {renderIcon(category.icon)}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#3B2E2A', fontWeight: '600' }}>
                      {category.name}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            backgroundColor: style.bg,
                            color: style.color,
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            border: `1px solid ${style.border}`,
                          }}
                        >
                          {category.status === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                        </span>
                        <ToggleSwitch
                          checked={category.status === 'activo'}
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
                          disabled={category.status === 'activo'}
                          title={category.status === 'activo' ? 'No se puede eliminar una categoría activa' : ''}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: category.status === 'activo' ? '#f5f5f5' : '#ffe8e8',
                            color: category.status === 'activo' ? '#999' : '#e53e3e',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: category.status === 'activo' ? 'not-allowed' : 'pointer',
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

      {/* Modales */}
      {viewingCategory && (
        <Modal
          isOpen={!!viewingCategory}
          title={`📄 Detalle de la Categoría: ${viewingCategory.name}`}
          onClose={() => setViewingCategory(null)}
        >
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', color: '#3B2E2A', marginBottom: '0.5rem' }}>
              {renderIcon(viewingCategory.icon)}
            </div>
            <h2 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>{viewingCategory.name}</h2>
            <span
              style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                backgroundColor: viewingCategory.status === 'activo' ? 'rgba(244, 183, 63, 0.2)' : 'rgba(216, 102, 51, 0.2)',
                color: viewingCategory.status === 'activo' ? '#F4B73F' : '#D86633',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              {viewingCategory.status === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
            </span>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={() => setViewingCategory(null)}
                style={{
                  padding: '0.7rem 1.8rem',
                  backgroundColor: '#e0e0e0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showForm && (
        <Modal
          isOpen={showForm}
          title={editingCategory ? '✏️ Editar Categoría' : '✅ Registrar Categoría'}
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