import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, useAuth, useOrders } from "../context/AppContext";
import { useToast } from "../components/Toast";

const methods = [{ id:"card", icon:"💳", label:"Card" }, { id:"easypaisa", icon:"📱", label:"Easypaisa" }, { id:"jazzcash", icon:"💰", label:"JazzCash" }];

export default function Payment() {
  const { cart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const showToast = useToast();
  const [method, setMethod] = useState("card");
  const [address, setAddress] = useState({ street:"", city:"Peshawar", phone:"" });
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvv:"" });
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const delivery = 99; const tax = Math.round(totalPrice * 0.05); const grand = totalPrice + delivery + tax;

  const validate = () => {
    const e = {};
    if (!address.street) e.street = "Address required";
    if (!address.phone || address.phone.length < 10) e.phone = "Valid phone required";
    if (method === "card") {
      if (!card.number || card.number.replace(/\s/g,"").length < 16) e.cardNum = "Valid card number required";
      if (!card.name) e.cardName = "Name required";
      if (!card.expiry) e.expiry = "Expiry required";
      if (!card.cvv || card.cvv.length < 3) e.cvv = "Valid CVV required";
    } else {
      if (!mobile || mobile.length < 10) e.mobile = "Valid mobile number required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      placeOrder(cart, grand, user, address, method);
      clearCart();
      showToast("Order placed! Delivery on the way 🚀", "success");
      navigate("/orders");
      setLoading(false);
    }, 1500);
  };

  if (cart.length === 0) { navigate("/"); return null; }

  return (
    <div className="page" style={{ maxWidth:680 }}>
      <h1 className="page-title">Payment</h1>
      <div className="form-card">
        <h3>Payment Method</h3>
        <div className="pay-methods">
          {methods.map(m => (
            <div key={m.id} className={`pay-m ${method===m.id?"on":""}`} onClick={() => setMethod(m.id)}>
              <div className="pay-m-icon">{m.icon}</div><span>{m.label}</span>
            </div>
          ))}
        </div>
        {method === "card" ? (
          <>
            <div className="fg"><label>Card Number</label>
              <input placeholder="1234 5678 9012 3456" maxLength={19} value={card.number}
                onChange={e => setCard(c => ({ ...c, number: e.target.value.replace(/\D/g,"").replace(/(\d{4})/g,"$1 ").trim() }))} />
              {errors.cardNum && <p className="err">{errors.cardNum}</p>}
            </div>
            <div className="fg"><label>Name on Card</label>
              <input placeholder="Ali Khan" value={card.name} onChange={e => setCard(c => ({ ...c, name:e.target.value }))} />
              {errors.cardName && <p className="err">{errors.cardName}</p>}
            </div>
            <div className="form-row">
              <div className="fg"><label>Expiry</label>
                <input placeholder="MM/YY" maxLength={5} value={card.expiry}
                  onChange={e => { let v = e.target.value.replace(/\D/g,""); if (v.length>=3) v=v.slice(0,2)+"/"+v.slice(2); setCard(c=>({...c,expiry:v})); }} />
                {errors.expiry && <p className="err">{errors.expiry}</p>}
              </div>
              <div className="fg"><label>CVV</label>
                <input placeholder="123" maxLength={4} type="password" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv:e.target.value.replace(/\D/g,"") }))} />
                {errors.cvv && <p className="err">{errors.cvv}</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="fg"><label>{method === "easypaisa" ? "Easypaisa" : "JazzCash"} Number</label>
            <input placeholder="03XX XXXXXXX" value={mobile} onChange={e => setMobile(e.target.value)} />
            {errors.mobile && <p className="err">{errors.mobile}</p>}
          </div>
        )}
      </div>

      <div className="form-card">
        <h3>Delivery Address</h3>
        <div className="fg"><label>Street Address</label>
          <input placeholder="Gali no 5, University Town..." value={address.street} onChange={e => setAddress(a => ({ ...a, street:e.target.value }))} />
          {errors.street && <p className="err">{errors.street}</p>}
        </div>
        <div className="form-row">
          <div className="fg"><label>City</label>
            <select value={address.city} onChange={e => setAddress(a => ({ ...a, city:e.target.value }))}>
              <option>Peshawar</option><option>Islamabad</option><option>Lahore</option><option>Karachi</option>
            </select>
          </div>
          <div className="fg"><label>Phone Number</label>
            <input placeholder="0312 1234567" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone:e.target.value }))} />
            {errors.phone && <p className="err">{errors.phone}</p>}
          </div>
        </div>
      </div>

      <div className="form-card">
        <h3>Order Summary</h3>
        <div className="sum-row"><span>Subtotal</span><span>Rs. {totalPrice}</span></div>
        <div className="sum-row"><span>Delivery</span><span>Rs. {delivery}</span></div>
        <div className="sum-row"><span>Tax (5%)</span><span>Rs. {tax}</span></div>
        <div className="sum-row tot"><span>Total</span><span>Rs. {grand}</span></div>
      </div>

      <button className="btn-brand" onClick={handlePay} disabled={loading}>{loading ? "Processing..." : `Pay Rs. ${grand} →`}</button>
    </div>
  );
}
