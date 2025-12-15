// src/pages/landing/HomePage.jsx
import { useState } from 'react';
import TopNav from '../../components/Layout/TopNav';
import ProductDetailModal from './ProductDetailModal';
import LiquorIcon from '@mui/icons-material/Liquor';

// Datos simulados
const featuredProducts = [
  {
    id: 1,
    name: 'Licor de Caña Molendero',
    category: 'Licores',
    price: 55000,
    image: 'https://licoreslarebaja.com/wp-content/uploads/2025/07/Licor-de-Cana-Molendero-700ml-1.png',
    description: 'Licor de Caña Sin Azúcar 700 ml – 24% vol alcohol. La caña y el licor destilado de sus venas son una canción de la existencia con el ritmo esperanzador de la alegría, de la comunidad, de la vida eterna en infinitos ciclos de engranajes, que en cada vuelta extrae lo mejor de nuestras almas',
  },
  {
    id: 2,
    name: 'Cigarrillo Chesterfield Blue - Medio',
    category: 'Cigarrería',
    price: 18000,
    image: 'https://carulla.vtexassets.com/arquivos/ids/22117494/Cigllo-Cjtilla-Media-Blanco-Azul-MARLBORO-10-und-3521037_a.jpg?v=638895967920470000',
    description: 'Sabor intenso y calidad internacional.',
  },
  {
    id: 3,
    name: 'Galletas Festival',
    category: 'Confitería',
    price: 2500,
    image: 'https://mundodulces17.com/wp-content/uploads/2023/03/festival-chocolate-x-4.jpg',
    description: 'Deliciosas galletas rellenas de chocolate.',
  },
];

export default function HomePage() {
  const [viewingProduct, setViewingProduct] = useState(null);

  return (
    <div style={{ paddingTop: '70px', backgroundColor: '#3B2E2A' }}>
      <TopNav />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#3B2E2A' }}>
        <div
            style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#F4B73F',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 6px 20px rgba(244, 183, 63, 0.4)',
            }}
            >
            <LiquorIcon sx={{ fontSize: '3.5rem', color: '#3B2E2A' }} />
            </div>
        <h1 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0 0 0.5rem' }}>
          THE BAR
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>
          Licores • Cigarrería • Confitería
        </p>
      </div>

      {/* Productos destacados */}
        <div style={{ padding: '2rem 1rem', backgroundColor: '#fff' }}>
        <h2 style={{ color: '#3B2E2A', fontSize: '1.8rem', fontWeight: '700', textAlign: 'center', marginBottom: '2rem' }}>
            Productos Destacados
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {featuredProducts.map((p) => (
            <div
                key={p.id}
                onClick={() => setViewingProduct(p)}
                style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
                {/* Imagen optimizada */}
                <div style={{ height: '400px', overflow: 'hidden', backgroundColor: '#f8f6f4' }}>
                <img
                    src={p.image}
                    alt={p.name}
                    style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                </div>
                <div style={{ padding: '1rem' }}>
                <h3 style={{ color: '#3B2E2A', fontSize: '1.2rem', margin: '0 0 0.3rem' }}>{p.name}</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 0.5rem', height: '2.4rem', overflow: 'hidden' }}>
                    {p.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#D86633', fontWeight: '700', fontSize: '1.1rem' }}>
                    ${p.price.toLocaleString()}
                    </span>
                    <span style={{ backgroundColor: '#F4B73F', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                    {p.category}
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>

      {/* Sobre nosotros */}
      <div style={{ padding: '3rem 1rem', backgroundColor: '#f8f6f4' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#3B2E2A', fontSize: '2rem', fontWeight: '700', textAlign: 'center', marginBottom: '2rem' }}>
            Sobre Nosotros
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ color: '#3B2E2A', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>misión</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                Ofrecer productos de alta calidad en licores, cigarrería y confitería, con un servicio cálido y profesional que refleje la esencia de THE BAR.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#3B2E2A', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>visión</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                Ser el referente en el barrio para los amantes de los buenos tragos, el tabaco premium y los snacks de calidad.
              </p>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#3B2E2A', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>Horario de atención</h3>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Lunes a Sábado: 10:00 AM - 10:00 PM<br />Domingos: 12:00 PM - 8:00 PM</p>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div style={{ padding: '2rem 1rem', backgroundColor: 'white' }}>
        <h2 style={{ color: '#3B2E2A', fontSize: '1.8rem', fontWeight: '700', textAlign: 'center', marginBottom: '1.5rem' }}>
          Ubicación
        </h2>
        <div
          style={{
            height: '300px',
            backgroundColor: '#eee',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e0d9d2',
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.742715672671!2d-75.5636339!3d6.2425227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429a1e13c3c5b%3A0x4f8d1b3b3b3b3b3b!2sTHE%20BAR!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#3B2E2A', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
        <p>© 2025 THE BAR — Todos los derechos reservados</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Licores • Cigarrería • Confitería</p>
      </footer>

      {/* Modal de producto */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </div>
  );
}