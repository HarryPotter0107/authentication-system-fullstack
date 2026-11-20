
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api, { getResponseData } from "../services/api";

function Settings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await api.get("/admin/settings");
                setSettings(getResponseData(response));
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load application settings."
                );
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const settingItems = settings && typeof settings === "object"
        ? Object.entries(settings)
        : [];

    return (
        <AppLayout
            title="Settings"
            subtitle="View application configuration and authentication information."
        >
            <div className="welcome-banner settings-banner">
                <div>
                    <span className="welcome-tag">SYSTEM CONFIGURATION</span>
                    <h1>Application Settings</h1>
                    <p>View the current application configuration.</p>
                </div>
                <div className="welcome-icon">⚙</div>
            </div>

            {error && <div className="error-message page-alert">{error}</div>}

            {loading ? (
                <div className="content-card empty-state">
                    Loading application settings...
                </div>
            ) : settingItems.length > 0 ? (
                <>
                    <div className="section-heading">
                        <div>
                            <h2>Configuration Overview</h2>
                            <p>Current settings returned by the backend</p>
                        </div>
                    </div>

                    <div className="settings-grid">
                        {settingItems.map(([key, value]) => (
                            <div className="content-card setting-card" key={key}>
                                <div className="setting-icon">⚙</div>
                                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                                <h3>{String(value)}</h3>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="content-card empty-state">
                    No settings are currently available.
                </div>
            )}
        </AppLayout>
    );
}

export default Settings;
