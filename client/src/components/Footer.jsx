import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-stone-900 text-stone-300">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="text-2xl font-bold text-white"
                        >
                            ☕ Coffee<span className="text-amber-500">Shop</span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
                            Freshly brewed coffee, delicious treats, and
                            everything you need for the perfect coffee break.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white">
                            Quick Links
                        </h3>

                        <div className="mt-4 flex flex-col gap-3 text-sm">
                            <Link
                                to="/"
                                className="transition hover:text-white"
                            >
                                Home
                            </Link>

                            <Link
                                to="/menu"
                                className="transition hover:text-white"
                            >
                                Menu
                            </Link>

                            <Link
                                to="/"
                                className="transition hover:text-white"
                            >
                                About Us
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white">
                            Visit Us
                        </h3>

                        <div className="mt-4 space-y-2 text-sm text-stone-400">
                            <p>📍 Amaravati, Andhra Pradesh</p>
                            <p>📞 +91 98765 43210</p>
                            <p>✉️ hello@coffeeshop.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 border-t border-stone-700 pt-6 text-center text-sm text-stone-500">
                    © {new Date().getFullYear()} CoffeeShop. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;