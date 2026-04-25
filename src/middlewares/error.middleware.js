const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Check if it's a known postgres error
    if (err.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Data already exists (Unique constraint violation)' });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
};

module.exports = { errorHandler };
