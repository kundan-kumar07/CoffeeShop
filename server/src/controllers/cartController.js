import sql from "../db.js";

export const getCart = async (req, res) => {
  try {
    const clerkUserId = req.userId;

    const userResult = await sql`
    SELECT id
    FROM users
    WHERE clerk_user_id = ${clerkUserId}
    LIMIT 1;
`;

    if (userResult.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const userId = userResult[0].id;

    let cartResult = await sql`
    SELECT id
    FROM carts
    WHERE user_id = ${userId}
    LIMIT 1;
`;

    if (cartResult.length === 0) {
      cartResult = await sql`
        INSERT INTO carts (user_id)
        VALUES (${userId})
        RETURNING id;
    `;
    }

    const cartId = cartResult[0].id;

    const items = await sql`
            SELECT
                cart_items.product_id,
                cart_items.quantity,
                products.name,
                products.description,
                products.price,
                products.image_url,
                products.is_available,
                categories.name AS category
            FROM cart_items
            JOIN products
                ON cart_items.product_id = products.id
            JOIN categories
                ON products.category_id = categories.id
            WHERE cart_items.cart_id = ${cartId}
            ORDER BY cart_items.id;
        `;

    res.json({
      items,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);

    res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
};
export const addToCart = async (req, res) => {
    try {
        const clerkUserId = req.userId;

        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                message: "Product ID and quantity are required.",
            });
        }

        const userResult = await sql`
            SELECT id
            FROM users
            WHERE clerk_user_id = ${clerkUserId}
            LIMIT 1;
        `;

        if (userResult.length === 0) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const userId = userResult[0].id;

        let cartResult = await sql`
            SELECT id
            FROM carts
            WHERE user_id = ${userId}
            LIMIT 1;
        `;

        if (cartResult.length === 0) {
            cartResult = await sql`
                INSERT INTO carts (user_id)
                VALUES (${userId})
                RETURNING id;
            `;
        }

        const cartId = cartResult[0].id;

        const productResult = await sql`
            SELECT id, is_available
            FROM products
            WHERE id = ${productId}
            LIMIT 1;
        `;

        if (productResult.length === 0) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        if (!productResult[0].is_available) {
            return res.status(400).json({
                message: "Product is currently unavailable.",
            });
        }

        const existingItem = await sql`
            SELECT id, quantity
            FROM cart_items
            WHERE cart_id = ${cartId}
              AND product_id = ${productId}
            LIMIT 1;
        `;

        if (existingItem.length > 0) {
            const newQuantity =
                existingItem[0].quantity + Number(quantity);

            const updatedItem = await sql`
                UPDATE cart_items
                SET quantity = ${newQuantity}
                WHERE id = ${existingItem[0].id}
                RETURNING id, product_id, quantity;
            `;

            return res.json({
                message: "Cart updated successfully.",
                item: updatedItem[0],
            });
        }

        const newItem = await sql`
            INSERT INTO cart_items (
                cart_id,
                product_id,
                quantity
            )
            VALUES (
                ${cartId},
                ${productId},
                ${quantity}
            )
            RETURNING id, product_id, quantity;
        `;

        res.status(201).json({
            message: "Item added to cart.",
            item: newItem[0],
        });
    } catch (error) {
        console.error("Error adding item to cart:", error);

        res.status(500).json({
            message: "Failed to add item to cart.",
        });
    }
};
export const updateCartItem = async (req, res) => {
    try {
        const clerkUserId = req.userId;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive integer.",
            });
        }

        const userResult = await sql`
            SELECT id
            FROM users
            WHERE clerk_user_id = ${clerkUserId}
            LIMIT 1;
        `;

        if (userResult.length === 0) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const userId = userResult[0].id;

        const cartResult = await sql`
            SELECT id
            FROM carts
            WHERE user_id = ${userId}
            LIMIT 1;
        `;

        if (cartResult.length === 0) {
            return res.status(404).json({
                message: "Cart not found.",
            });
        }

        const cartId = cartResult[0].id;

        const updatedItem = await sql`
            UPDATE cart_items
            SET quantity = ${quantity}
            WHERE cart_id = ${cartId}
              AND product_id = ${productId}
            RETURNING id, product_id, quantity;
        `;

        if (updatedItem.length === 0) {
            return res.status(404).json({
                message: "Cart item not found.",
            });
        }

        res.json({
            message: "Cart item updated successfully.",
            item: updatedItem[0],
        });
    } catch (error) {
        console.error("Error updating cart item:", error);

        res.status(500).json({
            message: "Failed to update cart item.",
        });
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        const clerkUserId = req.userId;
        const { productId } = req.params;

        const userResult = await sql`
            SELECT id
            FROM users
            WHERE clerk_user_id = ${clerkUserId}
            LIMIT 1;
        `;

        if (userResult.length === 0) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const userId = userResult[0].id;

        const cartResult = await sql`
            SELECT id
            FROM carts
            WHERE user_id = ${userId}
            LIMIT 1;
        `;

        if (cartResult.length === 0) {
            return res.status(404).json({
                message: "Cart not found.",
            });
        }

        const cartId = cartResult[0].id;

        const deletedItem = await sql`
            DELETE FROM cart_items
            WHERE cart_id = ${cartId}
              AND product_id = ${productId}
            RETURNING id, product_id, quantity;
        `;

        if (deletedItem.length === 0) {
            return res.status(404).json({
                message: "Cart item not found.",
            });
        }

        res.json({
            message: "Item removed from cart.",
            item: deletedItem[0],
        });
    } catch (error) {
        console.error("Error deleting cart item:", error);

        res.status(500).json({
            message: "Failed to remove cart item.",
        });
    }
};
