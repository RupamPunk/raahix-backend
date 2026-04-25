const db = require('../config/db');

class RouteModel {
    static async create(data) {
        const { admin_id, name, stops_count, distance, type } = data;
        const query = `
            INSERT INTO routes (admin_id, name, stops_count, distance, type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const { rows } = await db.query(query, [admin_id, name, stops_count, distance, type]);
        return rows[0];
    }

    static async findAll(admin_id) {
        const query = `SELECT * FROM routes WHERE admin_id = $1 ORDER BY created_at DESC`;
        const { rows } = await db.query(query, [admin_id]);
        return rows;
    }

    static async findById(id, admin_id) {
        const query = `SELECT * FROM routes WHERE id = $1 AND admin_id = $2`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }

    static async update(id, admin_id, data) {
        const { name, stops_count, distance, type } = data;
        const query = `
            UPDATE routes 
            SET name = $1, stops_count = $2, distance = $3, type = $4
            WHERE id = $5 AND admin_id = $6
            RETURNING *
        `;
        const { rows } = await db.query(query, [name, stops_count, distance, type, id, admin_id]);
        return rows[0];
    }

    static async delete(id, admin_id) {
        const query = `DELETE FROM routes WHERE id = $1 AND admin_id = $2 RETURNING id`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }
}

module.exports = RouteModel;
