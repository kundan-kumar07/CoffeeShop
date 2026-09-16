import sql from "../db.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await sql`
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
                orders.created_at,
                users.name AS user_name,
                users.email AS user_email
            FROM orders
            JOIN users
                ON orders.user_id = users.id
            ORDER BY orders.created_at DESC;
        `;

        res.json({
            orders,
        });
    } catch (error) {
        console.error("Error fetching admin orders:", error);

        res.status(500).json({
            message: "Failed to fetch orders.",
        });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "paid",
            "preparing",
            "ready",
            "out_for_delivery",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status.",
            });
        }

        const orderResult = await sql`
            SELECT
                id,
                delivery_method,
                status
            FROM orders
            WHERE id = ${orderId}
            LIMIT 1;
        `;

        if (orderResult.length === 0) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        const order = orderResult[0];

        const validTransitions = {
            pickup: {
                paid: ["preparing", "cancelled"],
                preparing: ["ready", "cancelled"],
                ready: ["delivered", "cancelled"],
            },
            delivery: {
                paid: ["preparing", "cancelled"],
                preparing: ["ready", "cancelled"],
                ready: ["out_for_delivery", "cancelled"],
                out_for_delivery: ["delivered"],
            },
        };

        const nextStatuses =
            validTransitions[order.delivery_method]?.[order.status] || [];

        if (!nextStatuses.includes(status)) {
            return res.status(400).json({
                message: `Cannot change order from ${order.status} to ${status}.`,
            });
        }

        const updatedOrder = await sql`
            UPDATE orders
            SET status = ${status}
            WHERE id = ${orderId}
            RETURNING id, status;
        `;

        res.json({
            message: "Order status updated successfully.",
            order: updatedOrder[0],
        });
    } catch (error) {
        console.error("Error updating order status:", error);

        res.status(500).json({
            message: "Failed to update order status.",
        });
    }
};