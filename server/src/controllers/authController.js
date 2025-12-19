const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.register = async (req, res) => {
    try {
        const { username, email, password, fullName, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Default to 'patient' role if not admin creating (simulated for now, allowing role choice)
        // In production, role assignment should be protected.

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            fullName,
            role: role || 'patient'
        });

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, fullName: user.fullName },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
