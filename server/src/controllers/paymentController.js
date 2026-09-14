import sql from "../db.js";
import stripe from "../stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const clerkUserId = req.userId;

    const { deliveryMethod, fullName, phone, address, city, state, pinCode } =
      req.body;

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

    // Find our database user using Clerk ID
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

    // Find user's cart
    const cartResult = await sql`
            SELECT id
            FROM carts
            WHERE user_id = ${userId}
            LIMIT 1;
        `;

    if (cartResult.length === 0) {
      return res.status(400).json({
        message: "Cart not found.",
      });
    }

    const cartId = cartResult[0].id;

    // Get cart items with prices from database
    const cartItems = await sql`
            SELECT
                cart_items.product_id,
                cart_items.quantity,
                products.name,
                products.price,
                products.is_available
            FROM cart_items
            JOIN products
                ON cart_items.product_id = products.id
            WHERE cart_items.cart_id = ${cartId};
        `;

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty.",
      });
    }

    // Validate products
    for (const item of cartItems) {
      if (!item.is_available) {
        return res.status(400).json({
          message: `${item.name} is currently unavailable.`,
        });
      }
    }

    // Calculate total from database prices
    let totalAmount = 0;

    for (const item of cartItems) {
      totalAmount += Number(item.price) * Number(item.quantity);
    }

    totalAmount = Number(totalAmount.toFixed(2));

    // Create pending order
    const orderResult = await sql`
            INSERT INTO orders (
                user_id,
                total_amount,
                status,
                delivery_method,
                delivery_full_name,
                delivery_phone,
                delivery_address,
                delivery_city,
                delivery_state,
                delivery_pin_code
            )
            VALUES (
                ${userId},
                ${totalAmount},
                'pending',
                ${deliveryMethod},
                ${deliveryMethod === "delivery" ? fullName : null},
                ${deliveryMethod === "delivery" ? phone : null},
                ${deliveryMethod === "delivery" ? address : null},
                ${deliveryMethod === "delivery" ? city : null},
                ${deliveryMethod === "delivery" ? state : null},
                ${deliveryMethod === "delivery" ? pinCode : null}
            )
            RETURNING id, total_amount, status;
        `;

    const order = orderResult[0];

    // Create order items
    for (const item of cartItems) {
      await sql`
                INSERT INTO order_items (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES (
                    ${order.id},
                    ${item.product_id},
                    ${item.quantity},
                    ${item.price}
                );
            `;
    }

    // Create Stripe line items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/checkout`,

      metadata: {
        orderId: String(order.id),
        userId: String(userId),
      },
    });

    // Save Stripe session ID
    await sql`
            UPDATE orders
            SET stripe_session_id = ${session.id}
            WHERE id = ${order.id};
        `;

    res.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    res.status(500).json({
      message: "Failed to create Stripe checkout session.",
    });
  }
};

export const getOrderIdFromSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                message: "Stripe session ID is required.",
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const orderId = session.metadata?.orderId;

        if (!orderId) {
            return res.status(404).json({
                message: "Order ID not found in Stripe session.",
            });
        }

        res.json({
            orderId,
        });
    } catch (error) {
        console.error("Error retrieving Stripe session:", error);

        res.status(500).json({
            message: "Failed to retrieve order information.",
        });
    }
};
export const handleStripeWebhook = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Stripe event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata.orderId;
      const userId = session.metadata.userId;

      console.log("Paid order:", orderId);

      await sql`
        UPDATE orders
        SET status = 'paid'
        WHERE id = ${orderId};
    `;

      await sql`
        DELETE FROM cart_items
        WHERE cart_id = (
            SELECT id
            FROM carts
            WHERE user_id = ${userId}
        );
    `;

      console.log(`Order ${orderId} marked as paid.`);
      console.log(`Cart cleared for user ${userId}.`);
    }

    res.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook error:", error);

    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
