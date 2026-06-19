// Merchandise cart (localStorage-backed demo)
import { showToast } from './toast.js';

const STORAGE_KEY = 'bp_cart';

function getCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCart(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore quota errors */ }
}

function addToCart(product, price) {
    const cart = getCart();
    cart.push({ product, price: Number(price), addedAt: Date.now() });
    saveCart(cart);
    const total = cart.reduce((s, it) => s + (it.price || 0), 0);
    showToast(`"${product}" añadido — total $${total} (${cart.length} ítems)`, 'success');
}

function loadMoreProducts() {
    showToast('Más merch oficial estará disponible pronto', 'info');
}

export function init() { /* no-op */ }

export function destroy() { /* no-op */ }

export const actions = {
    'add-to-cart': (el) => addToCart(el.dataset.product, el.dataset.price),
    'load-more-products': () => loadMoreProducts()
};
