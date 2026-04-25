const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Contains id, email, admin_type etc
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
    }
};

module.exports = { requireAuth };
