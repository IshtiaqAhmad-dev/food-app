import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { useToast } from "../components/Toast";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState({ name:user?.name||"", phone:user?.phone||"", address:user?.address||"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));

  if (!user) return (
    <div className="protected">
      <div style={{ fontSize:48 }}>👤</div>
      <h2>Login karein</h2>
      <p>Profile dekhne ke liye login zaroori hai</p>
      <button className="btn-brand" style={{ width:"auto", padding:"12px 24px" }} onClick={() => navigate("/login")}>Login</button>
    </div>
  );

  const save = () => { login({ ...user, ...form }); showToast("Profile update ho gaya ✅", "success"); };

  return (
    <div className="page" style={{ maxWidth:680 }}>
      <h1 className="page-title">My Profile</h1>
      <div className="profile-header">
        <div className="prof-av">{user.name[0].toUpperCase()}</div>
        <div>
          <div style={{ fontFamily:"var(--font-d)", fontSize:20, fontWeight:800, color:"var(--text)" }}>{user.name}</div>
          <div style={{ fontSize:14, color:"var(--text3)" }}>{user.email}</div>
          <span className={`badge ${user.role==="admin"?"bg-orange":"bg-blue"}`} style={{ marginTop:8 }}>{user.role === "admin" ? "Admin" : "User"}</span>
        </div>
      </div>

      <div className="form-card">
        <h3>Personal Info</h3>
        <div className="fg"><label>Full Name</label><input value={form.name} onChange={e => set("name", e.target.value)} /></div>
        <div className="fg"><label>Email</label><input value={user.email} disabled style={{ opacity:.5, cursor:"not-allowed" }} /></div>
        <div className="fg"><label>Phone Number</label><input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="0312 1234567" /></div>
      </div>

      <div className="form-card">
        <h3>Default Delivery Address</h3>
        <div className="fg"><label>Address</label><textarea value={form.address} onChange={e => set("address", e.target.value)} placeholder="Gali no 5, University Town, Peshawar" /></div>
      </div>

      <div style={{ display:"flex", gap:12 }}>
        <button className="btn-brand" style={{ flex:1 }} onClick={save}>Save Changes</button>
        <button className="btn-danger" onClick={() => { logout(); navigate("/"); }}>Logout</button>
      </div>
    </div>
  );
}
