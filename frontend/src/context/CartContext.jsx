import { createContext, useContext, useState, useEffect, useCallback } from "react";
import useAuth from "../context/AuthContext";

const API = "http://localhost:8000";
const CartContext = createContext(null);

function fetchCart(userId, setter) {
  fetch(`${API}/api/cart.php?user_id=${userId}`)
    .then((r) => r.json())
    .then((d) => { if (d.success) setter(d.cart); })
    .catch(() => {});
}

function syncCartToAPI(userId, local) {
  if (local.length === 0) return Promise.resolve();
  return Promise.all(
    local.map((item) =>
      fetch(`${API}/api/cart.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: item.id,
          quantity: item.qty || 1,
          product_data: (() => { const { qty, ...rest } = item; return rest; })(),
        }),
      })
    )
  ).then(() => {});
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart on mount / user change
  useEffect(() => {
    if (user) {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      syncCartToAPI(user.id, local).then(() => {
        localStorage.removeItem("cart");
        fetchCart(user.id, setCart);
      });
    } else {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    }
  }, [user?.id]);

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  const apiCall = useCallback(async (method, extra) => {
    if (!user) return;
    try {
      await fetch(`${API}/api/cart.php`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, ...extra }),
      });
      fetchCart(user.id, setCart);
    } catch (e) {}
  }, [user]);

  const addToCart = useCallback((product) => {
    if (user) {
      apiCall("POST", {
        product_id: product.id,
        quantity: 1,
        product_data: product,
      });
    } else {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });
    }
  }, [user, apiCall]);

  const removeCart = useCallback((id) => {
    if (user) {
      apiCall("DELETE", { product_id: id });
    } else {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  }, [user, apiCall]);

  const increase = useCallback((id) => {
    if (user) {
      const item = cart.find((i) => i.id === id);
      if (!item) return;
      apiCall("PUT", { product_id: id, quantity: item.qty + 1, product_data: (() => { const { qty, ...rest } = item; return rest; })() });
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    }
  }, [user, apiCall, cart]);

  const decrease = useCallback((id) => {
    if (user) {
      const item = cart.find((i) => i.id === id);
      if (!item || item.qty <= 1) return;
      apiCall("PUT", { product_id: id, quantity: item.qty - 1, product_data: (() => { const { qty, ...rest } = item; return rest; })() });
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.qty > 1
            ? { ...item, qty: item.qty - 1 }
            : item
        )
      );
    }
  }, [user, apiCall, cart]);

  const clearCart = useCallback(() => {
    if (user) {
      Promise.all(
        cart.map((item) =>
          fetch(`${API}/api/cart.php`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, product_id: item.id }),
          })
        )
      ).then(() => fetchCart(user.id, setCart));
    } else {
      setCart([]);
    }
  }, [user, cart]);

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.qty || 1) * (item.price - (item.price * item.discount) / 100),
    0
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, removeCart, increase, decrease, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export default function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
