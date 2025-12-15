import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F5EFE6',
        overflow: 'hidden', 
      }}
    >
      <Sidebar />
      <div
        style={{
          flexGrow: 1,
          marginLeft: '200px',
          overflow: 'hidden', 
        }}
      >
        <main
          style={{
            padding: '1.5rem',
            marginTop: '0.5rem', 
            minHeight: 'calc(100vh - 2rem)', 
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}