const { prisma } = require('../../config/db');
const bcrypt = require('bcryptjs');


exports.authRegister = async (req, res) => {
     const { email, password } = req.body;

     if (!email || !password) {
          return res.status(400).json({ message: 'email and password are required' });
     }

     if (password.length < 8) {
          return res.status(400).json({ message: 'Password must be at least 8 characters' });
     }

     try {
          const existingUser = await prisma.admin.findUnique({
               where: { email }
          });

          if (existingUser) {
               return res.status(409).json({ message: 'email already taken' });
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await prisma.admin.create({
               data: {
                    email,
                    password: hashedPassword
               }
          });

          res.status(201).json({
               message: 'User registered successfully',
               userId: user.id
          });

     } catch (error) {
          console.error('Registration error:', error);
          res.status(500).json({ message: 'Registration failed', error: error.message });
     }
}