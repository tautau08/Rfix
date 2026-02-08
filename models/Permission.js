const { query } = require('../config/db');

const Permission = {
    async checkPermission(roleId, method, endpoint) {
        const sql = `
            SELECT COUNT(*) as count
            FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = $1 
            AND p.method = $2
            AND (
                p.endpoint = $3 
                OR $3 ~ ('^' || REPLACE(REPLACE(p.endpoint, ':id', '[0-9]+'), '/', '\\/') || '$')
            )
        `;
        const result = await query(sql, [roleId, method.toUpperCase(), endpoint]);
        return parseInt(result.rows[0].count) > 0;
    },

    async findByRoleId(roleId) {
        const sql = `
            SELECT p.id, p.permission_name, p.description, p.method, p.endpoint
            FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = $1
            ORDER BY p.permission_name
        `;
        const result = await query(sql, [roleId]);
        return result.rows;
    },

    async findAll() {
        const sql = `SELECT id, permission_name, description, method, endpoint, created_at FROM permissions ORDER BY permission_name`;
        const result = await query(sql);
        return result.rows;
    },

    async findByName(permissionName) {
        const sql = `SELECT id, permission_name, description, method, endpoint, created_at FROM permissions WHERE permission_name = $1`;
        const result = await query(sql, [permissionName]);
        return result.rows[0] || null;
    },

    async create({ permission_name, description, method, endpoint }) {
        const sql = `
            INSERT INTO permissions (permission_name, description, method, endpoint)
            VALUES ($1, $2, $3, $4)
            RETURNING id, permission_name, description, method, endpoint, created_at
        `;
        const result = await query(sql, [permission_name, description, method.toUpperCase(), endpoint]);
        return result.rows[0];
    },

    async assignToRole(roleId, permissionId) {
        const sql = `
            INSERT INTO role_permissions (role_id, permission_id)
            VALUES ($1, $2)
            ON CONFLICT (role_id, permission_id) DO NOTHING
            RETURNING id, role_id, permission_id, created_at
        `;
        const result = await query(sql, [roleId, permissionId]);
        return result.rows[0];
    },

    async revokeFromRole(roleId, permissionId) {
        const sql = `DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2 RETURNING id`;
        const result = await query(sql, [roleId, permissionId]);
        return result.rowCount > 0;
    },

    async getAllRolePermissions() {
        const sql = `
            SELECT rp.id, rp.role_id, r.role_name, rp.permission_id,
                   p.permission_name, p.method, p.endpoint
            FROM role_permissions rp
            JOIN roles r ON rp.role_id = r.id
            JOIN permissions p ON rp.permission_id = p.id
            ORDER BY r.role_name, p.permission_name
        `;
        const result = await query(sql);
        return result.rows;
    }
};

module.exports = Permission;
