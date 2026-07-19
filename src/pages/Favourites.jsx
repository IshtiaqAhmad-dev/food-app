import { useState } from "react";
import { useFavs, useCart } from "../context/AppContext";
import { useToast } from "../components/Toast";
import { foods } from "../data/foods";
import FoodModal from "../components/FoodModal";

export default function Favourites() {
  const { favs, toggleFav } = useFavs();
  const { cart, addToCart, updateQty } = useCart();
  const showToast = useToast();
  const [selected, setSelected] = useState(null);
  const favFoods = foods.filter(f => favs.includes(f.id));

  return (
    <div className="grid-section" style={{ paddingTop:40 }}>
      <h1 className="page-title">Favourites</h1>
      {favFoods.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🤍</div><h2>Kuch nahi</h2><p>Food card pe ❤️ dabao!</p></div>
      ) : (
        <div className="food-grid">
          {favFoods.map(food => {
            const cartItem = cart.find(i => i.id === food.id);
            return (
              <div key={food.id} className="food-card" onClick={() => setSelected(food)}>
                <div className="fc-img-wrap">
                  <img src={food.image} alt={food.name} className="fc-img" />
                  <div className="fc-overlay" />
                  <span className="fc-cat">{food.category}</span>
                  <button className="fc-fav on" onClick={e => { e.stopPropagation(); toggleFav(food.id); showToast("Favourites se hataya"); }}>❤️</button>
                </div>
                <div className="fc-body">
                  <h3 className="fc-name">{food.name}</h3>
                  <p className="fc-desc">{food.description}</p>
                  <div className="fc-footer">
                    <div><div className="fc-price">Rs. {food.price}</div><div className="fc-meta"><span>⭐ {food.rating}</span><span>🕐 {food.time}</span></div></div>
                    {cartItem ? (
                      <div className="qty-ctrl" onClick={e => e.stopPropagation()}>
                        <button onClick={() => updateQty(food.id, cartItem.qty - 1)}>−</button><span>{cartItem.qty}</span><button onClick={() => updateQty(food.id, cartItem.qty + 1)}>+</button>
                      </div>
                    ) : (
                      <button className="fc-add" onClick={e => { e.stopPropagation(); addToCart(food); showToast(`${food.name} added! 🎉`,"success"); }}>+</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selected && <FoodModal food={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
