const db = require('../config/db');

class BusModel {
    static async create(data) {
        const { admin_id, bus_number, bus_code, capacity, type } = data;
        const query = `
            INSERT INTO buses (admin_id, bus_number, bus_code, capacity, type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const { rows } = await db.query(query, [admin_id, bus_number, bus_code, capacity, type]);
        return rows[0];
    }

    static async findAll(admin_id) {
        const query = `SELECT * FROM buses WHERE admin_id = $1 ORDER BY created_at DESC`;
        const { rows } = await db.query(query, [admin_id]);
        return rows;
    }

    static async findById(id, admin_id) {
        const query = `SELECT * FROM buses WHERE id = $1 AND admin_id = $2`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }

    static async update(id, admin_id, data) {
        const { bus_number, bus_code, capacity, type, status } = data;
        const query = `
            UPDATE buses 
            SET bus_number = $1, bus_code = $2, capacity = $3, type = $4, status = $5
            WHERE id = $6 AND admin_id = $7
            RETURNING *
        `;
        const { rows } = await db.query(query, [bus_number, bus_code, capacity, type, status, id, admin_id]);
        return rows[0];
    }

    static async delete(id, admin_id) {
        const query = `DELETE FROM buses WHERE id = $1 AND admin_id = $2 RETURNING id`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }
}

module.exports = BusModel;
