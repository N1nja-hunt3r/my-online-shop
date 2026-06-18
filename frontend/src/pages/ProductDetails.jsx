import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import "./ProductDetails.css";

const reviews = [
  { name: "Priya S.", text: "Amazing products! Got my laptop in 2 days.", rating: 5 },
  { name: "Rahul K.", text: "Best prices online. Highly recommended!", rating: 4 },
  { name: "Ananya M.", text: "Great customer support. Helped me with my order.", rating: 5 },
];

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="product-details-page">
        <h1>Product not found</h1>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">&larr; Back to Products</Link>
      <h1 className="product-details-name">{product.name}</h1>
      <table className="specs-table">
        <tbody>
          {Object.entries(product.specs).map(([key, value]) => (
            <tr key={key}>
              <td className="spec-key">{key}</td>
              <td className="spec-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section className="product-reviews">
        <h2 className="product-reviews-title">What Our Customers Say</h2>
        <div className="product-reviews-grid">
          {reviews.map((r, i) => (
            <div key={i} className="product-review-card">
              <div className="product-review-stars">{'\u2605'.repeat(r.rating)}</div>
              <p className="product-review-text">"{r.text}"</p>
              <p className="product-review-name">- {r.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
