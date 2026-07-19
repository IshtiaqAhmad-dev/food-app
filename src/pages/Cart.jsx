import { useNavigate } from "react-router-dom";
import { useCart, useAuth } from "../context/AppContext";
import { useToast } from "../components/Toast";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const delivery = totalPrice > 0 ? 99 : 0;
  const tax = Math.round(totalPrice * 0.05);
  const grand = totalPrice + delivery + tax;

  if (cart.length === 0) return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h2>Cart khali hai</h2>
        <p>Koi item add nahi kiya abhi tak</p>
        <button className="btn-brand" style={{ width:"auto", padding:"13px 28px" }} onClick={() => navigate("/")}>Menu Dekhein</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">Your Cart <span style={{ fontSize:16, color:"var(--text3)", fontWeight:500 }}>({totalItems} items)</span></h1>
      <div className="cart-layout">
        <div className="cart-list">
          {cart.map(item => (
            <div key={item.id} className="cart-card">
              <img src={item.image} alt={item.name} />
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>Rs. {item.price} each</p>
              </div>
              <div className="qty-ctrl">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <span className="cart-price">Rs. {item.price * item.qty}</span>
              <button className="cart-rm" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
          <button className="btn-danger" style={{ alignSelf:"flex-start" }} onClick={() => { clearCart(); showToast("Cart clear ho gaya"); }}>Clear Cart</button>
        </div>
        <div className="summary-card">
          <h2>Order Summary</h2>
          <div className="sum-row"><span>Subtotal</span><span>Rs. {totalPrice}</span></div>
          <div className="sum-row"><span>Delivery</span><span>Rs. {delivery}</span></div>
          <div className="sum-row"><span>Tax (5%)</span><span>Rs. {tax}</span></div>
          <div className="sum-row tot"><span>Total</span><span>Rs. {grand}</span></div>
          <button className="btn-brand" onClick={() => navigate(user ? "/payment" : "/login")}>{user ? "Proceed to Payment →" : "Login to Checkout"}</button>
        </div>
      </div>
    </div>
  );
}
