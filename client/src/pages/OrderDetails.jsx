import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";

import api from "../services/api.js";

const OrderDetails = () => {
    const { orderId } = useParams();
    const { getToken } = useAuth();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    
    useEffect(() => {
    const fetchOrder = async () => {
        try {
            const token = await getToken();

            if (!token) {
                return;
            }

            const response = await api.get(`/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrder(response.data.order);
            setItems(response.data.items);
        } catch (error) {
            console.error("Error fetching order:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to fetch order."
            );
        } finally {
            setLoading(false);
        }
    };

    fetchOrder();
}, [getToken, orderId]);

if (loading) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-amber-50">
            <p className="text-stone-500">
                Loading order...
            </p>
        </div>
    );
}

if (error || !order) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-amber-50 px-6">
            <h1 className="text-3xl font-bold text-stone-900">
                Order not found
            </h1>

            <p className="mt-3 text-stone-500">
                {error || "We couldn't find this order."}
            </p>

            <Link
                to="/orders"
                className="mt-6 rounded-full bg-stone-900 px-6 py-3 font-medium text-white"
            >
                Back to Orders
            </Link>
        </div>
    );
}
return (
    <div className="min-h-screen bg-amber-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
            <Link
                to="/orders"
                className="text-sm font-medium text-amber-700 hover:text-amber-800"
            >
                ← Back to Orders
            </Link>

            <div className="mt-6">
                <p className="font-medium uppercase tracking-[0.3em] text-amber-700">
                    Order Details
                </p>

                <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-4xl font-bold text-stone-900">
                        Order #{order.id}
                    </h1>

                    <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-medium capitalize text-amber-800">
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                {/* Items */}
                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                    <h2 className="text-xl font-semibold text-stone-900">
                        Items
                    </h2>

                    <div className="mt-6 space-y-5">
                        {items.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex items-center gap-4"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="h-20 w-20 rounded-xl object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="font-medium text-stone-900">
                                        {item.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-stone-500">
                                        ₹{Number(item.price).toFixed(2)} ×{" "}
                                        {item.quantity}
                                    </p>
                                </div>

                                <p className="font-semibold text-stone-900">
                                    ₹
                                    {(
                                        Number(item.price) *
                                        item.quantity
                                    ).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="my-6 border-t border-stone-200" />

                    <div className="flex justify-between text-xl font-bold text-stone-900">
                        <span>Total</span>

                        <span>
                            ₹{Number(order.total_amount).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Delivery Details */}
                <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-stone-900">
                        {order.delivery_method === "delivery"
                            ? "Delivery Details"
                            : "Pickup Details"}
                    </h2>

                    <div className="mt-6 space-y-4 text-sm">
                        {order.delivery_method === "delivery" ? (
                            <>
                                <div>
                                    <p className="text-stone-500">
                                        Name
                                    </p>

                                    <p className="mt-1 font-medium text-stone-900">
                                        {order.delivery_full_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-stone-500">
                                        Phone
                                    </p>

                                    <p className="mt-1 font-medium text-stone-900">
                                        {order.delivery_phone}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-stone-500">
                                        Address
                                    </p>

                                    <p className="mt-1 font-medium text-stone-900">
                                        {order.delivery_address}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-stone-500">
                                        Location
                                    </p>

                                    <p className="mt-1 font-medium text-stone-900">
                                        {order.delivery_city},{" "}
                                        {order.delivery_state}
                                    </p>

                                    <p className="mt-1 font-medium text-stone-900">
                                        {order.delivery_pin_code}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-stone-500">
                                You will pick up your order from the
                                coffee shop.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 text-sm text-stone-500">
                Ordered on{" "}
                {new Date(order.created_at).toLocaleString()}
            </div>
        </div>
    </div>
);
};

export default OrderDetails;