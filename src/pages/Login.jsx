import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { useToast } from "../components/Toast";

const USERS = [
  { id:1, name:"Admin User", email:"admin@hungerhub.pk", password:"admin123", role:"admin" },
  { id:2, name:"Ali Khan",   email:"ali@test.com",       password:"pass123",  role:"user" },
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const set = (k, v) => { setForm(f => ({ ...f, [k]:v })); setError(""); };

  const handleSubmit = () => {
    if (!form.email || !form.password) { setError("Sab fields fill karein"); return; }
    if (isLogin) {
      const found = USERS.find(u => u.email === form.email && u.password === form.password);
      if (!found) { setError("Email ya password galat hai"); return; }
      login(found);
      showToast(`Welcome back, ${found.name} 👋`, "success");
      navigate(found.role === "admin" ? "/admin" : "/");
    } else {
      if (!form.name) { setError("Naam daalen"); return; }
      login({ id:Date.now(), name:form.name, email:form.email, role:"user" });
      showToast(`Account ban gaya! Welcome ${form.name} 🎉`, "success");
      navigate("/");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">🔥 Hunger<span>Hub</span></div>
        <h2 className="auth-h2">{isLogin ? "Welcome back" : "Create account"}</h2>
        <p className="auth-sub">{isLogin ? "Sign in to order your favourite food" : "Join us and start ordering"}</p>

        <div className="social-row">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
        </div>
        <div className="divider">or email</div>

        {!isLogin && (
          <div className="fg"><label>Full Name</label><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ali Khan" /></div>
        )}
        <div className="fg"><label>Email</label><input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" /></div>
        <div className="fg"><label>Password</label>
          <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        {error && <p className="auth-err">⚠ {error}</p>}
        <button className="auth-btn" onClick={handleSubmit}>{isLogin ? "Sign In" : "Create Account"}</button>

        {isLogin && (
          <div className="demo-box">
            <strong>Demo accounts:</strong>
            Admin: admin@hungerhub.pk / admin123<br/>
            User: ali@test.com / pass123
          </div>
        )}

        <div className="auth-switch">
          {isLogin ? "Account nahi hai? " : "Pehle se account hai? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); setForm({ name:"", email:"", password:"" }); }}>{isLogin ? "Sign Up" : "Sign In"}</button>
        </div>
      </div>
    </div>
  );
}
