import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

import api from "../services/api.js";

const Orders = () => {
  const { getToken } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();

        if (!token) {
          return;
        }

        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);

        setError(error.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-amber-50">
        <p className="text-stone-500">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-amber-50 px-6">
        <p className="rounded-xl bg-red-50 px-5 py-3 text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="font-medium uppercase tracking-[0.3em] text-amber-700">
            Your Coffee
          </p>

          <h1 className="mt-2 text-4xl font-bold text-stone-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-stone-900">
              No orders yet
            </h2>

            <p className="mt-2 text-stone-500">
              Your coffee journey starts here.
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-block rounded-full bg-stone-900 px-6 py-3 font-medium text-white"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <Link
    key={order.id}
    to={`/orders/${order.id}`}
    className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-stone-500">Order #{order.id}</p>

                    <p className="mt-1 text-lg font-semibold text-stone-900">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium capitalize text-amber-800">
                      {order.status}
                    </span>

                    <span className="text-sm capitalize text-stone-500">
                      {order.delivery_method}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-stone-200 pt-4">
                  <p className="text-sm text-stone-500">Ordered on</p>

                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
