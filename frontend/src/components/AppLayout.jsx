
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function AppLayout({ children, title, subtitle }) {
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem("username") || "User";
    const role = localStorage.getItem("role") || "STANDARD_USER";
    const isAdmin = role === "ADMINISTRATOR";

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.clear();
            navigate("/", { replace: true });
        }
    };

    const links = isAdmin
        ? [
            { path: "/admin", label: "Dashboard", icon: "▦" },
            { path: "/admin/users", label: "User Management", icon: "♙" },
            { path: "/admin/settings", label: "Settings", icon: "⚙" },
            { path: "/products", label: "Products", icon: "▤" }
        ]
        : [
            { path: "/dashboard", label: "Dashboard", icon: "▦" },
            { path: "/products", label: "Products", icon: "▤" }
        ];

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="sidebar-brand">
                    <div className="sidebar-logo">O</div>
                    <span>OneDAO</span>
                </Link>

                <div className="sidebar-section">
                    <p className="sidebar-label">WORKSPACE</p>

                    {links.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${
                                location.pathname === item.path ? "active" : ""
                            }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>

                        <div className="user-details">
                            <strong>{username}</strong>
                            <small>
                                {isAdmin ? "Administrator" : "Standard User"}
                            </small>
                        </div>
                    </div>

                    <button className="sidebar-logout" onClick={handleLogout}>
                        ↪ Logout
                    </button>
                </div>
            </aside>

            <main className="app-main">
                <header className="app-topbar">
                    <div>
                        <span className="topbar-label">
                            WORKSPACE / {title.toUpperCase()}
                        </span>
                        <h2>{title}</h2>
                    </div>

                    <div className="topbar-profile">
                        <div className="user-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <span>{username}</span>
                    </div>
                </header>

                <section className="dashboard-page">
                    {subtitle && (
                        <p className="page-subtitle">{subtitle}</p>
                    )}

                    {children}

                    <footer className="dashboard-footer">
                        © 2026 OneDAO Authentication System
                    </footer>
                </section>
            </main>
        </div>
    );
}

export default AppLayout;
