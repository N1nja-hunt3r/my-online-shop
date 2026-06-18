import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
import useCart from "../context/CartContext";
import "./Checkout.css";

const API = "http://localhost:8000";

function Checkout() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" />;
  if (cart.length === 0) return <Navigate to="/cart" />;

  const subtotal = totalPrice;
  const gst = Math.round(subtotal * 0.18);
  const deliveryCharge = subtotal >= 500 ? 0 : 49;
  const total = subtotal + gst + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!address.trim()) return setError("Delivery address is required.");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/order.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, address: address.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        navigate("/order-confirmation", { state: { order: data.order } });
      } else {
        setError(data.error || "Failed to place order");
      }
    } catch {
      setError("Could not connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-layout">
        <div className="checkout-form-section">
          <h1>Checkout</h1>
          {error && <p className="checkout-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="checkout-field">
              <label>Full Name</label>
              <input type="text" value={user.name || ""} disabled />
            </div>
            <div className="checkout-field">
              <label>Email</label>
              <input type="email" value={user.email || ""} disabled />
            </div>
            <div className="checkout-field">
              <label>Phone</label>
              <input type="tel" value={user.phone || ""} disabled />
            </div>
            <div className="checkout-field">
              <label>Delivery Address</label>
              <textarea
                placeholder="Street, City, State, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                required
              />
            </div>
            <button className="checkout-submit" type="submit" disabled={loading}>
              {loading ? "Placing Order..." : `Place Order — ₹${total.toLocaleString()}`}
            </button>
          </form>
        </div>
        <div className="checkout-summary-section">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {cart.map((item) => {
              const discounted = item.price - (item.price * item.discount) / 100;
              return (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">Qty: {item.qty}</p>
                    <p className="checkout-item-price">₹{(discounted * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="checkout-totals">
            <div className="checkout-total-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="checkout-total-row"><span>GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
            <div className="checkout-total-row"><span>Delivery</span><span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span></div>
            <div className="checkout-total-row checkout-total-final"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
