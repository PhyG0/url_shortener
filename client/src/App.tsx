import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

type PageType = "login" | "register" | "dashboard";

export default function App() {
  const [page, setPage] = useState<PageType>("login");
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPage("dashboard");
    }
    setIsInitializing(false);
  }, []);

  function handleLogin() {
    setPage("dashboard");
  }

  function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      setPage("login");
    }
  }

  function switchToRegister() {
    setPage("register");
  }

  function switchToLogin() {
    setPage("login");
  }

  // Show loading while checking authentication
  if (isInitializing) {
    return (
      <div className="app">
        <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div className="loading" style={{ width: '50px', height: '50px', margin: '0 auto 1rem' }}></div>
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">URL Shortener</h1>
        <div>
          {page !== "dashboard" && (
            <>
              <button 
                onClick={switchToLogin} 
                className={`nav-button ${page === "login" ? "active" : ""}`}
              >
                Login
              </button>
              <button 
                onClick={switchToRegister} 
                className={`nav-button ${page === "register" ? "active" : ""}`}
              >
                Register
              </button>
            </>
          )}
          {page === "dashboard" && (
            <button onClick={handleLogout} className="nav-button logout">
              Logout
            </button>
          )}
        </div>
      </nav>

      <main className="main-content">
        {page === "login" && <Login onLogin={handleLogin} />}
        {page === "register" && <Register />}
        {page === "dashboard" && <Dashboard />}
      </main>
    </div>
  );
}
