const express = require('express');
const router = express.Router();
const db = require('../../db/connections');

// get all employees
router.get('/employees', (req, res) => {
    const sql = `SELECT * FROM employees`;
    
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// `SELECT id, CONCAT(first_name, ' ', last_name) AS employee_name FROM employees`;

// `SELECT b.id,
//     CONCAT (a.last_name, ', ', a.first_name) AS Manager,
//     CONCAT(b.last_name, ', ', b.first_name) AS 'Direct Reporting' 
// FROM employees b
// INNER JOIN employees a ON
// a.id = b.manager_id
// ORDER BY Manager;`;

module.exports = router;