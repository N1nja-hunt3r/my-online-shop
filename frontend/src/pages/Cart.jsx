import { useState } from "react";
import useCart from "../context/CartContext";
import ImageViewer from "../components/ImageViewer";
import "./Cart.css";

function Cart() {
  const [viewImg, setViewImg] = useState(null);
  const { cart, removeCart, increase, decrease, clearCart, totalPrice } = useCart();

  if (cart.length === 0) return <div className="cart-page"><h1>Cart</h1><p className="cart-empty">Your cart is empty.</p></div>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Cart ({cart.length} items)</h1>
        <button className="clear-btn" onClick={clearCart} type="button">Clear Cart</button>
      </div>
      <div className="cart-items">
        {cart.map((item) => {
          const discounted = item.price - (item.price * item.discount) / 100;
          return (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} onClick={() => setViewImg(item.image)} onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=N"; }} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-brand">{item.brand}</p>
                <p className="cart-item-price">₹{discounted.toLocaleString()}</p>
              </div>
              <div className="cart-qty">
                <button onClick={() => decrease(item.id)} type="button">-</button>
                <span>{item.qty}</span>
                <button onClick={() => increase(item.id)} type="button">+</button>
              </div>
              <p className="cart-item-total">₹{(discounted * item.qty).toLocaleString()}</p>
              <button className="remove-btn" onClick={() => removeCart(item.id)} type="button">✕</button>
            </div>
          );
        })}
      </div>
      <div className="cart-summary">
        <h3>Total: ₹{totalPrice.toLocaleString()}</h3>
        <button className="checkout-btn" type="button">Proceed to Checkout</button>
      </div>
      {viewImg && <ImageViewer src={viewImg} onClose={() => setViewImg(null)} />}
    </div>
  );
}

export default Cart;
