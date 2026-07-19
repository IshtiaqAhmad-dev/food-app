import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider, AuthProvider, OrdersProvider, FavsProvider, ReviewsProvider } from "./context/AppContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Favourites from "./pages/Favourites";
import NotFound from "./pages/NotFound";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
          <FavsProvider>
            <ReviewsProvider>
              <CartProvider>
                <ToastProvider>
                  <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
                    <Navbar />
                    <div style={{ flex:1 }}>
                      <Routes>
                        <Route path="/"           element={<Home />} />
                        <Route path="/cart"       element={<Cart />} />
                        <Route path="/payment"    element={<Payment />} />
                        <Route path="/login"      element={<Login />} />
                        <Route path="/admin"      element={<Admin />} />
                        <Route path="/orders"     element={<Orders />} />
                        <Route path="/profile"    element={<Profile />} />
                        <Route path="/favourites" element={<Favourites />} />
                        <Route path="*"           element={<NotFound />} />
                      </Routes>
                    </div>
                    <Footer />
                  </div>
                </ToastProvider>
              </CartProvider>
            </ReviewsProvider>
          </FavsProvider>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
