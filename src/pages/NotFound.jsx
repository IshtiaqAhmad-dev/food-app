import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="notfound">
      <div className="big">404</div>
      <h2 style={{ fontFamily:"var(--font-d)", fontSize:24, fontWeight:800, color:"var(--text)", margin:"12px 0" }}>Page Nahi Mili</h2>
      <p style={{ color:"var(--text3)", marginBottom:28 }}>Yeh address galat hai ya page exist nahi karta</p>
      <button className="btn-brand" style={{ width:"auto", padding:"13px 28px" }} onClick={() => navigate("/")}>Ghar Jao</button>
    </div>
  );
}
