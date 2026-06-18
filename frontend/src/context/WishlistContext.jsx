import { createContext, useContext, useState, useEffect, useCallback } from "react";
import useAuth from "../context/AuthContext";

const API = "http://localhost:8000";
const WishlistContext = createContext(null);

function fetchWishlist(userId, setter) {
  fetch(`${API}/api/wishlist.php?user_id=${userId}`)
    .then((r) => r.json())
    .then((d) => { if (d.success) setter(d.wishlist); })
    .catch(() => {});
}

function syncWishlistToAPI(userId, local) {
  if (local.length === 0) return Promise.resolve();
  return Promise.all(
    local.map((item) =>
      fetch(`${API}/api/wishlist.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: item.id,
          product_data: item,
        }),
      })
    )
  ).then(() => {});
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist on mount / user change
  useEffect(() => {
    if (user) {
      const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
      syncWishlistToAPI(user.id, local).then(() => {
        localStorage.removeItem("wishlist");
        fetchWishlist(user.id, setWishlist);
      });
    } else {
      setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    }
  }, [user?.id]);

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = useCallback((product) => {
    if (user) {
      fetch(`${API}/api/wishlist.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          product_data: product,
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) fetchWishlist(user.id, setWishlist);
        })
        .catch(() => {});
    } else {
      setWishlist((prev) => {
        const exists = prev.find((item) => item.id === product.id);
        if (exists) {
          return prev.filter((item) => item.id !== product.id);
        }
        return [...prev, product];
      });
    }
  }, [user]);

  const isInWishlist = useCallback((id) => wishlist.some((item) => item.id === id), [wishlist]);

  const removeFromWishlist = useCallback((id) => {
    if (user) {
      fetch(`${API}/api/wishlist.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, product_id: id }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) fetchWishlist(user.id, setWishlist);
        })
        .catch(() => {});
    } else {
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    }
  }, [user]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export default function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
