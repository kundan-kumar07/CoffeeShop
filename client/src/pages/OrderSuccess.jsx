import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
    const { orderId } = useParams();

    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-amber-50 px-4 py-8 sm:px-6 sm:py-10">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-center shadow-sm sm:p-10">

                {/* Success Icon */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700 sm:h-16 sm:w-16 sm:text-3xl">
                    ✓
                </div>

                {/* Heading */}
                <p className="mt-5 text-sm font-medium uppercase tracking-[0.2em] text-amber-700 sm:mt-6 sm:tracking-[0.3em]">
                    Thank You
                </p>

                <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
                    Order Confirmed!
                </h1>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-stone-500 sm:text-base">
                    Your coffee order has been placed successfully.
                </p>

                {/* Order Number */}
                <div className="mt-6 rounded-2xl bg-stone-50 p-4 sm:p-5">
                    <p className="text-sm text-stone-500">
                        Order Number
                    </p>

                    <p className="mt-1 text-xl font-semibold text-stone-900">
                        #{orderId}
                    </p>
                </div>

                {/* Buttons */}
                <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
                    <Link
                        to={`/orders/${orderId}`}
                        className="w-full rounded-full bg-stone-900 px-7 py-3 font-medium text-white transition hover:bg-stone-700 sm:w-auto"
                    >
                        View Order
                    </Link>

                    <Link
                        to="/menu"
                        className="w-full rounded-full border border-stone-300 px-7 py-3 font-medium text-stone-900 transition hover:bg-stone-100 sm:w-auto"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;