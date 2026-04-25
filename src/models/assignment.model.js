const db = require('../config/db');

class AssignmentModel {
    static async create(data) {
        const { admin_id, bus_id, driver_id, route_id, timing } = data;
        const query = `
            INSERT INTO assignments (admin_id, bus_id, driver_id, route_id, timing)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const { rows } = await db.query(query, [admin_id, bus_id, driver_id, route_id, timing]);
        return rows[0];
    }

    static async findAll(admin_id) {
        const query = `
            SELECT a.*, 
                   b.bus_number, 
                   d.name as driver_name, 
                   r.name as route_name
            FROM assignments a
            LEFT JOIN buses b ON a.bus_id = b.id
            LEFT JOIN drivers d ON a.driver_id = d.id
            LEFT JOIN routes r ON a.route_id = r.id
            WHERE a.admin_id = $1 
            ORDER BY a.created_at DESC
        `;
        const { rows } = await db.query(query, [admin_id]);
        return rows;
    }

    static async findById(id, admin_id) {
        const query = `SELECT * FROM assignments WHERE id = $1 AND admin_id = $2`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }

    static async update(id, admin_id, data) {
        const { bus_id, driver_id, route_id, timing } = data;
        const query = `
            UPDATE assignments 
            SET bus_id = $1, driver_id = $2, route_id = $3, timing = $4
            WHERE id = $5 AND admin_id = $6
            RETURNING *
        `;
        const { rows } = await db.query(query, [bus_id, driver_id, route_id, timing, id, admin_id]);
        return rows[0];
    }

    static async delete(id, admin_id) {
        const query = `DELETE FROM assignments WHERE id = $1 AND admin_id = $2 RETURNING id`;
        const { rows } = await db.query(query, [id, admin_id]);
        return rows[0];
    }

    static async findLiveTracking(admin_id) {
        const query = `
            SELECT
                a.id AS assignment_id,
                a.bus_id,
                a.driver_id,
                a.route_id,
                a.timing,
                b.bus_number,
                b.bus_code,
                b.status AS bus_status,
                d.name AS driver_name,
                d.status AS driver_status,
                r.name AS route_name,
                ll.id AS live_location_id,
                ll.latitude,
                ll.longitude,
                ll.speed,
                ll.updated_at
            FROM assignments a
            LEFT JOIN buses b ON a.bus_id = b.id
            LEFT JOIN drivers d ON a.driver_id = d.id
            LEFT JOIN routes r ON a.route_id = r.id
            LEFT JOIN LATERAL (
                SELECT id, latitude, longitude, speed, updated_at
                FROM live_locations
                WHERE assignment_id = a.id
                ORDER BY updated_at DESC
                LIMIT 1
            ) ll ON true
            WHERE a.admin_id = $1
            ORDER BY a.created_at DESC
        `;
        const { rows } = await db.query(query, [admin_id]);
        return rows;
    }
}

module.exports = AssignmentModel;
