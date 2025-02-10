const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * Get a list of users with filtering, sorting, and pagination
 */
exports.getUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, sortBy = 'createdAt', order = 'ASC', role } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        
        const whereClause = role ? { role } : {}; // Filter by role if provided

        const users = await User.findAndCountAll({
            where: whereClause,
            limit,
            offset: (page - 1) * limit,
            order: [[sortBy, order.toUpperCase()]],
            attributes: { exclude: ['password'] } // Exclude password from response
        });

        res.json({
            totalUsers: users.count,
            totalPages: Math.ceil(users.count / limit),
            currentPage: page,
            users: users.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update user details (Admin can update any user, User can update only themselves)
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, role } = req.body;

        // Check if user exists
        let user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Only Admins can update roles, non-admins can only update their own profile
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: "Unauthorized to update this user" });
        }

        // Hash password if updating
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        await user.update({
            email: email || user.email,
            password: hashedPassword || user.password,
            role: req.user.role === 'admin' ? role || user.role : user.role
        });

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete user (Only Admins can delete users)
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized to delete users" });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
