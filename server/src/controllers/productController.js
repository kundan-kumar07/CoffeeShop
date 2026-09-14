import sql from "../db.js";
import uploadToImageKit from "../utils/imagekitUpload.js";

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
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            categoryId,
        } = req.body;

        if (!name || !price || !categoryId) {
            return res.status(400).json({
                message: "Name, price and category are required.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Product image is required.",
            });
        }

        const categoryResult = await sql`
            SELECT id
            FROM categories
            WHERE id = ${categoryId}
            LIMIT 1;
        `;

        if (categoryResult.length === 0) {
            return res.status(400).json({
                message: "Category not found.",
            });
        }

        const imageResult = await uploadToImageKit(
            req.file.path,
            req.file.originalname
        );

        const productResult = await sql`
            INSERT INTO products (
                name,
                description,
                price,
                image_url,
                category_id
            )
            VALUES (
                ${name},
                ${description || null},
                ${price},
                ${imageResult.url},
                ${categoryId}
            )
            RETURNING *;
        `;

        res.status(201).json({
            message: "Product created successfully.",
            product: productResult[0],
        });
    } catch (error) {
        console.error("Create product error:", error);

        res.status(500).json({
            message: "Failed to create product.",
        });
    }
};
export const getCategories = async (req, res) => {
    try {
        const categories = await sql`
            SELECT id, name
            FROM categories
            ORDER BY name;
        `;

        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);

        res.status(500).json({
            message: "Failed to fetch categories",
        });
    }
};