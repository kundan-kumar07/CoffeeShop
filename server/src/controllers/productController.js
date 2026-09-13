import sql from "../db.js";

export const getProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT
                products.id,
                products.name,
                products.description,
                products.price,
                products.image_url,
                products.is_available,
                categories.name AS category
            FROM products
            JOIN categories
                ON products.category_id = categories.id;
        `;

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);

        res.status(500).json({
            message: "Failed to fetch products",
        });
    }
};