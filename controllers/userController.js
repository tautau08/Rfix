const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role_name,
                is_active: user.is_active,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Error fetching profile.', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, current_password, new_password } = req.body;
        const userId = req.user.id;
        const user = await User.findByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let hashedPassword = null;
        if (new_password) {
            if (!current_password) {
                return res.status(400).json({ success: false, message: 'Current password is required to change password.' });
            }

            const isPasswordValid = await bcrypt.compare(current_password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
            }

            if (new_password.length < 6) {
                return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
            }

            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(new_password, salt);
        }

        if (email && email !== user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use.' });
            }
        }

        const updatedUser = await User.update(userId, {
            name: name || user.name,
            email: email || user.email
        });

        if (hashedPassword) {
            const { query } = require('../config/db');
            await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, userId]);
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Error updating profile.', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role_name,
                is_active: user.is_active,
                created_at: user.created_at
            }))
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Error fetching users.', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role_name,
                is_active: user.is_active,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Error fetching user.', error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role_name } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists.' });
        }

        const roleName = role_name || 'employee';
        const role = await Role.findByName(roleName);

        if (!role) {
            return res.status(400).json({ success: false, message: `Role '${roleName}' does not exist.` });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword, role_id: role.id });

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: { id: newUser.id, name: newUser.name, email: newUser.email, role: roleName }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Error creating user.', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role_name, is_active } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let roleId = user.role_id;
        if (role_name) {
            const role = await Role.findByName(role_name);
            if (!role) {
                return res.status(400).json({ success: false, message: `Role '${role_name}' does not exist.` });
            }
            roleId = role.id;
        }

        if (email && email !== user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use.' });
            }
        }

        const updatedUser = await User.update(id, { name, email, role_id: roleId, is_active });

        res.status(200).json({ success: true, message: 'User updated successfully.', data: updatedUser });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Error updating user.', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
        }

        await User.delete(id);

        res.status(200).json({ success: true, message: 'User deactivated successfully.' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Error deleting user.', error: error.message });
    }
};

module.exports = { getProfile, updateProfile, getAllUsers, getUserById, createUser, updateUser, deleteUser };
