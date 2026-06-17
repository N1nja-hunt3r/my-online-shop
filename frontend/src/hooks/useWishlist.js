import { useState, useEffect } from "react";

const useWishlist = () => {
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return { wishlist, toggleWishlist, isInWishlist, removeFromWishlist };
};

export default useWishlist;
