import { useState, useEffect } from "react";
import { foods, categories } from "../data/foods";
import { useCart, useFavs } from "../context/AppContext";
import { useToast } from "../components/Toast";
import FoodModal from "../components/FoodModal";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQty } = useCart();
  const { toggleFav, isFav } = useFavs();
  const showToast = useToast();

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filtered = foods.filter(f => {
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge"><span />Now delivering in Peshawar</div>
          <h1 className="hero-h1">Hungry?<br/>We Got <em>You.</em></h1>
          <p className="hero-sub">50+ dishes, real-time tracking, garam khana seedha aapke darwaze tak.</p>
          <div className="hero-search">
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && setSearch(searchInput)}
              placeholder="Search burgers, biryani, pizza..." />
            <button onClick={() => setSearch(searchInput)}>Search</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>50+</strong><span>Dishes</span></div>
            <div className="hero-stat"><strong>30min</strong><span>Avg Delivery</span></div>
            <div className="hero-stat"><strong>4.8★</strong><span>Rating</span></div>
          </div>
        </div>
      </section>

      <div className="cats-wrap">
        {categories.map(cat => (
          <button key={cat} className={`cat-chip ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
        ))}
      </div>

      <div className="grid-section">
        <div className="grid-heading">
          <h2>{activeCategory === "All" ? "All Dishes" : activeCategory}</h2>
          <span>{filtered.length} items</span>
        </div>

        {loading ? (
          <div className="food-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius:"var(--r-lg)", overflow:"hidden", border:"1px solid var(--border)" }}>
                <div className="skel" style={{ height:185 }} />
                <div style={{ padding:14 }}>
                  <div className="skel" style={{ height:16, width:"75%", marginBottom:10 }} />
                  <div className="skel" style={{ height:11, width:"55%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h2>Kuch nahi mila</h2>
            <p>Search ya category change karein</p>
          </div>
        ) : (
          <div className="food-grid">
            {filtered.map((food, idx) => {
              const cartItem = cart.find(i => i.id === food.id);
              const fav = isFav(food.id);
              return (
                <div key={food.id} className="food-card" style={{ animationDelay:`${Math.min(idx*0.04,0.4)}s` }} onClick={() => setSelectedFood(food)}>
                  <div className="fc-img-wrap">
                    <img src={food.image} alt={food.name} className="fc-img" loading="lazy" />
                    <div className="fc-overlay" />
                    <span className="fc-cat">{food.category}</span>
                    <button className={`fc-fav ${fav?"on":""}`} onClick={e => { e.stopPropagation(); toggleFav(food.id); showToast(fav?"Favourites se hataya":"Favourites mein add! ❤️", fav?"":"success"); }}>
                      {fav ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="fc-body">
                    <h3 className="fc-name">{food.name}</h3>
                    <p className="fc-desc">{food.description}</p>
                    <div className="fc-footer">
                      <div>
                        <div className="fc-price">Rs. {food.price}</div>
                        <div className="fc-meta"><span>⭐ {food.rating}</span><span>🕐 {food.time}</span></div>
                      </div>
                      {cartItem ? (
                        <div className="qty-ctrl" onClick={e => e.stopPropagation()}>
                          <button onClick={() => updateQty(food.id, cartItem.qty - 1)}>−</button>
                          <span>{cartItem.qty}</span>
                          <button onClick={() => updateQty(food.id, cartItem.qty + 1)}>+</button>
                        </div>
                      ) : (
                        <button className="fc-add" onClick={e => { e.stopPropagation(); addToCart(food); showToast(`${food.name} added! 🎉`, "success"); }}>+</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedFood && <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />}
    </>
  );
}
