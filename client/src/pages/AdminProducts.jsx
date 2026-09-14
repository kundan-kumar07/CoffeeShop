import { useState, useEffect } from "react";
import { useAuth } from "@clerk/react";

const AdminProducts = () => {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);
      data.append("image", formData.image);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      console.log("Server response:", result);
    } catch (error) {
      console.error("Create product error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-stone-900">Add Product</h1>

        <p className="mt-2 text-stone-500">
          Add a new coffee product to the menu.
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
            className="rounded-full bg-stone-900 px-7 py-3 font-medium text-white"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;
