export default function ProductCard({ product, onView }) {
  return (
    <div
      onClick={() => onView(product)}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        maxWidth: '300px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{ 
        aspectRatio: '4 / 3',
        overflow: 'hidden',
        backgroundColor: '#f8f6f4',
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            padding: '12px',
          }}
        />
      </div>
      
      <div style={{ 
        padding: '1.2rem 1rem', 
        textAlign: 'center',
        minHeight: '110px',
      }}>
        <h3 
          style={{ 
            color: '#3B2E2A', 
            fontSize: '1.05rem', 
            margin: '0 0 0.4rem',
            fontWeight: '700',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </h3>
        
        <span 
          style={{ 
            backgroundColor: '#F4B73F', 
            color: 'white', 
            padding: '0.15rem 0.6rem', 
            borderRadius: '20px', 
            fontSize: '0.8rem',
            fontWeight: '600',
          }}
        >
          {product.category}
        </span>
        
        <div style={{ 
          marginTop: '0.8rem', 
          color: '#D86633', 
          fontWeight: '700',
          fontSize: '1.15rem',
        }}>
          ${product.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
}