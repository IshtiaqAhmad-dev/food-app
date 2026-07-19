import { useState } from "react";
import { useCart, useFavs, useReviews, useAuth } from "../context/AppContext";
import { useToast } from "./Toast";

export default function FoodModal({ food, onClose }) {
  const { cart, addToCart, updateQty } = useCart();
  const { toggleFav, isFav } = useFavs();
  const { addReview, getReviews } = useReviews();
  const { user } = useAuth();
  const showToast = useToast();
  const cartItem = cart.find(i => i.id === food.id);
  const reviews = getReviews(food.id);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [hover, setHover] = useState(0);
  const fav = isFav(food.id);

  const handleAdd = () => { addToCart(food); showToast(`${food.name} added to cart 🎉`, "success"); };
  const submit = () => {
    if (!text.trim()) return;
    if (!user) { showToast("Pehle login karein"); return; }
    addReview(food.id, { author: user.name, text, stars, time: "Just now" });
    setText(""); setStars(5);
    showToast("Review submit ho gaya ⭐", "success");
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-wrap">
        <div className="modal">
          <img src={food.image} alt={food.name} className="modal-img" />
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-body">
            <p className="modal-tag">{food.category}</p>
            <h2 className="modal-title">{food.name}</h2>
            <p className="modal-desc">{food.description}</p>
            <div className="modal-meta">
              <span>⭐ {food.rating}</span>
              <span>🕐 {food.time}</span>
              <span>💬 {reviews.length} reviews</span>
            </div>
            <div className="modal-foot">
              <span className="modal-price">Rs. {food.price}</span>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <button onClick={() => { toggleFav(food.id); showToast(fav ? "Favourites se hataya" : "Favourites mein add! ❤️", fav?"":"success"); }}
                  style={{ background:fav?"var(--brand)":"var(--bg3)", border:"1px solid var(--border2)", borderRadius:"50%", width:40, height:40, cursor:"pointer", fontSize:17, transition:"all .2s" }}>
                  {fav ? "❤️" : "🤍"}
                </button>
                {cartItem ? (
                  <div className="qty-ctrl">
                    <button onClick={() => updateQty(food.id, cartItem.qty - 1)}>−</button>
                    <span>{cartItem.qty}</span>
                    <button onClick={() => updateQty(food.id, cartItem.qty + 1)}>+</button>
                  </div>
                ) : (
                  <button className="btn-brand" style={{ width:"auto", marginTop:0, padding:"11px 26px" }} onClick={handleAdd}>Add to Cart</button>
                )}
              </div>
            </div>

            <div className="rev-section">
              <h3>Reviews ({reviews.length})</h3>
              {reviews.length === 0 && <p style={{ fontSize:13, color:"var(--text3)", marginBottom:14 }}>Abhi koi review nahi. Pehla review aap likhein!</p>}
              {reviews.map((r, i) => (
                <div key={i} className="rev-item">
                  <div className="rev-author">{r.author} {"⭐".repeat(r.stars)} · {r.time}</div>
                  <div className="rev-text">{r.text}</div>
                </div>
              ))}
              {user && (
                <div style={{ marginTop:14 }}>
                  <div className="stars">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setStars(s)}
                        style={{ color:(hover||stars)>=s?"#F59E0B":"var(--border2)" }}>★</span>
                    ))}
                  </div>
                  <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Apna review likhein..."
                    style={{ width:"100%", padding:"11px 14px", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:"var(--r-sm)", fontFamily:"var(--font)", fontSize:13, color:"var(--text)", resize:"vertical", minHeight:70, outline:"none", marginBottom:10 }} />
                  <button className="btn-sm" onClick={submit} style={{ width:"100%", padding:"10px" }}>Submit Review</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
