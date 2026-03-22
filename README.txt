Digital Menu Management System

---

The Café Menu Management System is a full-stack web application that allows users to browse, filter, and order café items while providing an admin interface for managing the menu in real time.  
Built using HTML, CSS, JavaScript (Frontend), and Node.js with Express (Backend), it ensures seamless user interaction and live menu management via a local `menu.json` file.

---

Features

---

- Dynamic Menu Display: Fetches and displays items from `menu.json` dynamically.  
- Category Filters: Filter menu items by categories.  
- Cart System: Add items to cart, view quantities, and total price.  
- Admin Panel: Add, edit, or delete menu items directly, updating the `menu.json` file in real time.  
- Toast Notifications: Smooth notifications for user actions (e.g., adding to cart).  
- Responsive Design: Works on desktops, tablets, and mobile devices.

---

Tech Stack

---

- Frontend: HTML5, CSS3, JavaScript (Vanilla JS)  
- Backend: Node.js + Express.js  
- Data Storage: JSON file (`menu.json`)  
- Server: Localhost via Node.js  

---

Installation & Setup

---

1. Install Node.js

If not installed, download and install Node.js from:  
[https://nodejs.org/](https://nodejs.org/)

---

2. Install Dependencies

Open the project folder in your terminal and run:

```bash
npm install express cors body-parser
```

---

3. Start the Server

Run the command:

```bash
node server.js
```

Server will run at:  
http://localhost:3000

---

4. Open the Application

Open `index.html` in your browser (recommended via Live Server in VS Code).

To access the admin panel, open `admin.html`.

---

User Flow

---

Customer Flow

```bash
1. Launch index.html to view the café menu.
2. Use category filter buttons to view Coffee, Breakfast, or Restaurant items.
3. Click "Add to Cart" to add an item.
4. View total items and amount in the cart panel.
```

---

Admin Flow

```bash
1. Open admin.html to manage the menu.
2. Add new dishes by entering details (name, category, price, image URL, etc.).
3. Edit or delete existing items as needed.
4. Changes are saved directly to menu.json and reflected instantly in the user menu.
```

---

Project Structure

---

```bash
cafe-menu-main/
│
├── index.html           Customer-facing interface
├── admin.html           Admin management interface
├── menu.json            Stores all menu data
├── script.js            Handles menu + cart functionality
├── admin.js             Handles admin-side CRUD operations
├── server.js            Express backend server
├── style.css            Main stylesheet
└── README.md            Project documentation
```

---

How It Works

---

```bash
1. The backend (server.js) runs an Express server that reads and writes to menu.json.
2. The frontend (index.html) dynamically loads menu items using JavaScript’s fetch() API.
3. The admin panel (admin.html) sends update requests to the backend, modifying the menu.json file in real time.
4. Users see updated menu items without needing to refresh the system manually.
```
