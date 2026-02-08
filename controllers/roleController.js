const Role = require('../models/Role');
const Permission = require('../models/Permission');

const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({ success: true, count: roles.length, data: roles });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({ success: false, message: 'Error fetching roles.', error: error.message });
    }
};

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found.' });
        }

        const permissions = await Permission.findByRoleId(id);
        res.status(200).json({ success: true, data: { ...role, permissions } });
    } catch (error) {
        console.error('Get role error:', error);
        res.status(500).json({ success: false, message: 'Error fetching role.', error: error.message });
    }
};

const createRole = async (req, res) => {
    try {
        const { role_name, description } = req.body;

        if (!role_name) {
            return res.status(400).json({ success: false, message: 'Role name is required.' });
        }

        const existingRole = await Role.findByName(role_name);
        if (existingRole) {
            return res.status(400).json({ success: false, message: 'Role with this name already exists.' });
        }

        const newRole = await Role.create({ role_name, description });
        res.status(201).json({ success: true, message: 'Role created successfully.', data: newRole });
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({ success: false, message: 'Error creating role.', error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_name, description } = req.body;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found.' });
        }

        if (role_name && role_name !== role.role_name) {
            const existingRole = await Role.findByName(role_name);
            if (existingRole) {
                return res.status(400).json({ success: false, message: 'Role name already exists.' });
            }
        }

        const updatedRole = await Role.update(id, { role_name, description });
        res.status(200).json({ success: true, message: 'Role updated successfully.', data: updatedRole });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ success: false, message: 'Error updating role.', error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);

        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found.' });
        }

        const defaultRoles = ['admin', 'hr', 'employee'];
        if (defaultRoles.includes(role.role_name)) {
            return res.status(400).json({ success: false, message: 'Cannot delete default system roles.' });
        }

        await Role.delete(id);
        res.status(200).json({ success: true, message: 'Role deleted successfully.' });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({ success: false, message: 'Error deleting role.', error: error.message });
    }
};

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll();
        res.status(200).json({ success: true, count: permissions.length, data: permissions });
    } catch (error) {
        console.error('Get permissions error:', error);
        res.status(500).json({ success: false, message: 'Error fetching permissions.', error: error.message });
    }
};

const createPermission = async (req, res) => {
    try {
        const { permission_name, description, method, endpoint } = req.body;

        if (!permission_name || !method || !endpoint) {
            return res.status(400).json({ success: false, message: 'Permission name, method, and endpoint are required.' });
        }

        const existingPermission = await Permission.findByName(permission_name);
        if (existingPermission) {
            return res.status(400).json({ success: false, message: 'Permission with this name already exists.' });
        }

        const newPermission = await Permission.create({ permission_name, description, method, endpoint });
        res.status(201).json({ success: true, message: 'Permission created successfully.', data: newPermission });
    } catch (error) {
        console.error('Create permission error:', error);
        res.status(500).json({ success: false, message: 'Error creating permission.', error: error.message });
    }
};

const getAllRolePermissions = async (req, res) => {
    try {
        const rolePermissions = await Permission.getAllRolePermissions();
        res.status(200).json({ success: true, count: rolePermissions.length, data: rolePermissions });
    } catch (error) {
        console.error('Get role permissions error:', error);
        res.status(500).json({ success: false, message: 'Error fetching role permissions.', error: error.message });
    }
};

const assignPermission = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;

        if (!role_id || !permission_id) {
            return res.status(400).json({ success: false, message: 'Role ID and Permission ID are required.' });
        }

        const role = await Role.findById(role_id);
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found.' });
        }

        const permission = await Permission.findAll();
        const permissionExists = permission.find(p => p.id === parseInt(permission_id));
        if (!permissionExists) {
            return res.status(404).json({ success: false, message: 'Permission not found.' });
        }

        const result = await Permission.assignToRole(role_id, permission_id);

        if (!result) {
            return res.status(400).json({ success: false, message: 'Permission already assigned to this role.' });
        }

        res.status(201).json({ success: true, message: 'Permission assigned to role successfully.', data: result });
    } catch (error) {
        console.error('Assign permission error:', error);
        res.status(500).json({ success: false, message: 'Error assigning permission.', error: error.message });
    }
};

const revokePermission = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;

        if (!role_id || !permission_id) {
            return res.status(400).json({ success: false, message: 'Role ID and Permission ID are required.' });
        }

        const revoked = await Permission.revokeFromRole(role_id, permission_id);

        if (!revoked) {
            return res.status(404).json({ success: false, message: 'Role-permission mapping not found.' });
        }

        res.status(200).json({ success: true, message: 'Permission revoked from role successfully.' });
    } catch (error) {
        console.error('Revoke permission error:', error);
        res.status(500).json({ success: false, message: 'Error revoking permission.', error: error.message });
    }
};

module.exports = {
    getAllRoles, getRoleById, createRole, updateRole, deleteRole,
    getAllPermissions, createPermission,
    getAllRolePermissions, assignPermission, revokePermission
};
