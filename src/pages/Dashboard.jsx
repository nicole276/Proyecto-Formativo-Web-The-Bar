import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
} from 'recharts';

// Datos simulados por período
const dataByPeriod = {
  semanal: {
    general: [
      { name: 'Sem 1', ventas: 3000, compras: 2000 },
      { name: 'Sem 2', ventas: 4500, compras: 3500 },
      { name: 'Sem 3', ventas: 5000, compras: 4000 },
      { name: 'Sem 4', ventas: 6000, compras: 5000 },
    ],
    ventas: [
      { name: 'Sem 1', valor: 3000 },
      { name: 'Sem 2', valor: 4500 },
      { name: 'Sem 3', valor: 5000 },
      { name: 'Sem 4', valor: 6000 },
    ],
    compras: [
      { name: 'Sem 1', valor: 2000 },
      { name: 'Sem 2', valor: 3500 },
      { name: 'Sem 3', valor: 4000 },
      { name: 'Sem 4', valor: 5000 },
    ],
    productos: [
      { name: 'Sem 1', valor: 150 },
      { name: 'Sem 2', valor: 152 },
      { name: 'Sem 3', valor: 155 },
      { name: 'Sem 4', valor: 156 },
    ],
  },
  quincenal: {
    general: [
      { name: 'Q1', ventas: 7000, compras: 6000 },
      { name: 'Q2', ventas: 8500, compras: 7500 },
      { name: 'Q3', ventas: 9000, compras: 8000 },
      { name: 'Q4', ventas: 10000, compras: 9000 },
    ],
    ventas: [
      { name: 'Q1', valor: 7000 },
      { name: 'Q2', valor: 8500 },
      { name: 'Q3', valor: 9000 },
      { name: 'Q4', valor: 10000 },
    ],
    compras: [
      { name: 'Q1', valor: 6000 },
      { name: 'Q2', valor: 7500 },
      { name: 'Q3', valor: 8000 },
      { name: 'Q4', valor: 9000 },
    ],
    productos: [
      { name: 'Q1', valor: 158 },
      { name: 'Q2', valor: 160 },
      { name: 'Q3', valor: 162 },
      { name: 'Q4', valor: 165 },
    ],
  },
  mensual: {
    general: [
      { name: 'Ene', ventas: 15000, compras: 12000 },
      { name: 'Feb', ventas: 18000, compras: 15000 },
      { name: 'Mar', ventas: 20000, compras: 18000 },
      { name: 'Abr', ventas: 22000, compras: 20000 },
    ],
    ventas: [
      { name: 'Ene', valor: 15000 },
      { name: 'Feb', valor: 18000 },
      { name: 'Mar', valor: 20000 },
      { name: 'Abr', valor: 22000 },
    ],
    compras: [
      { name: 'Ene', valor: 12000 },
      { name: 'Feb', valor: 15000 },
      { name: 'Mar', valor: 18000 },
      { name: 'Abr', valor: 20000 },
    ],
    productos: [
      { name: 'Ene', valor: 168 },
      { name: 'Feb', valor: 170 },
      { name: 'Mar', valor: 172 },
      { name: 'Abr', valor: 175 },
    ],
  },
  anual: {
    general: [
      { name: '2023', ventas: 60000, compras: 50000 },
      { name: '2024', ventas: 65000, compras: 55000 },
      { name: '2025', ventas: 70000, compras: 60000 },
      { name: '2026', ventas: 75000, compras: 65000 },
    ],
    ventas: [
      { name: '2023', valor: 60000 },
      { name: '2024', valor: 65000 },
      { name: '2025', valor: 70000 },
      { name: '2026', valor: 75000 },
    ],
    compras: [
      { name: '2023', valor: 50000 },
      { name: '2024', valor: 55000 },
      { name: '2025', valor: 60000 },
      { name: '2026', valor: 65000 },
    ],
    productos: [
      { name: '2023', valor: 178 },
      { name: '2024', valor: 180 },
      { name: '2025', valor: 182 },
      { name: '2026', valor: 185 },
    ],
  },
};

// ✅ Componente: Vista General
function GeneralView({ data }) {
  return (
    <>
      {/* Tarjetas pequeñas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Ventas</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#F4B73F' }}>
            ${data.general.reduce((sum, item) => sum + item.ventas, 0)}
          </p>
        </div>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Compras</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#D86633' }}>
            ${data.general.reduce((sum, item) => sum + item.compras, 0)}
          </p>
        </div>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Productos</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0F1A24' }}>
            {data.productos.reduce((sum, item) => sum + item.valor, 0)}
          </p>
        </div>
      </div>

      {/* Gráficas lado a lado */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        {/* Gráfica Ventas vs Compras */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Ventas vs Compras</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.general}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#F4B73F" strokeWidth={3} />
              <Line type="monotone" dataKey="compras" stroke="#D86633" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica Productos */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Productos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.productos}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#0F1A24" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

// ✅ Componente: Vista Ventas
function VentasView({ data }) {
  const pieData = [
    { name: 'Sem 1', value: data.ventas[0].valor },
    { name: 'Sem 2', value: data.ventas[1].valor },
    { name: 'Sem 3', value: data.ventas[2].valor },
    { name: 'Sem 4', value: data.ventas[3].valor },
  ];

  return (
    <>
      {/* Tarjeta resumen */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Total Ventas</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#F4B73F' }}>
          ${data.ventas.reduce((sum, item) => sum + item.valor, 0)}
        </p>
      </div>

      {/* Gráficas lado a lado */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        {/* Gráfica de Líneas */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Ventas por Período</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.ventas}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#F4B73F" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Torta */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Distribución de Ventas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#F4B73F"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#F4B73F', '#FFD700', '#FFA500', '#FF8C00'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

// ✅ Componente: Vista Compras
function ComprasView({ data }) {
  const barData = [
    { name: 'Sem 1', valor: data.compras[0].valor },
    { name: 'Sem 2', valor: data.compras[1].valor },
    { name: 'Sem 3', valor: data.compras[2].valor },
    { name: 'Sem 4', valor: data.compras[3].valor },
  ];

  const pieData = [
    { name: 'Sem 1', value: data.compras[0].valor },
    { name: 'Sem 2', value: data.compras[1].valor },
    { name: 'Sem 3', value: data.compras[2].valor },
    { name: 'Sem 4', value: data.compras[3].valor },
  ];

  return (
    <>
      {/* Tarjeta resumen */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Total Compras</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#D86633' }}>
          ${data.compras.reduce((sum, item) => sum + item.valor, 0)}
        </p>
      </div>

      {/* Gráficas lado a lado */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        {/* Gráfica de Barras */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Compras por Período</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#D86633">
                <LabelList dataKey="valor" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Torta */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Distribución de Compras</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#D86633"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#D86633', '#FF6347', '#FF4500', '#FF8C00'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

// ✅ Componente: Vista Productos
function ProductosView({ data }) {
  const barData = [
    { name: 'Sem 1', valor: data.productos[0].valor },
    { name: 'Sem 2', valor: data.productos[1].valor },
    { name: 'Sem 3', valor: data.productos[2].valor },
    { name: 'Sem 4', valor: data.productos[3].valor },
  ];

  const lineData = [
    { name: 'Sem 1', valor: data.productos[0].valor },
    { name: 'Sem 2', valor: data.productos[1].valor },
    { name: 'Sem 3', valor: data.productos[2].valor },
    { name: 'Sem 4', valor: data.productos[3].valor },
  ];

  return (
    <>
      {/* Tarjeta resumen */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ color: '#3B2E2A', marginBottom: '0.5rem' }}>Total Productos</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0F1A24' }}>
          {data.productos.reduce((sum, item) => sum + item.valor, 0)}
        </p>
      </div>

      {/* Gráficas lado a lado */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        {/* Gráfica de Barras */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Productos por Período</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#0F1A24">
                <LabelList dataKey="valor" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Líneas */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            flex: '1 1 400px',
            minWidth: '300px',
            width: '100%',
          }}
        >
          <h2 style={{ color: '#3B2E2A', marginBottom: '1rem', textAlign: 'center' }}>Tendencia de Productos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#0F1A24" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

// ✅ DASHBOARD PRINCIPAL
export default function Dashboard() {
  const [view, setView] = useState('general');
  const [filter, setFilter] = useState('semanal');
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    const name = localStorage.getItem('userEmail') || 'Admin';
    setUserName(name.split('@')[0] || 'Admin');
  }, []);

  const currentData = dataByPeriod[filter];

  return (
    <div
      style={{
        padding: '0 2rem 2rem',
        backgroundColor: '#F5EFE6',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Bienvenida decorada */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
          marginTop: '-0.1rem',
          position: 'relative',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(59, 46, 42, 0.08)',
          border: '1px solid #e0d9d2',
        }}
      >
        <h1
          style={{
            color: '#3B2E2A',
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          ¡Bienvenido al sistema!
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#666',
            fontSize: '1.2rem',
            fontWeight: '600',
            padding: '0.3rem',
            borderRadius: '8px',
            backgroundColor: '#f8f6f4',
            border: '1px solid #e0d9d2',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>👤</span>
          <span>{userName}</span>
        </div>
      </div>

      {/* Botones pequeños, alineados a la izquierda */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          paddingLeft: '1rem',
        }}
      >
        <button
          onClick={() => setView('general')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: view === 'general' ? '#F4B73F' : '#D86633',
            color: view === 'general' ? '#3B2E2A' : 'white',
            border: 'none',
            borderRadius: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: view === 'general' ? '0 4px 12px rgba(244, 183, 63, 0.2)' : 'none',
          }}
        >
          General
        </button>
        <button
          onClick={() => setView('ventas')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: view === 'ventas' ? '#F4B73F' : '#D86633',
            color: view === 'ventas' ? '#3B2E2A' : 'white',
            border: 'none',
            borderRadius: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: view === 'ventas' ? '0 4px 12px rgba(244, 183, 63, 0.2)' : 'none',
          }}
        >
          Ventas
        </button>
        <button
          onClick={() => setView('compras')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: view === 'compras' ? '#F4B73F' : '#D86633',
            color: view === 'compras' ? '#3B2E2A' : 'white',
            border: 'none',
            borderRadius: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: view === 'compras' ? '0 4px 12px rgba(244, 183, 63, 0.2)' : 'none',
          }}
        >
          Compras
        </button>
        <button
          onClick={() => setView('productos')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: view === 'productos' ? '#F4B73F' : '#0F1A24',
            color: view === 'productos' ? '#3B2E2A' : 'white',
            border: 'none',
            borderRadius: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: view === 'productos' ? '0 4px 12px rgba(244, 183, 63, 0.2)' : 'none',
          }}
        >
          Productos
        </button>
      </div>

      {/* Filtro y Exportar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0 1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label
            htmlFor="filter"
            style={{
              color: '#3B2E2A',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            Filtrar por período:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #e0d9d2',
              backgroundColor: 'white',
              color: '#3B2E2A',
              fontSize: '1rem',
              minWidth: '150px',
            }}
          >
            <option value="semanal">Semanal</option>
            <option value="quincenal">Quincenal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        <button
          onClick={() => alert(`Reporte ${view} (${filter}) exportado a PDF.`)}
          style={{
            padding: '0.75rem 1.2rem',
            backgroundColor: '#F4B73F',
            color: '#3B2E2A',
            border: 'none',
            borderRadius: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(244, 183, 63, 0.2)',
          }}
        >
          📤 Exportar PDF
        </button>
      </div>

      {/* Vista actual */}
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {view === 'general' && <GeneralView data={currentData} />}
        {view === 'ventas' && <VentasView data={currentData} />}
        {view === 'compras' && <ComprasView data={currentData} />}
        {view === 'productos' && <ProductosView data={currentData} />}
      </div>
    </div>
  );
}