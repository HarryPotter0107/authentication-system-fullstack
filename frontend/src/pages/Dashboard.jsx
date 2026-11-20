
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getResponseData } from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username") || "User";

    const [message, setMessage] = useState("Loading dashboard...");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            navigate("/", { replace: true });
            return;
        }

        if (role === "ADMINISTRATOR") {
            navigate("/admin", { replace: true });
            return;
        }

        api.get("/dashboard")
            .then((response) => {
                const data = getResponseData(response);

                setMessage(
                    typeof data === "string"
                        ? data
                        : response.data?.message ||
                        `Welcome ${username}`
                );
            })
            .catch((err) => {
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard."
                );
            })
            .finally(() => {
                setLoading(false);
            });

    }, [navigate, username]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            localStorage.clear();
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="app-layout">

            {/* Sidebar */}
            <aside className="app-sidebar">

                <div className="sidebar-brand">
                    <div className="sidebar-logo">O</div>
                    <span>OneDAO</span>
                </div>

                <div className="sidebar-section">
                    <p className="sidebar-label">WORKSPACE</p>

                    <Link
                        to="/dashboard"
                        className="sidebar-link active"
                    >
                        <span>▦</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/products"
                        className="sidebar-link"
                    >
                        <span>▤</span>
                        Products
                    </Link>
                </div>

                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>

                        <div className="user-details">
                            <strong>{username}</strong>
                            <small>Standard User</small>
                        </div>
                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <main className="app-main">

                <header className="app-topbar">
                    <div>
                        <span className="topbar-label">
                            WORKSPACE / DASHBOARD
                        </span>
                        <h2>Dashboard</h2>
                    </div>

                    <div className="topbar-profile">
                        <div className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <span>{username}</span>
                    </div>
                </header>

                <section className="dashboard-page">

                    <div className="welcome-banner">
                        <div>
                            <span className="welcome-tag">
                                YOUR WORKSPACE
                            </span>

                            <h1>Welcome back, {username}!</h1>

                            <p>
                                Here's an overview of your authentication
                                system workspace.
                            </p>
                        </div>

                        <div className="welcome-icon">
                            ✦
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="section-heading">
                        <div>
                            <h2>Overview</h2>
                            <p>Quick access to your workspace</p>
                        </div>
                    </div>

                    <div className="overview-grid">

                        <div className="overview-card">
                            <div className="overview-icon purple">
                                ▦
                            </div>

                            <span>Account Status</span>
                            <h3>Active</h3>
                            <small>Your account is active</small>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon blue">
                                ◈
                            </div>

                            <span>Authentication</span>
                            <h3>JWT Secured</h3>
                            <small>Token-based authentication</small>
                        </div>

                        <div className="overview-card">
                            <div className="overview-icon green">
                                ▤
                            </div>

                            <span>Account Type</span>
                            <h3>Standard User</h3>
                            <small>Standard access permissions</small>
                        </div>

                    </div>

                    <div className="section-heading">
                        <div>
                            <h2>Quick Access</h2>
                            <p>Manage your application resources</p>
                        </div>
                    </div>

                    <Link to="/products" className="workspace-card">

                        <div className="workspace-card-icon">
                            ▤
                        </div>

                        <div className="workspace-card-content">
                            <h3>Product Management</h3>
                            <p>
                                View, create, update and manage
                                your products.
                            </p>
                        </div>

                        <span className="workspace-arrow">→</span>

                    </Link>

                    <div className="dashboard-api-status">
                        <span className="status-dot"></span>

                        {loading
                            ? "Connecting to server..."
                            : message
                        }
                    </div>

                    <footer className="dashboard-footer">
                        © 2026 All rights reserved by Bhanu Upadhyay
                    </footer>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
