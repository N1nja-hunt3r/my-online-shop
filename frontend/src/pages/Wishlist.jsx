import { useState } from "react";
import useWishlist from "../context/WishlistContext";
import ImageViewer from "../components/ImageViewer";
import "./Wishlist.css";

function Wishlist() {
  const [viewImg, setViewImg] = useState(null);
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) return <div className="wishlist-page"><h1>Wishlist</h1><p className="wishlist-empty">Your wishlist is empty.</p></div>;

  return (
    <div className="wishlist-page">
      <h1>Wishlist ({wishlist.length} items)</h1>
      <div className="wishlist-grid">
        {wishlist.map((item) => {
          const discounted = item.price - (item.price * item.discount) / 100;
          return (
            <div key={item.id} className="wishlist-item">
              <img className="wishlist-item-img" src={item.image} alt={item.name} onClick={() => setViewImg(item.image)} onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=N"; }} />
              <h3>{item.name}</h3>
              <p className="wishlist-brand">{item.brand}</p>
              <p className="wishlist-price">₹{discounted.toLocaleString()}</p>
              <button className="remove-wishlist-btn" onClick={() => removeFromWishlist(item.id)} type="button">Remove</button>
            </div>
          );
        })}
      </div>
      {viewImg && <ImageViewer src={viewImg} onClose={() => setViewImg(null)} />}
    </div>
  );
}

export default Wishlist;
