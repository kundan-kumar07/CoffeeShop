import { getAuth } from "@clerk/express";

const requireAuth = (req, res, next) => {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    req.userId = userId;

    next();
};

export default requireAuth;