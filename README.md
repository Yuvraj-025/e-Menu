# E-Menu Application ☕

A modern, full-stack web application designed for cafes, restaurants, and eateries. This application provides a seamless digital menu experience for customers to browse, add items to their cart, configure tips, and check out. For business owners, it includes a robust Admin Dashboard to manage menu items, track orders in real-time, generate and print receipts, and dynamically update storefront settings such as the cafe’s name, contact details, and hero images.

![E-Menu Showcase](client/public/favicon.svg) <!-- Replace with your actual hero image link -->

## 🌟 Features

### 🛒 Customer Experience
- **Interactive Menu:** Browse categories (Coffee, Breakfast, Restaurant) with sleek scroll-reveal animations.
- **Dynamic Cart:** Add items, adjust quantities, toggle tips, and instantly view the total bill without page reloads.
- **Beautiful UI:** A responsive, accessibility-friendly design built with React and custom CSS variables.

### 💼 Admin Dashboard (Secured via JWT)
- **Menu Management:** Edit prices, names, descriptions, and statuses for menu items globally.
- **Order Tracking:** View generated orders sorted by date. Toggle orders between "Paid" / "Unpaid".
- **Cafe Settings Management:** Dynamically change the Cafe Name, Address, Contact Info, About text, and Social Media links.
- **Hero Image Upload:** Upload a custom landing page image directly from the dashboard that overrides the public storefront background.
- **Printable Receipts:** A hidden, print-optimized CSS layout for producing professional invoices.

## 🛠 Tech Stack

- **Frontend:** React (Vite), Context API, CSS Variables, `react-router-dom`
- **Backend:** Node.js, Express.js, JWT Authentication, Multer (for image uploads)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Tooling:** Pre-configured `.gitignore` for full-stack monorepos, Concurrently (to run both client/server simultaneously)

## 📁 Repository Structure

```text
e-menu/
├── client/                 # Frontend React application (Vite)
│   ├── public/             
│   │   └── assets/         # Static global assets (logos, base images)
│   │       └── uploads/    # Dynamically uploaded images (ignored by git)
│   ├── src/                
│   │   ├── components/     # Reusable UI parts (Navbar, Footer, etc.)
│   │   ├── context/        # React Context logic (Auth, Cart, Settings)
│   │   ├── pages/          # Main views (Landing, Menu, Cart, Admin)
│   │   ├── styles/         # Global & modular CSS files
│   │   └── App.jsx         # Application routing
│   └── package.json    
├── server/                 # Backend Node.js / Express application
│   ├── middleware/         # Security & authentication interceptors (auth.js)
│   ├── models/             # Mongoose schemas (Menu, Order, Settings, Admin)
│   ├── routes/             # RESTful API endpoints
│   ├── uploads/            # Temporary storage for incoming file uploads
│   ├── server.js           # Express instance initialization
│   └── package.json        
├── .env.example            # Environment variables template
├── package.json            # Root configuration (handles `npm run dev`)
└── README.md
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection string (Local or MongoDB Atlas)

### 2. Installation
Clone the repository and install dependencies sequentially.
```bash
# Clone the repository
git clone https://github.com/your-username/e-Menu.git
cd e-Menu

# Install root dependencies (Concurrently)
npm install

# Install UI (Client) dependencies
cd client
npm install

# Install API (Server) dependencies
cd ../server
npm install
```

### 3. Environment Variables
You must provide a `.env` file inside the `server/` directory, mirroring `.env.example`.
```env
# server/.env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Running the Application
Return to the absolute root directory of the project, then start both servers simultaneously:
```bash
npm run dev
```
- The React application will launch at `http://localhost:5173`
- The Express database server will run quietly on port `5000`

### 🔑 Default Admin Access
To access the Admin Dashboard, navigate to `/admin/login` and use the following seeded credentials (remember to change this in your database!):
- **Email:** `admin@cafe.com`
- **Password:** `AdminUser123!`

---
*Developed with modern web practices. Designed to be lightweight and infinitely customizable!*
