const { query } = require('../config/db');

const User = {
    async findByEmail(email) {
        const sql = `
            SELECT u.id, u.name, u.email, u.password, u.role_id, u.is_active,
                   u.created_at, u.updated_at, r.role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.email = $1
        `;
        const result = await query(sql, [email]);
        return result.rows[0] || null;
    },

    async findById(id) {
        const sql = `
            SELECT u.id, u.name, u.email, u.role_id, u.is_active,
                   u.created_at, u.updated_at, r.role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.id = $1
        `;
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    },

    async create({ name, email, password, role_id }) {
        const sql = `
            INSERT INTO users (name, email, password, role_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role_id, is_active, created_at
        `;
        const result = await query(sql, [name, email, password, role_id]);
        return result.rows[0];
    },

    async findAll() {
        const sql = `
            SELECT u.id, u.name, u.email, u.role_id, u.is_active,
                   u.created_at, u.updated_at, r.role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        `;
        const result = await query(sql);
        return result.rows;
    },

    async update(id, { name, email, role_id, is_active }) {
        const sql = `
            UPDATE users 
            SET name = COALESCE($2, name),
                email = COALESCE($3, email),
                role_id = COALESCE($4, role_id),
                is_active = COALESCE($5, is_active),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id, name, email, role_id, is_active, updated_at
        `;
        const result = await query(sql, [id, name, email, role_id, is_active]);
        return result.rows[0] || null;
    },

    async delete(id) {
        const sql = `
            UPDATE users 
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id
        `;
        const result = await query(sql, [id]);
        return result.rowCount > 0;
    }
};

module.exports = User;
