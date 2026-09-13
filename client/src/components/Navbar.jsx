import { Link, NavLink } from "react-router-dom";

import {
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/react";

import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
    const { cartCount } = useCart();

    const navLinkClass = ({ isActive }) =>
        `font-medium transition ${
            isActive
                ? "text-amber-700"
                : "text-stone-600 hover:text-stone-900"
        }`;

    return (
        <nav className="border-b border-stone-200 bg-amber-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-stone-900"
                >
                    ☕ Coffee<span className="text-amber-700">Shop</span>
                </Link>

                {/* Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <NavLink
                        to="/"
                        className={navLinkClass}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/menu"
                        className={navLinkClass}
                    >
                        Menu
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={navLinkClass}
                    >
                        Orders
                    </NavLink>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="hidden rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-800 transition hover:bg-white sm:block"
                    >
                        Cart 🛒 {cartCount > 0 && `(${cartCount})`}
                    </Link>

                    {/* Logged out */}
                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <button className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-700">
                                Sign In
                            </button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                            <button className="hidden rounded-full bg-amber-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-amber-800 sm:block">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </Show>

                    {/* Logged in */}
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;