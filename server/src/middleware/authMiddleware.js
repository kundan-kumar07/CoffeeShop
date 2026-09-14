import { getAuth, clerkClient } from "@clerk/express";
import sql from "../db.js";

const requireAuth = async (req, res, next) => {
    try {
        const { isAuthenticated, userId } = getAuth(req);

        if (!isAuthenticated) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        req.userId = userId;

        const user = await clerkClient.users.getUser(userId);

        const email = user.emailAddresses[0]?.emailAddress;
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

        const userResult = await sql`
            SELECT id
            FROM users
            WHERE clerk_user_id = ${userId}
            LIMIT 1;
        `;

        if (userResult.length === 0) {
            await sql`
                INSERT INTO users (
                    name,
                    email,
                    clerk_user_id
                )
                VALUES (
                    ${name},
                    ${email},
                    ${userId}
                );
            `;
        }

        next();
    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(500).json({
            message: "Failed to authenticate user.",
        });
    }
};

export default requireAuth;