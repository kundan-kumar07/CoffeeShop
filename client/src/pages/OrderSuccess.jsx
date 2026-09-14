import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
    const { orderId } = useParams();

    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-amber-50 px-6 py-10">
            <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">

                {/* Success Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                    ✓
                </div>

                {/* Heading */}
                <p className="mt-6 font-medium uppercase tracking-[0.3em] text-amber-700">
                    Thank You
                </p>

                <h1 className="mt-2 text-4xl font-bold text-stone-900">
                    Order Confirmed!
                </h1>

                <p className="mt-4 text-stone-500">
                    Your coffee order has been placed successfully.
                </p>

                {/* Order Number */}
                <div className="mt-6 rounded-2xl bg-stone-50 p-5">
                    <p className="text-sm text-stone-500">
                        Order Number
                    </p>

                    <p className="mt-1 text-xl font-semibold text-stone-900">
                        #{orderId}
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

                    <Link
                        to={`/orders/${orderId}`}
                        className="rounded-full bg-stone-900 px-7 py-3 font-medium text-white transition hover:bg-stone-700"
                    >
                        View Order
                    </Link>

                    <Link
                        to="/menu"
                        className="rounded-full border border-stone-300 px-7 py-3 font-medium text-stone-900 transition hover:bg-stone-100"
                    >
                        Continue Shopping
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;