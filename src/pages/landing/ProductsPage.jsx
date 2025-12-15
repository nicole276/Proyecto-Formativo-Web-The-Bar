import { useState } from 'react';
import TopNav from '../../components/Layout/TopNav';
import ProductDetailModal from './ProductDetailModal';
import ProductCard from './ProductCard';


const allProducts = [
  { id: 1, name: 'Ron Medellín', category: 'Licores', price: 71000, image: 'https://exitocol.vtexassets.com/arquivos/ids/29473867/Ron-Extra-Anejo-8-Anos-Botella-X-750ml-32203_a.jpg?v=638895004756400000' },
  { id: 2, name: 'Cerveza Águila', category: 'Licores', price: 21000, image: 'https://megatiendas.vtexassets.com/arquivos/ids/175749/7702004001924.jpg.jpg?v=638799922615200000' },
  { id: 3, name: 'Cigarrillos MARLBORO Rojo cajetilla (20 und)', category: 'Cigarrería', price: 12900, image: 'https://exitocol.vtexassets.com/arquivos/ids/29493666/Cigarrillo-Rojo-MARLBORO-20-Unidad-140072_a.jpg?v=638895964402930000' },
  { id: 4, name: 'Cigarrillos MARLBORO Gold cajetilla (20 und)', category: 'Cigarrería', price: 12900, image: 'https://exitocol.vtexassets.com/arquivos/ids/29493668/Cigarrillo-Gold-Ks-Box-MARLBORO-20-Unidad-249479_a.jpg?v=638895964416600000' },
  { id: 5, name: 'Galletas FESTIVAL surtida x16und (537 gr)', category: 'Confitería', price: 18150, image: 'https://exitocol.vtexassets.com/arquivos/ids/31753568/Galleta-Surtida-1413578_a.jpg?v=638986365100400000' },
  { id: 6, name: 'Chocolatina JET mini surtidas (144 gr)', category: 'Confitería', price: 20000, image: 'https://exitocol.vtexassets.com/arquivos/ids/31323559/Chocolates-Mini-X-24-Und-532015_a.jpg?v=638962262819830000' },
  { id: 7, name: 'Tequila DON JULIO blanco (700 ml)', category: 'Licores', price: 239900, image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTXKdp4hwqlBMr4OgwD2KoRJke_6-d0Fhg5Nm3Fgs_IuCtr8dsgajbNuoBaG_HuORUb8Y28RWdrNoUfSk-G_gp1zT17tXqkzTGLF4bP8HDxDuJEsE5One5b' },
  { id: 8, name: 'Cerveza HEINEKEN en lata x6und (1614 ml)', category: 'Licores', price: 13500, image: 'https://exitocol.vtexassets.com/arquivos/ids/29608157/Cerveza-HEINEKEN-Sixpac-1614-ml-3736186_a.jpg?v=638905401740870000' },
  { id: 9, name: 'Cigarrillos LUCKY STRIKE gin XL media cajetilla (10 und)', category: 'Cigarrería', price: 6700, image: 'https://exitocol.vtexassets.com/arquivos/ids/29493724/Cigllo-Cjtlla-Media-Gin-XL-LUCKY-STRIKE-10-und-3127352_a.jpg?v=638895967466170000' },
  { id: 10, name: 'Cigarrillos LUCKY STRIKE alaska media cajetilla (10 und)', category: 'Cigarrería', price: 6700, image: 'https://exitocol.vtexassets.com/arquivos/ids/29493760/Cigarrillo-Alaska-LUCKY-STRIKE-10-und-3373211_a.jpg?v=638895967700670000' },
  { id: 11, name: 'Chupetas BON BON BUM surtidos con chicle', category: 'Confitería', price: 9940, image: 'https://exitocol.vtexassets.com/arquivos/ids/31298111/Bon-Bon-Bum-Surtido-165524_a.jpg?v=638961628878270000' },
  { id: 12, name: 'Caramelos BARRILETE barras sabor frutal', category: 'Confitería', price: 4790, image: 'https://exitocol.vtexassets.com/arquivos/ids/31323694/Caramelo-Barrilete-Pqte-X-15-321758_a.jpg?v=638962263159000000' },
  { id: 13, name: 'Whisky BUCHANAN S deluxe 12 Años (750 ml)', category: 'Licores', price: 175900, image: 'https://exitocol.vtexassets.com/arquivos/ids/28218203/Whisky-Buchanans-Deluxe-750-ml-24334_a.jpg?v=638845773154330000' },
  { id: 14, name: 'Refajo COLA Y POLA lata x6und (1980 ml)', category: 'Licores', price: 9980, image: 'https://exitocol.vtexassets.com/arquivos/ids/26655486/Cola-Y-Pola-Lata-Sixpack-330ml-C-u-449804_a.jpg?v=638739774001330000', category: 'Licores', price: 9080, image: 'https://exitocol.vtexassets.com/arquivos/ids/26655486/Cola-Y-Pola-Lata-Sixpack-330ml-C-u-449804_a.jpg?v=638739774001330000' },
  { id: 15, name: 'Cigarrillos MARLBORO Vista summer cajetilla (20 und', category: 'Cigarrería', price: 13200, image: 'https://exitocol.vtexassets.com/arquivos/ids/29493682/Cigarrillo-Ice-Express-Summer-MARLBORO-20-Unidad-34473_a.jpg?v=638895964505500000' },
  { id: 16, name: 'Cigarrillos ROTHMANS blanco media cajetilla (10 und)', category: 'Cigarrería', price: 4400, image: 'https://exitocol.vtexassets.com/arquivos/ids/29493704/Cigarrillo-Blanco-ROTHMANS-10-und-1460167_a.jpg?v=638895967332300000' },
  { id: 17, name: 'Galletas OREO original x12und (432 gr)', category: 'Confitería', price: 15500, image: 'https://exitocol.vtexassets.com/arquivos/ids/29664232/Galletas-Dulces-Oreo-Original-X-12-Und-X-36-G-Cu-313461_a.jpg?v=638908000939330000' },
  { id: 18, name: 'Galletas NOEL rellena con crema (432 gr)', category: 'Confitería', price: 20000, image: 'https://exitocol.vtexassets.com/arquivos/ids/31753390/Galleta-Wafer-De-Vainilla-X-490-gr-522833_a.jpg?v=638986363561870000' },
];

// ... imports y datos ...

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  const [viewingProduct, setViewingProduct] = useState(null);// ✅ 8 productos por página (ajustable)

  // Filtrar productos
  const filteredProducts = selectedCategory === 'todos'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories = ['todos', 'Licores', 'Cigarrería', 'Confitería'];

  return (
    <div style={{ 
      paddingTop: '80px',
      paddingBottom: '70px',
      backgroundColor: '#FFF9F0',
      minHeight: '100vh',
    }}>
      <TopNav />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: 'white' }}>
        <h1 style={{ color: '#3B2E2A', fontSize: '2rem', fontWeight: '800' }}>Nuestros Productos</h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>Descubre nuestra selección premium</p>
      </div>

      {/* Filtros */}
      <div style={{ padding: '1rem', backgroundColor: '#fff', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1); // ✅ Reinicia a página 1 al cambiar categoría
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedCategory === cat ? '#F4B73F' : 'white',
                color: selectedCategory === cat ? 'white' : '#3B2E2A',
                border: `1px solid ${selectedCategory === cat ? '#F4B73F' : '#e0d9d2'}`,
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '100px',
              }}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Productos */}
      <div style={{ padding: '2rem 1rem' }}>
        {currentProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            No hay productos en esta categoría.
          </p>
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.8rem',
            justifyContent: 'center'
          }}>
            {currentProducts.map(p => (
              <ProductCard key={p.id} product={p} onView={setViewingProduct} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.4rem',
            marginTop: '2rem',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e0d9d2',
                backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
                color: currentPage === 1 ? '#999' : '#3B2E2A',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Mostrar solo páginas relevantes (1, 2, 3, ..., última)
              if (page === 1 || page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid #e0d9d2',
                      backgroundColor: currentPage === page ? '#F4B73F' : 'white',
                      color: currentPage === page ? 'white' : '#3B2E2A',
                      fontWeight: currentPage === page ? '700' : 'normal',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    {page}
                  </button>
                );
              }
              if (page === 2 && currentPage > 3) return <span key="sep1">…</span>;
              if (page === totalPages - 1 && currentPage < totalPages - 2) return <span key="sep2">…</span>;
              return null;
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e0d9d2',
                backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
                color: currentPage === totalPages ? '#999' : '#3B2E2A',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <footer style={{
        backgroundColor: '#3B2E2A',
        color: 'white',
        padding: '1rem 2rem', // ✅ Reducido verticalmente
        textAlign: 'center',
        position: 'fixed',     // ✅ Pega al fondo
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
      }}>
        <p>© 2025 THE BAR — Todos los derechos reservados</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Licores • Cigarrería • Confitería</p>
      </footer>
      
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </div>
  );
}