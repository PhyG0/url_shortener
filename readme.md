# URL Shortener

A full-stack **URL Shortener** application built with **MERN (MongoDB, Express, React, Node.js)** and **TypeScript**. The app allows users to register, log in, shorten URLs, and manage their shortened URLs.

## Features

* **User Authentication**

  * Register and log in with secure password hashing
  * JWT-based authentication
* **URL Shortening**

  * Generate shortened URLs from long URLs
  * Custom short URLs (optional)
* **URL Management**

  * View all shortened URLs
  * Edit or delete URLs
  * Track URL click statistics
* **TypeScript**

  * Full type safety across front-end and back-end
* **Responsive UI**

  * Built with React and Tailwind/CSS 

## Tech Stack

* **Frontend:** React, TypeScript, React Router, Axios
* **Backend:** Node.js, Express, TypeScript
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT (JSON Web Tokens), bcrypt
* **Others:** cors, dotenv, nodemon, shortid/nanoid

## Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas)
* npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/PhyG0/url_shortener.git
   cd url-shortener
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   ```

   * Create a `.env` file:

     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=jwt_secret
     BASE_URL=http://localhost:3000
     ```
   * Start the backend server:

     ```bash
     npm run dev
     ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   ```
   * Start the frontend server:

     ```bash
     npm start
     ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Auth

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | /api/auth/register | Register a new user       |
| POST   | /api/auth/login    | Login user and return JWT |

### URL

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| POST   | /api/shorten  | Shorten a new URL        |
| GET    | /api/shorten  | Get all user URLs        |
| GET    | /api/shorten/ | Get a single URL by ID   |
| PUT    | /api/shorten/ | Update a shortened URL   |
| DELETE | /api/shorten/ | Delete a shortened URL   |
| GET    | /\:shortId    | Redirect to original URL |

## Folder Structure

```
url-shortener/
├── client/           # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/           # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.ts
│   └── package.json
├── .gitignore
└── README.md
```



