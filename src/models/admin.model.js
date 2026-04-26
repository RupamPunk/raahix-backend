const db = require('../config/db');

class AdminModel {
    static async findByPhoneOrEmail(emailOrPhone) {
        const query = `
            SELECT * FROM admins 
            WHERE email = $1 OR phone = $1
        `;
        const { rows } = await db.query(query, [emailOrPhone]);
        return rows[0];
    }

    static async findById(id) {
        const query = `
            SELECT id, name, phone, email, admin_type, u_id, school_name, city, created_at 
            FROM admins 
            WHERE id = $1
        `;
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    static async create(adminData) {
        const { name, phone, email, password, admin_type, u_id, school_name, city } = adminData;
        
        // Only insert columns that exist in the admins table.
        // bus_code_number and service_type are NOT in the schema — they live on the bus/org records.
        const query = `
            INSERT INTO admins 
            (name, phone, email, password, admin_type, u_id, school_name, city) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING id, name, email, admin_type, u_id, school_name
        `;
        
        const values = [name, phone, email, password, admin_type, u_id || null, school_name || null, city || null];
        const { rows } = await db.query(query, values);
        return rows[0];
    }
}

module.exports = AdminModel;
