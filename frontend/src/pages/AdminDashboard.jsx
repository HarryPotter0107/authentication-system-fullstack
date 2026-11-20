
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function AdminDashboard() {
    const username = localStorage.getItem("username") || "Administrator";

    return (
        <AppLayout
            title="Admin Dashboard"
            subtitle="Manage your authentication system and application resources."
        >
            <div className="welcome-banner">
                <div>
                    <span className="welcome-tag">ADMINISTRATOR WORKSPACE</span>
                    <h1>Welcome back, {username}!</h1>
                    <p>
                        Manage users, application settings and products
                        from one place.
                    </p>
                </div>

                <div className="welcome-icon">✦</div>
            </div>

            <div className="section-heading">
                <div>
                    <h2>Administration</h2>
                    <p>Manage your application resources</p>
                </div>
            </div>

            <div className="admin-card-grid">
                <Link to="/admin/users" className="admin-feature-card">
                    <div className="overview-icon purple">♙</div>
                    <h3>User Management</h3>
                    <p>View, manage and remove registered users.</p>
                    <span>Manage Users →</span>
                </Link>

                <Link to="/admin/settings" className="admin-feature-card">
                    <div className="overview-icon blue">⚙</div>
                    <h3>System Settings</h3>
                    <p>View application and authentication settings.</p>
                    <span>View Settings →</span>
                </Link>

                <Link to="/products" className="admin-feature-card">
                    <div className="overview-icon green">▤</div>
                    <h3>Product Management</h3>
                    <p>Create, update and manage product records.</p>
                    <span>Manage Products →</span>
                </Link>
            </div>

            <div className="content-card admin-notice">
                <h3>Administrator Access</h3>
                <p>
                    You are logged in with Administrator privileges.
                    Administrative operations are protected by backend
                    role-based authorization.
                </p>
            </div>
        </AppLayout>
    );
}

export default AdminDashboard;
