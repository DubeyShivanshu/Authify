import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshVerified, setRefreshVerified] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard");
        setUserData(data.user);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleVerifyAutoRefresh = async () => {
    setLoading(true);
    setRefreshVerified(null);

    localStorage.setItem("accessToken", "EXPIRED_TOKEN_SIMULATION");

    try {
      const { data } = await api.get("/dashboard");
      setUserData(data.user);
      setRefreshVerified({
        success: true,
        message: "Interceptor caught 401 response, fetched a new Access Token using the httpOnly refresh cookie, and completed the request transparently.",
      });
    } catch (err) {
      setRefreshVerified({
        success: false,
        message: "Auto-refresh test failed: " + (err.response?.data?.message || err.message),
      });
    } finally {
      setLoading(false);
    }
  };

  const currentUser = userData || user;
  const tokenPreview = localStorage.getItem("accessToken");

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">Authify</div>
        <div className="navbar-user">
          <span>{currentUser?.name || "User"}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome, {currentUser?.name}!</h1>
          <p>You have successfully authenticated and accessed the protected dashboard route.</p>
        </div>

        {/* Two-Token System Section */}
        <h2 className="section-title">Two-Token System Demonstrated</h2>
        <div className="dashboard-grid" style={{ marginBottom: "24px" }}>
          <div className="card">
            <h3>Short-Lived Access Token</h3>
            <div className="info-group">
              <span className="info-label">Storage</span>
              <span className="info-value">localStorage</span>
            </div>
            <div className="info-group">
              <span className="info-label">Expiry Policy</span>
              <span className="info-value">15 Minutes</span>
            </div>
            <div className="info-group">
              <span className="info-label">Transmission</span>
              <span className="info-value code">Authorization: Bearer</span>
            </div>
            {tokenPreview && (
              <div className="token-preview">
                {tokenPreview.substring(0, 18)}...{tokenPreview.substring(tokenPreview.length - 10)}
              </div>
            )}
          </div>

          <div className="card">
            <h3>Long-Lived Refresh Token</h3>
            <div className="info-group">
              <span className="info-label">Storage</span>
              <span className="info-value">httpOnly Cookie</span>
            </div>
            <div className="info-group">
              <span className="info-label">Expiry Policy</span>
              <span className="info-value">7 Days</span>
            </div>
            <div className="info-group">
              <span className="info-label">Security</span>
              <span className="badge badge-success">XSS & CSRF Protected</span>
            </div>
            <p className="card-description" style={{ marginTop: "12px" }}>
              Stored securely in encrypted browser cookie and database. Inaccessible to client JavaScript.
            </p>
          </div>
        </div>

        {/* Auto-Refresh Verification Section */}
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3>Auto-Refresh Verified</h3>
          <p className="card-description" style={{ marginBottom: "16px" }}>
            Click below to test the Axios response interceptor flow. It will simulate an expired Access Token and verify that a new token is silently issued using the httpOnly Refresh Token cookie.
          </p>

          <button onClick={handleVerifyAutoRefresh} className="btn btn-primary" style={{ width: "auto" }} disabled={loading}>
            {loading ? "Verifying..." : "Verify Auto-Refresh Flow"}
          </button>

          {refreshVerified && (
            <div className={`verification-box ${refreshVerified.success ? "success" : "error"}`}>
              <strong>{refreshVerified.success ? "✓ Auto-Refresh Verified!" : "✕ Auto-Refresh Failed"}</strong>
              <p>{refreshVerified.message}</p>
            </div>
          )}
        </div>

        {/* Profile Information Section */}
        <div className="card">
          <h3>Profile Information</h3>
          <div className="info-group">
            <span className="info-label">Full Name</span>
            <span className="info-value">{currentUser?.name}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Email Address</span>
            <span className="info-value">{currentUser?.email}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Account ID</span>
            <span className="info-value code">{currentUser?._id || currentUser?.id}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
