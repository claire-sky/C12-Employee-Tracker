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

// add an employee
router.post('/employee/', ({ body }, res) => {
    const sql = `INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?,?)`;
    const params = [body.id, body.first_name, body.last_name, body.role_id, body.manager_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// delete an employee
router.delete('/employee/:id', (req, res) => {
    const sql = `DELETE FROM employees WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: 'Employee not found'});
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                name: req.params.id
            });
        }
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