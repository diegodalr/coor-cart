import React from 'react';
import { createRoot } from 'react-dom/client';
import Cart from '../components/cart';

const container = document.getElementById('woocoor-cart-block');
const root = createRoot(container);
root.render(<Cart />);