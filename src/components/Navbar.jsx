import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart, useAuth } from "../context/AppContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const lnk = (p) => `nav-link${pathname === p ? " active" : ""}`;

  return (
    <>
      <nav className="nav">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-dot" />
          HungerHub
        </Link>

        <div className="nav-center">
          <Link to="/" className={lnk("/")}>Menu</Link>
          <Link to="/favourites" className={lnk("/favourites")}>Favourites</Link>
          {user && <Link to="/orders" className={lnk("/orders")}>My Orders</Link>}
          {user?.role === "admin" && <Link to="/admin" className={lnk("/admin")}>Admin</Link>}
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <Link to="/profile">
                <div className="nav-avatar" title={user.name}>{user.name[0].toUpperCase()}</div>
              </Link>
              <button className="btn-ghost" onClick={() => { logout(); navigate("/"); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-ghost" style={{ border:"1px solid var(--border2)", padding:"7px 16px", borderRadius:"var(--r-sm)", fontSize:13, fontWeight:500, color:"var(--text2)", cursor:"pointer" }}>Login</Link>
          )}
          <button className="cart-pill" onClick={() => navigate("/cart")}>
            🛒 Cart
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(2)].map((_, k) => (
            <span key={k} style={{ display:"contents" }}>
              {["🔥 Free delivery above Rs. 1500", "⚡ Order in 30 min", "🍔 New: BBQ Bacon Burger", "🎉 Use code FIRST10 for 10% off", "🏆 Rated #1 in Peshawar"].map((t, i) => (
                <span key={i} className="ticker-item">
                  <span>{t}</span>
                  <span style={{ opacity:.4 }}>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
