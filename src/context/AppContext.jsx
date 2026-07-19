import { createContext, useContext, useReducer, useState, useCallback, useEffect } from "react";

const CartContext    = createContext();
const AuthContext    = createContext();
const OrdersContext  = createContext();
const FavsContext    = createContext();
const ReviewsContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.find(i => i.id === action.payload.id);
      if (exists) return state.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.payload, qty: 1 }];
    }
    case "REMOVE_ITEM": return state.filter(i => i.id !== action.payload);
    case "UPDATE_QTY":  return state.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i).filter(i => i.qty > 0);
    case "CLEAR_CART":  return [];
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const addToCart      = (item) => dispatch({ type: "ADD_ITEM",    payload: item });
  const removeFromCart = (id)   => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQty      = (id, qty) => dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart      = ()     => dispatch({ type: "CLEAR_CART" });
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>{children}</CartContext.Provider>;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { const s = localStorage.getItem("fa_user"); return s ? JSON.parse(s) : null; } catch { return null; } });
  const login  = (u) => { setUser(u); localStorage.setItem("fa_user", JSON.stringify(u)); };
  const logout = ()  => { setUser(null); localStorage.removeItem("fa_user"); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => { try { const s = localStorage.getItem("fa_orders"); return s ? JSON.parse(s) : []; } catch { return []; } });
  useEffect(() => { localStorage.setItem("fa_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => {
    const h = (e) => { if (e.key === "fa_orders") { try { const u = JSON.parse(e.newValue); if (u) setOrders(u); } catch {} } };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);
  const placeOrder = useCallback((cart, total, user, address, payMethod) => {
    const o = { id: "#" + (1000 + Math.floor(Math.random() * 9000)), customer: user ? user.name : "Guest", email: user?.email, items: cart.map(i => `${i.name} x${i.qty}`).join(", "), itemsList: cart, total, status: "Preparing", address, payMethod, time: new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("en-PK"), createdAt: Date.now() };
    setOrders(prev => [o, ...prev]);
    return o;
  }, []);
  const updateStatus = useCallback((id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)), []);
  const clearOrders  = useCallback(() => { setOrders([]); localStorage.removeItem("fa_orders"); }, []);
  return <OrdersContext.Provider value={{ orders, placeOrder, updateStatus, clearOrders }}>{children}</OrdersContext.Provider>;
}

export function FavsProvider({ children }) {
  const [favs, setFavs] = useState(() => { try { const s = localStorage.getItem("fa_favs"); return s ? JSON.parse(s) : []; } catch { return []; } });
  useEffect(() => { localStorage.setItem("fa_favs", JSON.stringify(favs)); }, [favs]);
  const toggleFav = useCallback((id) => setFavs(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]), []);
  const isFav     = useCallback((id) => favs.includes(id), [favs]);
  return <FavsContext.Provider value={{ favs, toggleFav, isFav }}>{children}</FavsContext.Provider>;
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(() => { try { const s = localStorage.getItem("fa_reviews"); return s ? JSON.parse(s) : {}; } catch { return {}; } });
  useEffect(() => { localStorage.setItem("fa_reviews", JSON.stringify(reviews)); }, [reviews]);
  const addReview = useCallback((foodId, review) => {
    setReviews(prev => ({ ...prev, [foodId]: [review, ...(prev[foodId] || [])] }));
  }, []);
  const getReviews = useCallback((foodId) => reviews[foodId] || [], [reviews]);
  return <ReviewsContext.Provider value={{ addReview, getReviews }}>{children}</ReviewsContext.Provider>;
}

export const useCart    = () => useContext(CartContext);
export const useAuth    = () => useContext(AuthContext);
export const useOrders  = () => useContext(OrdersContext);
export const useFavs    = () => useContext(FavsContext);
export const useReviews = () => useContext(ReviewsContext);
