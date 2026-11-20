
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8081/api/auth/login",
                formData
            );

            const authData = response.data.data;

            localStorage.setItem("token", authData.token);
            localStorage.setItem("username", authData.username);
            localStorage.setItem("role", authData.role);

            if (authData.role === "ADMINISTRATOR") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }

        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>

                <div className="auth-brand">
                    <div className="brand-mark">O</div>
                    <span>OneDAO</span>
                </div>

                <h1>Welcome Back</h1>

                <p>Sign in to access your account</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Continue"}
                </button>

                <p>
                    New to OneDAO?{" "}
                    <Link to="/register">Create an account</Link>
                </p>

            </form>
        </div>
    );
}

export default Login;
