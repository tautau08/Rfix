const { query } = require('../config/db');

const Role = {
    async findByName(roleName) {
        const sql = `SELECT id, role_name, description, created_at FROM roles WHERE role_name = $1`;
        const result = await query(sql, [roleName]);
        return result.rows[0] || null;
    },

    async findById(id) {
        const sql = `SELECT id, role_name, description, created_at FROM roles WHERE id = $1`;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    },

    async findAll() {
        const sql = `SELECT id, role_name, description, created_at FROM roles ORDER BY id`;
        const result = await query(sql);
        return result.rows;
    },

    async create({ role_name, description }) {
        const sql = `
            INSERT INTO roles (role_name, description)
            VALUES ($1, $2)
            RETURNING id, role_name, description, created_at
        `;
        const result = await query(sql, [role_name, description]);
        return result.rows[0];
    },

    async update(id, { role_name, description }) {
        const sql = `
            UPDATE roles 
            SET role_name = COALESCE($2, role_name),
                description = COALESCE($3, description)
            WHERE id = $1
            RETURNING id, role_name, description, created_at
        `;
        const result = await query(sql, [id, role_name, description]);
        return result.rows[0] || null;
    },

    async delete(id) {
        const sql = `DELETE FROM roles WHERE id = $1 RETURNING id`;
        const result = await query(sql, [id]);
        return result.rowCount > 0;
    }
};

module.exports = Role;
