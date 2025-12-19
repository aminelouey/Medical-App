const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        console.log('Authentication failed: No token provided');
        return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Authentication failed: Invalid token', err.message);
            return res.status(403).json({ error: 'Token invalide ou expiré' });
        }
        req.user = user;
        console.log('User authenticated:', user.username, 'Role:', user.role);
        next();
    });
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log('Checking authorization for user:', req.user.username, 'Required roles:', roles);
        if (!roles.includes(req.user.role)) {
            console.log('Authorization failed: User role', req.user.role, 'not in', roles);
            return res.status(403).json({
                error: 'Accès refusé. Rôles autorisés : ' + roles.join(', '),
                userRole: req.user.role
            });
        }
        console.log('Authorization successful');
        next();
    };
};
