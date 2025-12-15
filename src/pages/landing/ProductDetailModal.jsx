// src/pages/landing/ProductDetailModal.jsx
export default function ProductDetailModal({ product, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '400px', // ✅ Un poco más ancho para imágenes grandes
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen optimizada */}
        <div
          style={{
            aspectRatio: '4 / 3', // ✅ Proporción flexible y natural
            backgroundColor: '#f8f6f4',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain', // ✅ Muestra imagen completa (no recorta)
              objectPosition: 'center',
              padding: '12px', // ✅ Espacio elegante alrededor
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '1.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(2px)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '1.8rem 1.5rem' }}>
          {/* Categoría */}
          <span
            style={{
              backgroundColor: '#F4B73F',
              color: 'white',
              padding: '0.25rem 0.9rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'inline-block',
            }}
          >
            {product.category}
          </span>

          {/* Nombre */}
          <h2
            style={{
              color: '#3B2E2A',
              fontSize: '1.7rem',
              margin: '0.8rem 0 0.6rem',
              fontWeight: '800',
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h2>

          {/* Descripción */}
          <p
            style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '1.4rem',
              fontSize: '1rem',
              hyphens: 'auto',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description || 'Producto de alta calidad disponible en THE BAR.'}
          </p>

          {/* Precio */}
          <div
            style={{
              backgroundColor: '#FFF9F0',
              border: '1px solid #ffe0b2',
              padding: '1.1rem',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '700',
              fontSize: '1.5rem',
              color: '#D86633',
              marginBottom: '1.5rem',
            }}
          >
            Precio: ${product.price.toLocaleString()}
          </div>

          {/* Botón */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.85rem 2.2rem',
                backgroundColor: '#3B2E2A',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px',
                boxShadow: '0 4px 8px rgba(59, 46, 42, 0.1)',
                transition: 'background 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}