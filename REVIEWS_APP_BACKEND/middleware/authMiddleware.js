const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Role = db.Role;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        // Optionally fetch user details
        const user = await User.findByPk(decoded.userId, { include: Role });
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user.role = user.Role.name;
        req.user.id = user.id; // Add this line to set user id on req.user
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log('authorizeRoles middleware - user role:', req.user.role, 'allowed roles:', roles);
        if (!roles.includes(req.user.role)) {
            console.log('Authorization failed: user role not in allowed roles');
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        next();
    };
};
