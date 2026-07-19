import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand"><span className="footer-brand-dot" />HungerHub</div>
          <p className="footer-desc">Peshawar ka fastest food delivery app. Burgers se biryani tak — sab kuch garam aur fresh, seedha aapke darwaze tak.</p>
          <div className="footer-social">
            <div className="social-icon">𝕏</div>
            <div className="social-icon">f</div>
            <div className="social-icon">in</div>
            <div className="social-icon">▶</div>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a>About Us</a>
          <a>Careers</a>
          <a>Blog</a>
          <a>Partner with us</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a>Help Center</a>
          <a>Track Order</a>
          <a>Refund Policy</a>
          <a>Contact Us</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a>Terms of Service</a>
          <a>Privacy Policy</a>
          <a>Cookie Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 HungerHub. Internship project — React.js</span>
        <div className="footer-tags">
          <span className="footer-tag">Made with React ⚛️</span>
          <span className="footer-tag">Peshawar, PK</span>
        </div>
      </div>
    </footer>
  );
}
