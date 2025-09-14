import { useState } from "react";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/auth/register", { name, email, password });

      setSuccess("Registration successful! You can now login.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      console.error("Registration error:", err);

      let errorMessage = "Registration failed. Please try again.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      const axiosError = err as {
        response?: { data?: { message?: string; error?: string } };
      };

      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.response?.data?.error) {
        errorMessage = axiosError.response.data.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`form-container ${loading ? "loading" : ""}`}
    >
      <h2 className="form-title">Register</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <input
        className="form-input"
        placeholder="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
      />

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
        placeholder="Password (min. 8 characters)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      />

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
