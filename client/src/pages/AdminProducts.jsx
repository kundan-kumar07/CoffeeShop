import { useState, useEffect } from "react";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const { getToken } = useAuth();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/categories`,
        );

        const data = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products`,
        );

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAvailabilityChange = async (productId, isAvailable) => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/availability`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAvailable,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update product availability.",
        );
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                is_available: isAvailable,
              }
            : product,
        ),
      );

      toast.success(result.message);
    } catch (error) {
      console.error("Availability update error:", error);

      toast.error(error.message || "Failed to update product availability.");
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      categoryId: product.category_id,
      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleCancelEdit = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);

      // Only add image if a new image was selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      const isEditing = editingProduct !== null;

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/products/${editingProduct.id}`
        : `${import.meta.env.VITE_API_URL}/products`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Failed to update product."
              : "Failed to create product."),
        );
      }

      if (isEditing) {
        // Update product in existing list
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProduct.id
              ? {
                  ...product,
                  ...result.product,
                }
              : product,
          ),
        );

        toast.success(result.message || "Product updated successfully!");

        // Exit edit mode
        setEditingProduct(null);
      } else {
        // Add new product to existing list
        setProducts((currentProducts) => [...currentProducts, result.product]);

        toast.success(result.message || "Product added successfully!");
      }

      // Clear form
      e.target.reset();

      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        image: null,
      });
    } catch (error) {
      console.error("Product submit error:", error);

      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-stone-900">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h1>

        <p className="mt-2 text-stone-500">
          {editingProduct
            ? "Update the details of this product."
            : "Add a new coffee product to the menu."}
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-3xl bg-white p-8 shadow-sm"
        >
          <input
            name="name"
            type="text"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />

          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />

          <button
            type="submit"
            className="cursor-pointer rounded-full bg-stone-900 px-7 py-3 font-medium text-white"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="ml-3 cursor-pointer rounded-full border border-stone-300 px-7 py-3 font-medium text-stone-800 transition hover:bg-stone-100"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-stone-900">
            Existing Products
          </h2>

          <div className="mt-5 space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-stone-500">
                    {product.category}
                  </p>

                  <p className="mt-2 font-medium text-stone-900">
                    ₹{product.price}
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${
                      product.is_available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.is_available ? "Available" : "Not Available"}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleAvailabilityChange(
                        product.id,
                        !product.is_available,
                      )
                    }
                    className={`mt-3 cursor-pointer rounded-full px-5 py-2 text-sm font-medium text-white transition ${
                      product.is_available
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {product.is_available
                      ? "Mark Not Available"
                      : "Mark Available"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="mt-3 ml-2 cursor-pointer rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
