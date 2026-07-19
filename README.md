# 🍔 HungerHub — Online Food Ordering App

A modern, fully responsive **food delivery web app** built with **React 18**.
Browse a full menu, add items to cart, checkout with local payment methods,
track orders in real time, and manage everything through an admin dashboard.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 🍽️ **Menu browsing** — search by name/description, filter by category
  (Burgers, Pizza, Biryani, Karahi, BBQ, Rolls, Drinks, Desserts, Breakfast)
- 🛒 **Cart** — add/remove items, adjust quantity, live subtotal/delivery/tax/total
- 💳 **Checkout** — delivery address form + Card, Easypaisa or JazzCash payment
- 🔐 **Login & signup** — demo accounts included (admin + regular user)
- 📦 **Order tracking** — status flow: Preparing → On the way → Delivered
- 🛠️ **Admin dashboard** — manage orders & status, add/edit menu items, view
  revenue chart and customer list
- ❤️ **Favourites** — save dishes for quick reordering
- 👤 **Profile** — update name, phone, and delivery address
- 🔔 **Toast notifications** — instant feedback on every action
- 💾 **Local Storage persistence** — cart, orders, favourites, and login state
  all survive a page refresh, with cross-tab sync for orders
- 📱 **Fully responsive** — works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool & dev server |
| React Router DOM | Routing |
| Context API + `useReducer` | Global state (cart, auth, orders, favourites, reviews) |
| Local Storage | Data persistence |

---

## 📂 Folder Structure

```
food-app/
├── src/
│   ├── components/      # Navbar, Footer, FoodModal, Toast
│   ├── pages/            # Home, Cart, Payment, Login, Admin, Orders, Profile, Favourites, NotFound
│   ├── context/          # AppContext (Cart, Auth, Orders, Favourites, Reviews providers)
│   ├── data/              # Local food menu data (foods.js)
│   ├── App.jsx            # Route definitions
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hungerhub.pk` | `admin123` |
| User | `ali@test.com` | `pass123` |

You can also sign up with any new name/email to create a regular account on
the spot.

---

## 🎮 How It Works

1. **Browse the menu** on the Home page — search or filter by category.
2. **Add dishes to your cart**, adjust quantities as needed.
3. Go to **Cart → Checkout**, fill in your delivery address, and pick a
   payment method.
4. Track your order's status on the **Orders** page.
5. Save dishes to **Favourites** for next time, or update your **Profile**.
6. Log in as **admin** to manage incoming orders, update the menu, and view
   revenue/customer stats.

---

## 🧩 Implementation Notes

- All data (cart, orders, favourites, login session) persists in
  `localStorage` only — no backend or database is required.
- Order status updates sync across open browser tabs via the `storage` event.
- Menu images are loaded from Unsplash URLs defined in `src/data/foods.js`.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
