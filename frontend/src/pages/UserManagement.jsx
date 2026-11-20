
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import api, { getResponseData } from "../services/api";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/admin/users");
            const data = getResponseData(response);
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const term = search.toLowerCase();

        return users.filter((user) =>
            `${user.username || ""} ${user.email || ""} ${user.role || ""}`
                .toLowerCase()
                .includes(term)
        );
    }, [users, search]);

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user ${user.username}?`)) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.delete(`/admin/users/${user.id}`);
            setSuccess(`${user.username} was deleted successfully.`);
            await loadUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete this user."
            );
        }
    };

    return (
        <AppLayout
            title="User Management"
            subtitle="View and manage registered application users."
        >
            <div className="welcome-banner admin-banner">
                <div>
                    <span className="welcome-tag">ADMINISTRATION</span>
                    <h1>User Management</h1>
                    <p>Manage user accounts and access information.</p>
                </div>
                <div className="welcome-icon">♙</div>
            </div>

            {error && <div className="error-message page-alert">{error}</div>}
            {success && <div className="success-message page-alert">{success}</div>}

            <div className="section-heading">
                <div>
                    <h2>Registered Users</h2>
                    <p>{users.length} registered user(s)</p>
                </div>

                <input
                    className="table-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                />
            </div>

            <div className="content-card table-card">
                {loading ? (
                    <p className="empty-state">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="empty-state">No users found.</p>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="user-avatar">
                                                {(user.username || "U")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <strong>{user.username}</strong>
                                        </div>
                                    </td>

                                    <td>{user.email}</td>

                                    <td>
                                            <span className={`role-badge ${
                                                user.role === "ADMINISTRATOR"
                                                    ? "role-admin"
                                                    : "role-standard"
                                            }`}>
                                                {user.role}
                                            </span>
                                    </td>

                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

export default UserManagement;
