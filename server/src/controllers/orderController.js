import sql from "../db.js";
import { clerkClient } from "@clerk/express";
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      deliveryMethod,
      fullName,
      phone,
      address,
      city,
      state,
      pinCode,
      items,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    if (!["pickup", "delivery"].includes(deliveryMethod)) {
      return res.status(400).json({
        message: "Invalid delivery method.",
      });
    }

    if (deliveryMethod === "delivery") {
      if (!fullName || !phone || !address || !city || !state || !pinCode) {
        return res.status(400).json({
          message: "Complete delivery details are required.",
        });
      }
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    const name = clerkUser.firstName || clerkUser.lastName || "Coffee Lover";

    if (!email) {
      return res.status(400).json({
        message: "No email address found for Clerk user.",
      });
    }

    let userResult = await sql`
            SELECT id
            FROM users
            WHERE clerk_user_id = ${userId}
            LIMIT 1;
        `;

    if (userResult.length === 0) {
      userResult = await sql`
                INSERT INTO users (
                    name,
                    email,
                    clerk_user_id
                )
                VALUES (
                    ${name},
                    ${email},
                    ${userId}
                )
                RETURNING id;
            `;
    }

    const userIdDb = userResult[0].id;

    const productIds = items.map((item) => item.productId);

    const products = await sql`
            SELECT
                id,
                price,
                is_available
            FROM products
            WHERE id = ANY(${productIds});
        `;

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products do not exist.",
      });
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: "Invalid product quantity.",
        });
      }

      if (!product.is_available) {
        return res.status(400).json({
          message: "One or more products are unavailable.",
        });
      }

      const price = Number(product.price);

      totalAmount += price * quantity;

      orderItems.push({
        productId: item.productId,
        quantity,
        price,
      });
    }

    totalAmount = Number(totalAmount.toFixed(2));
    const orderResult = await sql`
    INSERT INTO orders (
        user_id,
        total_amount,
        delivery_method,
        delivery_full_name,
        delivery_phone,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_pin_code
    )
    VALUES (
        ${userIdDb},
        ${totalAmount},
        ${deliveryMethod},
        ${deliveryMethod === "delivery" ? fullName : null},
        ${deliveryMethod === "delivery" ? phone : null},
        ${deliveryMethod === "delivery" ? address : null},
        ${deliveryMethod === "delivery" ? city : null},
        ${deliveryMethod === "delivery" ? state : null},
        ${deliveryMethod === "delivery" ? pinCode : null}
    )
    RETURNING id, total_amount, status, created_at;
`;

const order = orderResult[0];
for (const item of orderItems) {
    await sql`
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price
        )
        VALUES (
            ${order.id},
            ${item.productId},
            ${item.quantity},
            ${item.price}
        );
    `;
}
await sql`
    DELETE FROM cart_items
    WHERE cart_id = (
        SELECT id
        FROM carts
        WHERE user_id = ${userIdDb}
    );
`;

res.status(201).json({
    message: "Order created successfully",
    order,
});

    
  } catch (error) {
    console.error("Order creation error:", error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
};
export const getMyOrders = async (req, res) => {
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

        const orders = await sql`
            SELECT
                id,
                total_amount,
                status,
                delivery_method,
                delivery_full_name,
                delivery_phone,
                delivery_address,
                delivery_city,
                delivery_state,
                delivery_pin_code,
                created_at
            FROM orders
            WHERE user_id = ${userId}
            ORDER BY created_at DESC;
        `;

        res.json({
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);

        res.status(500).json({
            message: "Failed to fetch orders.",
        });
    }
};
export const getOrderById = async (req, res) => {
    try {
        const clerkUserId = req.userId;
        const { orderId } = req.params;

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

        const orderResult = await sql`
            SELECT
                orders.id,
                orders.total_amount,
                orders.status,
                orders.delivery_method,
                orders.delivery_full_name,
                orders.delivery_phone,
                orders.delivery_address,
                orders.delivery_city,
                orders.delivery_state,
                orders.delivery_pin_code,
                orders.created_at
            FROM orders
            WHERE orders.id = ${orderId}
              AND orders.user_id = ${userId}
            LIMIT 1;
        `;

        if (orderResult.length === 0) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        const order = orderResult[0];

        const items = await sql`
            SELECT
                order_items.product_id,
                order_items.quantity,
                order_items.price,
                products.name,
                products.image_url
            FROM order_items
            JOIN products
                ON order_items.product_id = products.id
            WHERE order_items.order_id = ${orderId}
            ORDER BY order_items.id;
        `;

        res.json({
            order,
            items,
        });
    } catch (error) {
        console.error("Error fetching order:", error);

        res.status(500).json({
            message: "Failed to fetch order.",
        });
    }
};