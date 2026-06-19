import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './state/CartContext';
import { CheckoutProvider } from './state/CheckoutContext';
import { CheckoutOverlay } from './components/checkout/CheckoutOverlay';
import { StorefrontPage } from './pages/StorefrontPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <CartProvider>
      <CheckoutProvider>
        <Routes>
          <Route path="/" element={<StorefrontPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<StorefrontPage />} />
        </Routes>
        {/* Hosted checkout overlay — opened from the cart, available app-wide */}
        <CheckoutOverlay />
      </CheckoutProvider>
    </CartProvider>
  );
}
