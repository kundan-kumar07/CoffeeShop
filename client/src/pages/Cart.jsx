import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-amber-50 px-6">
        <h1 className="text-4xl font-bold text-stone-900">
          Your cart is empty
        </h1>

        <p className="mt-3 text-stone-500">
          Add something delicious from our menu.
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
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <p className="font-medium uppercase tracking-[0.3em] text-amber-700">
            Your Order
          </p>

          <h1 className="mt-2 text-4xl font-bold text-stone-900">
            Shopping Cart
          </h1>
        </div>

        {/* Cart Items */}
        <div className="mt-10 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              {/* Product Image */}
              <img
                src={item.image_url}
                alt={item.name}
                className="h-24 w-full rounded-xl object-cover sm:w-24"
              />

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-stone-900">
                  {item.name}
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  ₹{Number(item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-lg transition hover:bg-stone-100"
                >
                  -
                </button>

                <span className="w-6 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-lg transition hover:bg-stone-100"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="min-w-24 text-right">
                <p className="font-semibold text-stone-900">
                  ₹{(Number(item.price) * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-1 text-sm text-red-500 transition hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-10 ml-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900">
            Order Summary
          </h2>

          <div className="mt-5 flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <div className="my-4 border-t border-stone-200" />

          <div className="flex justify-between text-xl font-bold text-stone-900">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-full bg-stone-900 py-3 text-center font-medium text-white transition hover:bg-stone-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
