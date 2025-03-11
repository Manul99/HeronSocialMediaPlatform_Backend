const jwt = require('jsonwebtoken')

const verifyToken = async (req,res) =>{
    const JWT_SECRECT = 'manuss' || 'default_secrect';

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. Token not provided' });
        }

        const decoded = jwt.decode(token);
        if (decoded && decoded.exp && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token expired' });
        }


        const verifiedToken = jwt.verify(token, JWT_SECRECT);
        const user = await Users.findById(verifiedToken.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(401).json({ message: 'Authentication failed' });
    }
}

module.exports = verifyToken;