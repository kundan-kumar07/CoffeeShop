import sql from "../db.js";

export const getDashboardStats = async (req, res) => {
    try {
        const result = await sql`
            SELECT
                (SELECT COUNT(*) FROM orders) AS total_orders,

                (
                    SELECT COALESCE(SUM(total_amount), 0)
                    FROM orders
                    WHERE status = 'paid'
                ) AS total_revenue,

                (
                    SELECT COUNT(*)
                    FROM orders
                    WHERE status = 'pending'
                ) AS pending_orders,

                (
                    SELECT COUNT(*)
                    FROM products
                ) AS total_products;
        `;

        res.json({
            stats: result[0],
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);

        res.status(500).json({
            message: "Failed to fetch dashboard statistics.",
        });
    }
};