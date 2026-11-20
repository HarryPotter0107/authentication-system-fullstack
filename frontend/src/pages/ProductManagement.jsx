
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import api, { getResponseData } from "../services/api";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    quantity: ""
};

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/products");
            const data = getResponseData(response);

            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        const term = search.toLowerCase();

        return products.filter((product) =>
            `${product.name || ""} ${product.description || ""}`
                .toLowerCase()
                .includes(term)
        );
    }, [products, search]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            quantity: Number(formData.quantity)
        };

        try {
            if (editingId !== null) {
                await api.put(`/products/${editingId}`, payload);
                setSuccess("Product updated successfully.");
            } else {
                await api.post("/products", payload);
                setSuccess("Product created successfully.");
            }

            resetForm();
            await loadProducts();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save product."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);

        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: String(product.price ?? ""),
            quantity: String(product.quantity ?? "")
        });

        setError("");
        setSuccess("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.delete(`/products/${id}`);
            setSuccess("Product deleted successfully.");
            await loadProducts();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };

    return (
        <AppLayout
            title="Products"
            subtitle="Create, search and manage your product inventory."
        >
            <div className="welcome-banner product-banner">
                <div>
                    <span className="welcome-tag">PRODUCT WORKSPACE</span>
                    <h1>Product Management</h1>
                    <p>Manage your products and inventory in one place.</p>
                </div>
                <div className="welcome-icon">▤</div>
            </div>

            {error && <div className="error-message page-alert">{error}</div>}
            {success && <div className="success-message page-alert">{success}</div>}

            <div className="section-heading">
                <div>
                    <h2>{editingId !== null ? "Edit Product" : "Add New Product"}</h2>
                    <p>Enter the product information below</p>
                </div>
            </div>

            <div className="content-card">
                <form onSubmit={handleSubmit}>
                    <div className="product-form-grid">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                                maxLength={150}
                            />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                min="0"
                                step="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="primary-button" type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Product"
                                    : "Add Product"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="section-heading product-list-heading">
                <div>
                    <h2>Product Inventory</h2>
                    <p>{products.length} product record(s)</p>
                </div>

                <input
                    className="table-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                />
            </div>

            <div className="content-card table-card">
                {loading ? (
                    <p className="empty-state">Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="empty-state">No products found.</p>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <strong>{product.name}</strong>
                                    </td>
                                    <td>{product.description || "—"}</td>
                                    <td>
                                        {Number(product.price).toLocaleString("en-IN", {
                                            style: "currency",
                                            currency: "INR"
                                        })}
                                    </td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
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

export default ProductManagement;
