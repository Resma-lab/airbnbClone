# 🏡 Airbnb Clone

A full-stack **Airbnb-inspired accommodation booking web application** built with **Node.js, Express.js, MongoDB, and EJS**, featuring property listings, user authentication, reviews, and booking functionality.

## ✨ Features

* 🔐 User registration and authentication
* 🏠 Create, view, edit, and delete property listings
* 🔎 Browse and explore available properties
* 📄 Detailed property pages
* 🖼️ Property image support
* 📅 Booking/reservation functionality
* ⭐ Ratings and reviews
* 👤 User-specific listings and bookings
* 🛡️ Authentication and authorization
* 📱 Responsive user interface
* ⚡ Dynamic server-side rendered pages

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* EJS (Embedded JavaScript Templates)

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Other Technologies

* RESTful APIs
* Express Middleware
* Authentication & Authorization
* Git & GitHub

## 🏗️ Application Architecture

```text
                    User
                     │
                     ▼
             HTML / CSS / JS
                     │
                     ▼
                   EJS
                     │
                     ▼
              Express.js
                     │
                     ▼
                Node.js
                     │
                     ▼
                Mongoose
                     │
                     ▼
                 MongoDB
```

The application uses **EJS for server-side rendering**, while Express.js handles routing and backend logic. MongoDB stores application data such as users, listings, reviews, and bookings.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=your_session_secret
```

Add any additional environment variables required by your implementation.

### 4. Start the Server

Run the application using **nodemon**:

```bash
nodemon app.js
```

The application will start on the configured local port.

For example:

```text
http://localhost:8080
```

## 📸 Screenshots

Add screenshots of:

* 🏠 Home page
* 🔐 Login/Register page
* 🏡 Property listings
* 📄 Property details
* ➕ Create listing page
* ⭐ Reviews
* 📅 Booking page

## 🧠 Key Concepts Demonstrated

* MVC architecture
* CRUD operations
* RESTful routing
* Server-side rendering with EJS
* MongoDB database operations
* Mongoose schemas and relationships
* Authentication and authorization
* Express middleware
* Form handling and validation
* Session management
* Error handling

## 💡 What I Learned

Building this project strengthened my understanding of **full-stack web development**, particularly backend development with Node.js and Express.js.

I gained practical experience in designing RESTful routes, connecting applications with MongoDB, implementing authentication, handling CRUD operations, and rendering dynamic pages using EJS.

## 🔮 Future Improvements

* 💳 Online payment integration
* 🗺️ Interactive maps and location-based search
* 💬 Host–guest messaging
* 🔔 Real-time booking notifications
* 🤖 AI-powered property recommendations
* 📊 Host analytics dashboard
* 📱 Progressive Web App support

## 👩‍💻 Author

**Resmarani Bisoyi**

Built with ❤️ using Node.js, Express.js, MongoDB & EJS.
