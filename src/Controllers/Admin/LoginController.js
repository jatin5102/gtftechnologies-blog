const { prisma } = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.authLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await prisma.admin.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const userData = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        res.json({
            message: 'Login successful',
            token,
            record: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed',
            error: error.message
        });
    }
}

exports.checkAuth = async (req, res) => {
    try {
        res.status(200).json({ status: true, statusCode: 200, message: 'Valid Token' });
    } catch (error) {
        res.status(500).json({ status: true, statusCode: 500, message: 'Invalid Token', error: error.message });
    }
}