import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import RolesPage from '../pages/roles/RolesPage';
import UsersPage from '../pages/users/UsersPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import ProductsPage from '../pages/products/ProductsPage';
import SuppliersPage from '../pages/suppliers/SuppliersPage';
import ClientsPage from '../pages/clients/ClientsPage';
import PurchasesPage from '../pages/purchases/PurchasesPage';
import SalesPage from '../pages/sales/SalesPage';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/landing/HomePage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="/roles" element={<Layout />}>
          <Route index element={<RolesPage />} />
        </Route>

        <Route path="/usuarios" element={<Layout />}>
          <Route index element={<UsersPage />} />
        </Route>

        <Route path="/categorias" element={<Layout />}>
          <Route index element={<CategoriesPage />} />
        </Route>

        <Route path="/productos" element={<Layout />}>
          <Route index element={<ProductsPage />} />
        </Route>

        <Route path="/proveedores" element={<Layout />}>
          <Route index element={<SuppliersPage />} />
        </Route>

        <Route path="/clientes" element={<Layout />}>
          <Route index element={<ClientsPage />} />
        </Route>

        <Route path="/compras" element={<Layout />}>
          <Route index element={<PurchasesPage />} />
        </Route>

        <Route path="/ventas" element={<Layout />}>
          <Route index element={<SalesPage />} />
        </Route>

        {/* Redirigir cualquier otra ruta al dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}