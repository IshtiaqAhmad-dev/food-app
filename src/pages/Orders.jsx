import { useNavigate } from "react-router-dom";
import { useOrders, useAuth } from "../context/AppContext";

const steps = ["Preparing", "On the way", "Delivered"];
const icon = { "Preparing":"👨‍🍳", "On the way":"🛵", "Delivered":"✅" };

export default function Orders() {
  const { orders } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="protected">
      <div style={{ fontSize:48 }}>🔒</div>
      <h2>Login karein</h2>
      <p>Orders dekhne ke liye login zaroori hai</p>
      <button className="btn-brand" style={{ width:"auto", padding:"12px 24px" }} onClick={() => navigate("/login")}>Login</button>
    </div>
  );

  const myOrders = user.role === "admin" ? orders : orders.filter(o => o.email === user.email);

  return (
    <div className="page">
      <h1 className="page-title">{user.role === "admin" ? "All Orders" : "My Orders"}</h1>
      {myOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>Koi order nahi</h2>
          <p>Abhi koi order nahi hai</p>
          <button className="btn-brand" style={{ width:"auto", padding:"12px 24px" }} onClick={() => navigate("/")}>Order Karein</button>
        </div>
      ) : myOrders.map(o => {
        const stepIdx = steps.indexOf(o.status);
        return (
          <div key={o.id} className="order-card">
            <div className="oc-head">
              <div><div className="oc-id">{o.id}</div><div className="oc-time">{o.date} · {o.time}</div></div>
              <span className={`badge ${o.status==="Delivered"?"bg-green":o.status==="On the way"?"bg-orange":"bg-gray"}`}>{o.status}</span>
            </div>
            <div className="track-steps">
              {steps.map((s, i) => (
                <div key={s} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? "1" : "0" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div className={`ts-dot ${i <= stepIdx ? "done" : i === stepIdx+1 ? "active" : ""}`}>{i <= stepIdx ? "✓" : icon[s]}</div>
                    <div className={`ts-label ${i <= stepIdx ? "done" : ""}`}>{s}</div>
                  </div>
                  {i < steps.length-1 && <div className={`ts-line ${i < stepIdx ? "done" : ""}`} />}
                </div>
              ))}
            </div>
            <div className="oc-items">{o.items}</div>
            <div className="oc-foot">
              <div className="oc-meta">📍 {o.address?.street}, {o.address?.city} · {o.payMethod === "card" ? "💳 Card" : o.payMethod === "easypaisa" ? "📱 Easypaisa" : "💰 JazzCash"}</div>
              <div className="oc-total">Rs. {o.total}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
