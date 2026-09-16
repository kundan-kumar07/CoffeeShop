import { clerkClient } from "@clerk/express";

const requireAdmin = async (req, res, next) => {
    try {
        const user = await clerkClient.users.getUser(req.userId);

        if (user.publicMetadata?.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        next();
    } catch (error) {
        console.error("Admin authorization error:", error);

        return res.status(500).json({
            message: "Failed to verify admin access.",
        });
    }
};

export default requireAdmin;