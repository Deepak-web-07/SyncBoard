import jwt from "jsonwebtoken";

export const jwtAuthMiddleware = (req, res, next) => {
    const authentication = req.headers.authentication;
    if (!authentication) {
        return res.status(401).json({ error: 'Token not found' })
    }

    const token = req.headers.authentication.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'Invalid token' })
    }
}

export const checkAdmin = async (req, res, next) => {
    try {
        // req.user contains the decoded token payload
        // The structure from generateToken is { user: payload }
        const userPayload = req.user.user;

        if (!userPayload || userPayload.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const generateToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET)
}