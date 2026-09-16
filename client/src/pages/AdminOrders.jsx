import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import api from "../services/api.js";

const AdminOrders = () => {
  const { getToken } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const updateStatus = async (orderId, status) => {
    try {
      const token = await getToken();

      if (!token) return;

      await api.patch(
        `/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (error) {
      console.error("Error updating order status:", error);

      alert(error.response?.data?.message || "Failed to update order status.");
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();

        if (!token) return;

        const response = await api.get("/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching admin orders:", error);

        setError(error.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getToken]);
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          Admin Orders
        </h1>

        <p className="mt-2 text-stone-600">
          Manage customer orders from your coffee shop.
        </p>

        {loading && <p className="mt-8 text-stone-600">Loading orders...</p>}

        {error && <p className="mt-8 text-red-600">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="mt-8 text-stone-600">No orders found.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-stone-900">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-stone-600">
                      {order.user_name} • {order.user_email}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-lg font-semibold text-stone-900">
                      ₹{Number(order.total_amount).toFixed(2)}
                    </p>

                    <p className="text-sm text-stone-500">
                      {order.delivery_method}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-stone-100 pt-4 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className="text-stone-600">Status:</span>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="cursor-pointer rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-amber-700"
                    >
                      <option value={order.status}>{order.status}</option>

                      {order.status === "paid" && (
                        <>
                          <option value="preparing">preparing</option>
                          <option value="cancelled">cancelled</option>
                        </>
                      )}

                      {order.status === "preparing" && (
                        <>
                          <option value="ready">ready</option>
                          <option value="cancelled">cancelled</option>
                        </>
                      )}

                      {order.status === "ready" &&
                        order.delivery_method === "pickup" && (
                          <>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                          </>
                        )}

                      {order.status === "ready" &&
                        order.delivery_method === "delivery" && (
                          <>
                            <option value="out_for_delivery">
                              out_for_delivery
                            </option>
                            <option value="cancelled">cancelled</option>
                          </>
                        )}

                      {order.status === "out_for_delivery" && (
                        <option value="delivered">delivered</option>
                      )}
                    </select>
                  </div>

                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
