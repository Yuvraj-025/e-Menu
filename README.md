Digital Menu Management System

The Café Menu Management System is a full-stack web application that allows users to browse, filter, and order café items while providing an admin interface for managing the menu in real-time.
Built using HTML, CSS, JavaScript (Frontend), and Node.js with Express (Backend), it ensures seamless user interaction and live menu management via a local menu.json file.

Features - 

Dynamic Menu Display: Fetches and displays items from menu.json dynamically.

Category Filters: Filter menu items by categories.

Cart System: Add items to cart, view quantities, and total price.

Admin Panel: Add, edit, or delete menu items directly, updating the menu.json file in real time.

Toast Notifications: Smooth notifications for user actions (e.g., adding to cart).

Responsive Design: Works on desktops, tablets, and mobile devices.

Tech Stack

Frontend: HTML5, CSS3, JavaScript (Vanilla JS)

Backend: Node.js + Express.js

Data Storage: JSON file (menu.json)

Server: Localhost via Node.js

Project Structure
main/
│
├── assets/              # Images and icons
├── menu.json            # Stores all menu data
├── index.html           # Main user interface
├── admin.html           # Admin panel for managing menu
├── script.js            # Handles frontend logic and cart system
├── admin.js             # Handles admin functions (CRUD)
├── server.js            # Express backend server
├── package.json         # Node dependencies and scripts
└── README.md            # Documentation

Installation & Setup
1. Install Node.js

If not installed, download and install Node.js from: https://nodejs.org/

2. Install dependencies

Open the project folder in your terminal and run:

npm install express cors body-parser

3. Start the server
node server.js

Server runs on http://localhost:3000

4. Open the app

Open index.html in your browser (use Live Server in VS Code for best results).

To access admin panel, open admin.html.

User Flow
Customer Flow

Launch index.html to view the café menu.

Use category filter buttons to view Coffee, Breakfast, or Restaurant items.

Click Add to Cart to add an item.

View total items and amount in the cart panel.

Admin Flow

Open admin.html to manage the menu.

Add new dishes by entering details (name, category, price, image URL, etc.).

Edit or delete existing items as needed.

Changes are saved directly to menu.json and reflected instantly in the user menu.
