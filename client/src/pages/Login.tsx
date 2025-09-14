import { useState } from "react";
import API from "../api";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await API.post("/auth/login", { email, password });
      
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        onLogin();
      } else {
        setError("Invalid response from server");
      }
    } catch (err: unknown) {
    console.error("Login error:", err);

    let errorMessage = "Login failed. Please try again.";

    if (err instanceof Error) {
        errorMessage = err.message;
    }

    const axiosError = err as { response?: { data?: { message?: string; error?: string } }; code?: string; message?: string };

    if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
    } else if (axiosError.response?.data?.error) {
        errorMessage = axiosError.response.data.error;
    }

    if (axiosError.code === "NETWORK_ERROR" || axiosError.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your connection.";
    }

    if (axiosError.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
    }

    setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`form-container ${loading ? 'loading' : ''}`}>
      <h2 className="form-title">Login</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <input
        className="form-input"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        required
      />
      
      <input
        className="form-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />
      
      <button 
        type="submit" 
        className="form-button"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}