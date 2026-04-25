const db = require('../config/db');

class DriverModel {
    static async create(data) {
        const { admin_id, name, phone, license_no } = data;
        const query = `
            INSERT INTO drivers (admin_id, name, phone, license_no)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const { rows } = await db.query(query, [admin_id, name, phone, license_no]);
        return rows[0];
    }

    static async findAll(admin_id) {
        const query = `SELECT * FROM drivers WHERE admin_id = $1 ORDER BY created_at DESC`;
        const { rows } = await db.query(query, [admin_id]);
        return rows;
    }

    static async findById(id, admin_id) {
        const query = `SELECT * FROM drivers WHERE id = $1 AND admin_id = $2`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }

    static async update(id, admin_id, data) {
        const { name, phone, license_no, status } = data;
        const query = `
            UPDATE drivers 
            SET name = $1, phone = $2, license_no = $3, status = $4
            WHERE id = $5 AND admin_id = $6
            RETURNING *
        `;
        const { rows } = await db.query(query, [name, phone, license_no, status, id, admin_id]);
        return rows[0];
    }

    static async delete(id, admin_id) {
        const query = `DELETE FROM drivers WHERE id = $1 AND admin_id = $2 RETURNING id`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }
}

module.exports = DriverModel;
