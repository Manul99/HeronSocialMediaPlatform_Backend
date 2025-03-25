const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'manuss'; // Define secret once

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. Token not provided' });
        }

        // Verify and decode token
        const verifiedToken = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', verifiedToken); // Debugging

        if (!verifiedToken.id) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await User.findById(verifiedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = { id: user._id.toString() }; // Ensure ID is a string
        console.log('User attached to request:', req.user);

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = { id: decoded.id }; // Store user ID
        next();
    } catch (error) {
        console.error('Token error:', error);
        res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
};

module.exports = { verifyToken, authMiddleware };
