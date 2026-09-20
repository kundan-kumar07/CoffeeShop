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
                ON products.category_id = categories.id
                WHERE products.is_available = TRUE;
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
    const { name, description, price, categoryId } = req.body;

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
      req.file.buffer,
      req.file.originalname,
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

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

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

        // Check if category exists
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

        // If a new image was uploaded
        if (req.file) {
            const imageResult = await uploadToImageKit(
                req.file.buffer,
                req.file.originalname
            );

            const productResult = await sql`
                UPDATE products
                SET
                    name = ${name},
                    description = ${description || null},
                    price = ${price},
                    category_id = ${categoryId},
                    image_url = ${imageResult.url}
                WHERE id = ${productId}
                RETURNING *;
            `;

            if (productResult.length === 0) {
                return res.status(404).json({
                    message: "Product not found.",
                });
            }

            return res.json({
                message: "Product updated successfully.",
                product: productResult[0],
            });
        }

        // If no new image was uploaded
        const productResult = await sql`
            UPDATE products
            SET
                name = ${name},
                description = ${description || null},
                price = ${price},
                category_id = ${categoryId}
            WHERE id = ${productId}
            RETURNING *;
        `;

        if (productResult.length === 0) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        res.json({
            message: "Product updated successfully.",
            product: productResult[0],
        });
    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            message: "Failed to update product.",
        });
    }
};

export const updateProductAvailability = async (req, res) => {
    try {
        const { productId } = req.params;
        const { isAvailable } = req.body;

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                message: "isAvailable must be true or false.",
            });
        }

        const productResult = await sql`
            UPDATE products
            SET is_available = ${isAvailable}
            WHERE id = ${productId}
            RETURNING id, name, is_available;
        `;

        if (productResult.length === 0) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        res.json({
            message: isAvailable
                ? "Product is now available."
                : "Product is now not available.",
            product: productResult[0],
        });
    } catch (error) {
        console.error(
            "Update product availability error:",
            error
        );

        res.status(500).json({
            message: "Failed to update product availability.",
        });
    }
};