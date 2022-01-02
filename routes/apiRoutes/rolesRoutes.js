const express = require('express');
const router = express.Router();
const db = require('../../db/connections');

// get all roles
router.get('/roles', (req, res) => {
    const sql = `SELECT * FROM roles`;
    
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

// add a role
router.post('/role/', ({ body }, res) => {
    const sql = `INSERT INTO roles (id, title, salary, department_id)
        VALUES (?,?,?,?)`;
    const params = [body.id, body.title, body.salary, body.department_id];

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

// delete a role
router.delete('/role/:title', (req, res) => {
    const sql = `DELETE FROM roles WHERE title = ?`;
    const params = [req.params.title];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({ message: 'Role not found'});
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                name: req.params.title
            });
        }
    });
});

module.exports = router;