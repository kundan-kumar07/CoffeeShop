import { useCart } from "../context/CartContext.jsx";
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={product.image_url}
        alt={product.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-stone-900">
            {product.name}
          </h3>

          <span className="font-semibold text-amber-700">₹{product.price}</span>
        </div>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
            {product.category}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
