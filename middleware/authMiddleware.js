import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/authModel.js';

export const protect = async (req, res, next) => {
    try {
        // 1. Get token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        // 4. Verify device ID
        if (user.deviceId !== req.headers['x-device-id']) {
            return res.status(401).json({ error: 'Invalid device' });
        }

        // 5. Verify IP address
        if (user.ipAddress !== req.ip) {
            return res.status(401).json({ error: 'Invalid IP address' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Not authenticated' });
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        next();
    };
};

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});