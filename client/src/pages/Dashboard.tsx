import { useEffect, useState } from "react";
import API from "../api";

interface ShortUrl {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  contribution: string;
  limitReached: boolean;
  timeLeft: string;
}

export default function Dashboard() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [totalClicks, setTotalClicks] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});

  async function fetchUrls() {
    try {
      setLoading(true);
      const res = await API.get("/shorten");
      setUrls(res.data.urls || []);
      setTotalClicks(res.data.totalClicks || 0);
      setError("");
    } catch (err: unknown) {
    console.error("Failed to fetch error:", err);

    let errorMessage = "Failed to fetch URLs";

    if (err instanceof Error) {
        errorMessage = err.message;
    }

    const axiosError = err as { response?: { data?: { message?: string; error?: string } } };

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

  async function addUrl(e: React.FormEvent) {
    e.preventDefault();
    
    if (!newUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(newUrl);
    } catch {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoadingActions({ ...loadingActions, add: true });
    setError("");
    setSuccess("");
    
    try {
      await API.post("/shorten", { originalUrl: newUrl });
      setNewUrl("");
      setSuccess("URL shortened successfully!");
      fetchUrls();
    } catch (err: unknown) {
    console.error("Failed to shorten URL:", err);

    let errorMessage = "Failed to shorten URL. Please try again.";

    if (err instanceof Error) {
        errorMessage = err.message;
    }

    const axiosError = err as { response?: { data?: { message?: string; error?: string } } };

    if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
    } else if (axiosError.response?.data?.error) {
        errorMessage = axiosError.response.data.error;
    }

    setError(errorMessage);

    } finally {
      setLoadingActions({ ...loadingActions, add: false });
    }
  }

  async function deleteUrl(id: string) {
    if (!confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    setLoadingActions({ ...loadingActions, [id]: true });
    setError("");
    setSuccess("");
    
    try {
      await API.delete("/shorten", { data: { urlID: id } });
      setSuccess("URL deleted successfully!");
      fetchUrls();
    } catch (err: unknown) {
    console.error("Failed to delete URL:", err);

    let errorMessage = "Failed to delete URL";

    if (err instanceof Error) {
        errorMessage = err.message;
    }

    const axiosError = err as { response?: { data?: { message?: string; error?: string } } };

    if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
    } else if (axiosError.response?.data?.error) {
        errorMessage = axiosError.response.data.error;
    }

    setError(errorMessage);

    } finally {
      setLoadingActions({ ...loadingActions, [id]: false });
    }
  }

  async function updateUrl(id: string) {
    if (!editValue.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(editValue);
    } catch {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoadingActions({ ...loadingActions, [id]: true });
    setError("");
    setSuccess("");
    
    try {
      await API.put("/shorten", { urlID: id, originalUrl: editValue });
      setEditingId(null);
      setEditValue("");
      setSuccess("URL updated successfully!");
      fetchUrls();
    } catch (err: unknown) {
    console.error("Update URL error:", err);

    let errorMessage = "Failed to update URL";

    try {
        if (err instanceof Error) {
        errorMessage = err.message;
        }

        const axiosError = err as {
        response?: { 
            data?: { message?: string; error?: string }, 
            status?: number 
        }, 
        message?: string 
        };

        if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.error) {
        errorMessage = axiosError.response.data.error;
        } else if (axiosError.message) {
        errorMessage = axiosError.message;
        }

        if (axiosError.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        localStorage.removeItem("token");
        window.location.reload();
        return;
        }

        if (axiosError.response?.status === 404) {
        errorMessage = "URL not found. It may have been deleted.";
        fetchUrls();
        return;
        }
    } catch (parseError) {
        console.error("Error parsing error message:", parseError);
        errorMessage = "Failed to update URL. Please try again.";
    }

    setError(errorMessage);
    } finally {
      setLoadingActions({ ...loadingActions, [id]: false });
    }
  }

  function startEdit(url: ShortUrl) {
    setEditingId(url._id);
    setEditValue(url.originalUrl);
    setError("");
    setSuccess("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
    setError("");
  }

  useEffect(() => {
    fetchUrls();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">URL Dashboard</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      
      <form onSubmit={addUrl} className="url-form">
        <input
          className="url-input"
          placeholder="Enter URL to shorten (e.g., https://example.com)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          disabled={loadingActions.add}
        />
        <button 
          type="submit" 
          className="shorten-button"
          disabled={loadingActions.add}
        >
          {loadingActions.add ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      <div className="stats-container">
        <h3 className="stats-title">
          Total Clicks: {totalClicks.toLocaleString()}
        </h3>
      </div>

      {loading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
          Loading URLs...
        </div>
      ) : (
        <ul className="urls-list">
          {urls.length === 0 ? (
            <li style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No URLs found. Create your first shortened URL above!
            </li>
          ) : (
            urls.map((url) => (
              <li key={url._id} className="url-item">
                {editingId === url._id ? (
                  <div className="edit-form">
                    <input
                      className="edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Enter new URL"
                      disabled={loadingActions[url._id]}
                    />
                    <button 
                      className="action-button save-button" 
                      onClick={() => updateUrl(url._id)}
                      disabled={loadingActions[url._id]}
                    >
                      {loadingActions[url._id] ? "Saving..." : "Save"}
                    </button>
                    <button 
                      className="action-button cancel-button" 
                      onClick={cancelEdit}
                      disabled={loadingActions[url._id]}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="url-content">
                    <div className="url-main">
                      <b>{url.originalUrl}</b> →{" "}
                      <a
                        href={`https://url-shortener-tzog.onrender.com/${url.shortUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="url-link"
                      >
                        {`https://url-shortener-tzog.onrender.com/${url.shortUrl}`}
                      </a>
                    </div>
                    
                    <div className="url-stats">
                      <strong>Clicks:</strong> {url.clicks.toLocaleString()} | 
                      <strong> Contribution:</strong> {url.contribution}
                    </div>
                    
                    <div className="url-stats">
                      <strong>Available Clicks:</strong> {
                        url.limitReached 
                          ? "Limit Reached (Max 10)" 
                          : `${10 - url.clicks} remaining`
                      } | 
                      <strong> Time Left:</strong> {url.timeLeft}
                    </div>
                    
                    <div className="url-stats">
                      <strong>Created:</strong> {new Date(url.createdAt).toLocaleString()}
                    </div>
                    
                    <div className="url-actions">
                      <button
                        className="action-button edit-button"
                        onClick={() => startEdit(url)}
                        disabled={loadingActions[url._id]}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => deleteUrl(url._id)}
                        disabled={loadingActions[url._id]}
                      >
                        {loadingActions[url._id] ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}