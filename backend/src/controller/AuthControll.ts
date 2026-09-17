import { Request, Response, NextFunction } from 'express';
import User from '../models/UserModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Helper for JWT generation
const generateToken = (id: number, role: string) => {
  const secret = process.env.JWT_SECRET || 'supersecretkey';
  return jwt.sign({ id, role }, secret, { expiresIn: '1d' });
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, address } = req.body;

        // 1. Form Validations according to project requirements
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character.' 
            });
        }

        if (!address || address.length > 400) {
            return res.status(400).json({ message: 'Address cannot exceed 400 characters.' });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user (Default role for public signup is 'user')
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role: 'user',
        });

        // 5. Auto-login: Generate JWT token upon successful signup
        const token = generateToken(newUser.id, newUser.role);

        return res.status(201).json({
            message: 'User registered and logged in successfully[cite: 1].',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Internal server error during signup.' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // 1. Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 2. Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 3. Generate JWT token
        const token = generateToken(user.id, user.role);

        return res.status(200).json({
            message: 'Logged in successfully[cite: 1].',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error during login.' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // Since JWT is stateless, logout is primarily handled on the client-side by clearing the token.
        // If using cookies, you would clear the cookie here (e.g., res.clearCookie('token')).
        return res.status(200).json({ message: 'Logged out successfully[cite: 1].' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error during logout.' });
    }
};

interface DecodedToken {
  id: number;
  role: string;
}

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'supersecretkey';

        // Verify the token
        const decoded = jwt.verify(token, secret) as DecodedToken;

        // Attach user info to request object for downstream controllers
        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Optional: Middleware to restrict access based on user roles
export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Access forbidden: Insufficient permissions for this action.' });
        }

        next();
    };
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        // Assuming your authentication middleware attaches user info (e.g., req.user)
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required.' });
        }

        // Validate new password against project requirements: 8-16 chars, 1 uppercase, 1 special char
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character[cite: 1].' 
            });
        }

        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password.' });
        }

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully[cite: 1].' });
    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({ message: 'Internal server error during password update.' });
    }
};

export const checkAuth = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'supersecretkey';

        // Verify token
        const decoded = jwt.verify(token, secret) as { id: number; role: string };

        // Fetch user from database (excluding password)
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User no longer exists.' });
        }

        return res.status(200).json({
            isAuthenticated: true,
            user,
        });
    } catch (error) {
        console.error('Check auth error:', error);
        return res.status(401).json({ message: 'Token is invalid or expired.' });
    }
};