// src/pages/landing/HomePage.jsx
import { useState, useEffect } from 'react';
import TopNav from '../../components/Layout/TopNav';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Imágenes para el carrusel
const galleryImages = [
  {
    id: 1,
    url: 'https://media.istockphoto.com/id/459018635/es/foto/botellas-de-bebidas-alcoh%C3%B3licas-en-un-fondo-blanco.jpg?s=612x612&w=0&k=20&c=Uz1e2Bg-9qLyPogZ_Rqb5w6KrJvcy7y8E6VTReIasKE=',
    title: 'THE BAR',
    description: 'Licores • Cigarrería • Confitería'
  },
  {
    id: 2,
    url: 'https://media.istockphoto.com/id/586376654/es/foto/frascos-de-marcas-de-gran-variedad-de-licores-de-alta-graduaci%C3%B3n.jpg?s=612x612&w=0&k=20&c=6ONb_sB-0KMyHnIU2o6WcopMfY08ivGieemGhu6ju6U=',
    title: 'THE BAR',
    description: 'Licores • Cigarrería • Confitería'
  },
  {
    id: 3,
    url: 'https://licoreria247.pe/wp-content/uploads/2020/01/Horizontal-Adwrods-licoreria247-promociones-de-licores.png',
    title: 'THE BAR',
    description: 'Licores • Cigarrería • Confitería'
  }
];

// Imágenes para la galería
const photoGallery = [
  {
    id: 1,
    url: 'https://licoresjunior.com/wp-content/uploads/2023/12/Licor-Ron-Viejo-de-Caldas-750-Nueva-Imagen.jpg',
    title: 'Ron Viejo de Cladas'
  },
  {
    id: 2,
    url: 'https://laprincipaldelicores.com/cdn/shop/files/ronmedellinpink750ml_6db5ffea-e0fc-42d6-8047-6e0b9fc4e71b.png?v=1709734443',
    title: 'Ron MEDELLIN - Pink'
  },
  {
    id: 3,
    url: 'https://media.surtiplaza.co/dimen/7707096271682.png',
    title: 'Smirnoff - Lulo'
  },
  {
    id: 4,
    url: 'https://laprincipaldelicores.com/cdn/shop/products/tequilajosecuervooroespecial375ml.png?v=1716500852&width=823',
    title: 'Jose Cuervo'
  },
  {
    id: 5,
    url: 'https://privilegiogastrobar.com/cdn/shop/files/tequila-don-julio-70-cristalino-700-ml-5000281056265-2.webp?v=1720221084',
    title: 'Don Julio 70'
  },
  {
    id: 6,
    url: 'https://laprincipaldelicores.com/cdn/shop/products/tequiladonjulioblanco.png?v=1679436602',
    title: 'Don Julio'
  }
];

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <TopNav />

      {/* Carrusel en la sección principal */}
      <div style={{ 
        position: 'relative', 
        height: '400px',
        overflow: 'hidden'
      }}>
        
        {/* Imagen del carrusel */}
        <img
          src={galleryImages[currentImageIndex].url}
          alt="THE BAR"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'opacity 0.5s ease'
          }}
        />

        {/* Overlay con texto */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '1rem',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1))'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            margin: '0 0 0.5rem',
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
          }}>
            THE BAR
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            fontWeight: '500', 
            margin: 0,
            textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
          }}>
            Licores • Cigarrería • Confitería
          </p>
        </div>

        {/* Botones de navegación */}
        <button
          onClick={prevImage}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <ArrowBackIosIcon fontSize="medium" />
        </button>

        <button
          onClick={nextImage}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <ArrowForwardIosIcon fontSize="medium" />
        </button>

        {/* Indicadores/puntos */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 10
        }}>
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: '2px solid white',
                backgroundColor: index === currentImageIndex ? '#F4B73F' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                if (index !== currentImageIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentImageIndex) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Galería de fotos simple */}
      <div style={{ 
        padding: '3rem 1rem', 
        backgroundColor: 'white',
        borderTop: '1px solid #f0f0f0'
      }}>
        <h2 style={{ 
          color: '#3B2E2A', 
          fontSize: '2rem', 
          fontWeight: '700', 
          textAlign: 'center', 
          marginBottom: '2rem'
        }}>
          Nuestros Productos
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {photoGallery.map((photo) => (
            <div
              key={photo.id}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                backgroundColor: '#f8f6f4'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ 
                height: '250px', 
                overflow: 'hidden',
                backgroundColor: '#f0f0f0'
              }}>
                <img
                  src={photo.url}
                  alt={photo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ 
                padding: '1rem',
                textAlign: 'center',
                backgroundColor: 'white'
              }}>
                <h3 style={{ 
                  color: '#3B2E2A', 
                  fontSize: '1.1rem', 
                  fontWeight: '600',
                  margin: '0 0 0.3rem'
                }}>
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Texto descriptivo debajo de la galería */}
        <div style={{ 
          maxWidth: '800px', 
          margin: '3rem auto 0',
          textAlign: 'center',
          padding: '0 1rem'
        }}>
          <p style={{ 
            color: '#666', 
            fontSize: '1.1rem', 
            lineHeight: 1.6,
            margin: 0
          }}>
            En THE BAR nos enorgullece ofrecer una amplia selección de productos de calidad. 
            Desde los mejores licores hasta deliciosas confiterías, 
            cada visita es una experiencia única.
          </p>
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
              <h3 style={{ color: '#3B2E2A', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>Misión</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>
                Ofrecer productos de alta calidad en licores, cigarrería y confitería, con un servicio cálido y profesional que refleje la esencia de THE BAR.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#3B2E2A', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>Visión</h3>
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

      {/* Mapa y Dirección */}
      <div style={{ padding: '2rem 1rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
        <h2 style={{ 
          color: '#3B2E2A', 
          fontSize: '1.8rem', 
          fontWeight: '700', 
          textAlign: 'center', 
          marginBottom: '1.2rem' 
        }}>
          📍 Nuestra Ubicación
        </h2>

        {/* Dirección destacada */}
        <div style={{ 
          backgroundColor: '#fdfcf9', 
          border: '1px solid #f0ece7', 
          borderRadius: '12px', 
          padding: '1.2rem', 
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          <p style={{ 
            color: '#3B2E2A', 
            fontSize: '1.1rem', 
            fontWeight: '600',
            lineHeight: 1.5,
            margin: 0
          }}>
            <strong>Calle 57B # 17A - 25</strong><br />
            Barrio 13 de Noviembre, Buenos Aires
          </p>
        </div>

        {/* Mapa */}
        <div
          style={{
            height: '300px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e0d9d2',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
            title="Ubicación de THE BAR"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#3B2E2A', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
        <p>© 2025 THE BAR — Todos los derechos reservados</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Licores • Cigarrería • Confitería</p>
      </footer>
    </div>
  );
}