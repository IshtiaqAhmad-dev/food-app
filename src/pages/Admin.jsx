import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useOrders } from "../context/AppContext";
import { foods as initialFoods, categories } from "../data/foods";

const statusClass = { "Delivered":"bg-green", "On the way":"bg-orange", "Preparing":"bg-gray" };
const nextStatus  = { "Preparing":"On the way", "On the way":"Delivered" };
const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Admin() {
  const { user } = useAuth();
  const { orders, updateStatus, clearOrders } = useOrders();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [filterStatus, setFilterStatus] = useState("All");
  const [menu, setMenu] = useState(initialFoods);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newDish, setNewDish] = useState({ name:"", category:"Burgers", price:"", rating:"4.5", time:"20 min", image:"", description:"" });

  if (!user || user.role !== "admin") return (
    <div className="protected">
      <div style={{ fontSize:48 }}>🔒</div>
      <h2>Access Denied</h2>
      <p>Yeh page sirf admin ke liye hai</p>
      <button className="btn-brand" style={{ width:"auto", padding:"12px 24px" }} onClick={() => navigate("/login")}>Login karein</button>
    </div>
  );

  const delivered = orders.filter(o => o.status === "Delivered");
  const active = orders.filter(o => o.status !== "Delivered");
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
  const filteredOrders = filterStatus === "All" ? orders : orders.filter(o => o.status === filterStatus);
  const maxRev = 5000;
  const chartData = weekDays.map((d) => ({ day: d, val: Math.floor(Math.random() * maxRev) }));
  chartData[5] = { day:"Sat", val: totalRevenue || 2800 };
  const customerList = [...new Map(orders.map(o => [o.email, { name:o.customer, email:o.email, orders:orders.filter(x=>x.email===o.email).length, spent:orders.filter(x=>x.email===o.email).reduce((s,x)=>s+x.total,0) }])).values()];

  const saveDish = () => {
    if (!newDish.name || !newDish.price) return;
    if (editId) setMenu(m => m.map(d => d.id === editId ? { ...d, ...newDish, price:Number(newDish.price), rating:Number(newDish.rating) } : d));
    else setMenu(m => [...m, { ...newDish, id:Date.now(), price:Number(newDish.price), rating:Number(newDish.rating) }]);
    setNewDish({ name:"", category:"Burgers", price:"", rating:"4.5", time:"20 min", image:"", description:"" });
    setShowForm(false); setEditId(null);
  };
  const editDish = (d) => { setNewDish({ ...d, price:String(d.price), rating:String(d.rating) }); setEditId(d.id); setShowForm(true); setTab("menu"); };
  const deleteDish = (id) => setMenu(m => m.filter(d => d.id !== id));

  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <h1>Admin Dashboard</h1>
        <span style={{ fontSize:13, color:"var(--text3)" }}>Welcome, {user.name}</span>
      </div>

      <div className="stats-row">
        {[
          { label:"Total Orders",  value:orders.length, icon:"📦", brand:true },
          { label:"Revenue",       value:`Rs. ${totalRevenue}`, icon:"💰" },
          { label:"Menu Items",    value:menu.length, icon:"🍽️" },
          { label:"Active",        value:active.length, icon:"⏳", brand:true },
          { label:"Customers",     value:customerList.length, icon:"👥" },
          { label:"Delivered",     value:delivered.length, icon:"✅" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-val ${s.brand?"brand":""}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-tabs">
        {["orders","menu","customers","chart"].map(t => (
          <button key={t} className={`a-tab ${tab===t?"on":""}`} onClick={() => setTab(t)}>
            {t==="orders"?"📋 Orders":t==="menu"?"🍽️ Menu":t==="customers"?"👥 Customers":"📊 Revenue"}
          </button>
        ))}
      </div>

      {/* ORDERS — CARD GRID */}
      {tab === "orders" && (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", gap:8 }}>
              {["All","Preparing","On the way","Delivered"].map(s => (
                <button key={s} className={`btn-sm ${filterStatus===s?"":""}`} style={filterStatus===s?{ background:"var(--brand)", color:"#fff", borderColor:"var(--brand)" }:{}} onClick={() => setFilterStatus(s)}>{s}</button>
              ))}
            </div>
            {orders.length > 0 && <button className="btn-danger" onClick={clearOrders}>Clear All Orders</button>}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><h2>Koi order nahi</h2><p>Jab customer order karega, yahan card dikhega</p></div>
          ) : (
            <div className="admin-orders">
              {filteredOrders.map(o => (
                <div key={o.id} className="admin-order-card">
                  <div className="aoc-top">
                    <div><div className="aoc-id">{o.id}</div><div className="aoc-time">{o.date} · {o.time}</div></div>
                    <span className={`badge ${statusClass[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="aoc-customer">
                    <div className="aoc-avatar">{o.customer?.[0]?.toUpperCase() || "G"}</div>
                    <div><div className="aoc-name">{o.customer}</div><div className="aoc-email">{o.email || "guest"}</div></div>
                  </div>
                  <div className="aoc-items">{o.items}</div>
                  <div className="aoc-foot">
                    <div className="aoc-total">Rs. {o.total}</div>
                    <div className="aoc-actions">
                      {nextStatus[o.status] ? (
                        <button className="btn-success" onClick={() => updateStatus(o.id, nextStatus[o.status])}>→ {nextStatus[o.status]}</button>
                      ) : <span style={{ fontSize:12, color:"var(--success)", fontWeight:700 }}>✓ Complete</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MENU — CARD GRID */}
      {tab === "menu" && (
        <>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button className="btn-brand" style={{ width:"auto", padding:"10px 22px", marginTop:0 }}
              onClick={() => { setShowForm(!showForm); setEditId(null); setNewDish({ name:"", category:"Burgers", price:"", rating:"4.5", time:"20 min", image:"", description:"" }); }}>
              {showForm ? "Cancel" : "+ Add New Dish"}
            </button>
          </div>
          {showForm && (
            <div className="form-card">
              <h3>{editId ? "Edit Dish" : "New Dish Add Karein"}</h3>
              <div className="form-row">
                <div className="fg"><label>Dish Name</label><input value={newDish.name} onChange={e => setNewDish(d => ({...d,name:e.target.value}))} placeholder="Smash Burger" /></div>
                <div className="fg"><label>Category</label>
                  <select value={newDish.category} onChange={e => setNewDish(d => ({...d,category:e.target.value}))}>
                    {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="fg"><label>Price (Rs.)</label><input type="number" value={newDish.price} onChange={e => setNewDish(d => ({...d,price:e.target.value}))} placeholder="650" /></div>
                <div className="fg"><label>Time</label><input value={newDish.time} onChange={e => setNewDish(d => ({...d,time:e.target.value}))} placeholder="20 min" /></div>
              </div>
              <div className="fg"><label>Image URL</label><input value={newDish.image} onChange={e => setNewDish(d => ({...d,image:e.target.value}))} placeholder="https://images.unsplash.com/..." /></div>
              <div className="fg"><label>Description</label><textarea value={newDish.description} onChange={e => setNewDish(d => ({...d,description:e.target.value}))} placeholder="Dish detail..." /></div>
              <button className="btn-brand" onClick={saveDish}>{editId ? "Update Dish" : "Add Dish"}</button>
            </div>
          )}
          <div className="menu-admin-grid">
            {menu.map(f => (
              <div key={f.id} className="menu-admin-card">
                <img src={f.image} alt={f.name} className="mac-img" />
                <div className="mac-body">
                  <div className="mac-name">{f.name}</div>
                  <div className="mac-meta"><span className="badge bg-orange">{f.category}</span><span className="mac-price">Rs. {f.price}</span></div>
                  <div className="mac-actions">
                    <button className="btn-sm" style={{ flex:1 }} onClick={() => editDish(f)}>Edit</button>
                    <button className="btn-danger" style={{ flex:1 }} onClick={() => deleteDish(f.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CUSTOMERS — CARD GRID */}
      {tab === "customers" && (
        customerList.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👥</div><h2>Koi customer nahi</h2><p>Abhi koi order place nahi hua</p></div>
        ) : (
          <div className="cust-grid">
            {customerList.map((c, i) => (
              <div key={i} className="cust-card">
                <div className="cust-av">{c.name?.[0]?.toUpperCase()}</div>
                <div className="cust-name">{c.name}</div>
                <div className="cust-email">{c.email}</div>
                <div className="cust-stats">
                  <div className="cust-stat"><strong>{c.orders}</strong><span>Orders</span></div>
                  <div className="cust-stat"><strong>Rs.{c.spent}</strong><span>Spent</span></div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* CHART */}
      {tab === "chart" && (
        <div className="chart-box">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:17, fontWeight:800 }}>Weekly Revenue</h3>
            <span className="badge bg-green">This Week</span>
          </div>
          <div className="chart-bars">
            {chartData.map(d => (
              <div key={d.day} className="cb-col">
                <span className="cb-val">{Math.round(d.val/100)/10}k</span>
                <div className="cb-bar" style={{ height:`${(d.val/maxRev)*100}%` }} />
                <span className="cb-day">{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text3)", marginTop:10 }}>
            <span>Total: <strong style={{ color:"var(--text)" }}>Rs. {chartData.reduce((s,d) => s+d.val, 0).toLocaleString()}</strong></span>
            <span>Best day: <strong style={{ color:"var(--brand)" }}>{chartData.reduce((a,b)=>a.val>b.val?a:b).day}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
