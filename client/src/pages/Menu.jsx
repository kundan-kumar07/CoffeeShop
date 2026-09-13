import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/productService.js";

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load menu.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories = [
        "All",
        ...new Set(products.map((product) => product.category)),
    ];

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter(
                  (product) => product.category === selectedCategory
              );

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-stone-500">Loading menu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 px-6 py-16">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="font-medium uppercase tracking-[0.3em] text-amber-700">
                        Our Menu
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-stone-900 md:text-5xl">
                        Something for every mood
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-stone-600">
                        From freshly brewed coffee to delicious desserts,
                        find your perfect companion.
                    </p>
                </div>

                {/* Categories */}
                <div className="mb-10 flex flex-wrap justify-center gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                selectedCategory === category
                                    ? "bg-stone-900 text-white"
                                    : "bg-white text-stone-700 hover:bg-stone-100"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Menu;