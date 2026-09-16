import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import api from "../services/api.js";

const AdminDashboard = () => {
    const { getToken } = useAuth();

    const [stats, setStats] = useState({
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        total_products: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = await getToken();

                if (!token) return;

                const response = await api.get("/admin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setStats(response.data.stats);
            } catch (error) {
                console.error(
                    "Error fetching dashboard stats:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch dashboard statistics."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [getToken]);

    return (
        <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold text-stone-900">
                    Admin Dashboard
                </h1>

                <p className="mt-2 text-stone-600">
                    Manage your coffee shop from here.
                </p>

                {error && (
                    <p className="mt-6 text-red-600">
                        {error}
                    </p>
                )}

                {/* Dashboard Statistics */}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Total Orders */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-stone-500">
                            Total Orders
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-stone-900">
                            {loading
                                ? "..."
                                : stats.total_orders}
                        </h2>
                    </div>

                    {/* Revenue */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-stone-500">
                            Revenue
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-stone-900">
                            {loading
                                ? "..."
                                : `₹${Number(
                                      stats.total_revenue
                                  ).toFixed(2)}`}
                        </h2>
                    </div>

                    {/* Pending Orders */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-stone-500">
                            Pending Orders
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-stone-900">
                            {loading
                                ? "..."
                                : stats.pending_orders}
                        </h2>
                    </div>

                    {/* Total Products */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-stone-500">
                            Total Products
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-stone-900">
                            {loading
                                ? "..."
                                : stats.total_products}
                        </h2>
                    </div>
                </div>

                {/* Admin Management */}
                <div className="mt-8 grid gap-6 sm:grid-cols-2">

                    <Link
                        to="/admin/orders"
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="text-3xl">📦</div>

                        <h2 className="mt-4 text-xl font-semibold text-stone-900">
                            Manage Orders
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-stone-600">
                            View customer orders and update
                            their status.
                        </p>
                    </Link>

                    <Link
                        to="/admin/products"
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="text-3xl">☕</div>

                        <h2 className="mt-4 text-xl font-semibold text-stone-900">
                            Manage Products
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-stone-600">
                            Add and manage products in your
                            coffee shop.
                        </p>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;