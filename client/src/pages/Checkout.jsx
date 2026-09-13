import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react";
import api from "../services/api.js";

import { useCart } from "../context/CartContext.jsx";

const Checkout = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
 
  
  


  const { cartItems, cartTotal } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState("pickup");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (deliveryMethod === "delivery") {
        const {
            fullName,
            phone,
            address,
            city,
            state,
            pinCode,
        } = formData;

        if (
            !fullName ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pinCode
        ) {
            setError("Please fill in all delivery details.");
            return;
        }
    }

    try {
        const token = await getToken();

        const response = await api.post(
            "/payments/create-checkout-session",
            {
                deliveryMethod,
                ...(deliveryMethod === "delivery"
                    ? formData
                    : {}),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        window.location.href = response.data.url;
    } catch (error) {
        console.error("Payment error:", error);

        setError(
            error.response?.data?.message ||
                "Failed to start payment."
        );
    }
};

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-amber-50 px-6">
        <h1 className="text-4xl font-bold text-stone-900">
          Your cart is empty
        </h1>

        <p className="mt-3 text-stone-500">
          Add something from our menu first.
        </p>

        <Link
          to="/menu"
          className="mt-6 rounded-full bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-700"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="font-medium uppercase tracking-[0.3em] text-amber-700">
            Almost There
          </p>

          <h1 className="mt-2 text-4xl font-bold text-stone-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-6 lg:col-span-2">
              {/* Account */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-stone-900">
                  Account
                </h2>

                <div className="mt-5 flex items-center gap-4">
                  {user?.imageUrl && (
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="h-12 w-12 rounded-full"
                    />
                  )}

                  <div>
                    <p className="font-medium text-stone-900">
                      {user?.fullName || "Coffee Lover"}
                    </p>

                    <p className="text-sm text-stone-500">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-stone-900">
                  Delivery Method
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {/* Pickup */}
                  <label
                    className={`cursor-pointer rounded-xl border p-5 transition ${
                      deliveryMethod === "pickup"
                        ? "border-amber-600 bg-amber-50"
                        : "border-stone-200 hover:border-amber-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryMethod === "pickup"}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="mr-3"
                    />

                    <span className="font-medium text-stone-800">Pickup</span>

                    <p className="mt-2 text-sm text-stone-500">
                      Pick up your order from our store.
                    </p>
                  </label>

                  {/* Delivery */}
                  <label
                    className={`cursor-pointer rounded-xl border p-5 transition ${
                      deliveryMethod === "delivery"
                        ? "border-amber-600 bg-amber-50"
                        : "border-stone-200 hover:border-amber-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="delivery"
                      checked={deliveryMethod === "delivery"}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="mr-3"
                    />

                    <span className="font-medium text-stone-800">Delivery</span>

                    <p className="mt-2 text-sm text-stone-500">
                      Get your order delivered to you.
                    </p>
                  </label>
                </div>
              </div>

              {/* Delivery Address */}
              {deliveryMethod === "delivery" && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-stone-900">
                    Delivery Address
                  </h2>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition focus:border-amber-600"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition focus:border-amber-600"
                      />
                    </div>

                    {/* PIN */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        PIN Code
                      </label>

                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        inputMode="numeric"
                        placeholder="Enter PIN code"
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition focus:border-amber-600"
                      />
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Address
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House / Flat / Street"
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition focus:border-amber-600"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition focus:border-amber-600"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        className="w-full rounded-xl border border-stone-200 px-4 py-3 outline-none transition focus:border-amber-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-stone-800">{item.name}</p>

                      <p className="text-stone-500">Qty: {item.quantity}</p>
                    </div>

                    <p className="font-medium text-stone-800">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-stone-200" />

              <div className="flex justify-between text-xl font-bold text-stone-900">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-stone-900 py-3 font-medium text-white transition hover:bg-stone-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
