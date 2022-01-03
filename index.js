const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connections');

const routing = () => {
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'main',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Delete a Department',
                'Delete a Role',
                'Delete an Employee',
                'Update an Employee Role',
                'Update an Employee Manager',
                'Exit'
            ]
        }
    ])
        .then(({ main }) => {
            switch (main) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add a Department':
                    AddDepartment();
                    break;
                case 'Add a Role':
                    AddRole();
                    break;
                case 'Add an Employee':
                    AddEmployee();
                    break;
                case 'Delete a Department':
                    DeleteDepartment();
                    break;
                case 'Delete a Role':
                    DeleteRole();
                    break;
                case 'Delete an Employee':
                    DeleteEmployee();
                    break;
                case 'Update an Employee Role':
                    UpdateEmployeeRole();
                    break;
                case 'Update an Employee Manager':
                    UpdateEmployeeManager();
                    break;
                case 'Exit':
                    process.exit();
            }
        });
};

const viewAllDepartments = () => {
    const sql = `SELECT * FROM departments ORDER BY id`;

    db.promise().query(sql)
        .then(rows => {
            console.table(rows[0]);
        })
        .then(routing);
};

const viewAllRoles = () => {
    const sql = `SELECT * FROM roles ORDER BY id`;

    db.promise().query(sql)
        .then(rows => {
            console.table(rows[0]);
        })
        .then(routing);
};

const viewAllEmployees = () => {
    const sql = `SELECT * FROM employees ORDER BY id`;

    db.promise().query(sql)
        .then(rows => {
            console.table(rows[0]);
        })
        .then(routing);
};

const AddDepartment = () => {
    const sql = `INSERT INTO departments (department) VALUES (?)`;

    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the department name?'
        }
    ])
        .then(data =>
            db.promise().query(sql, data.department, (err, result) => {
                if (err) throw err;
            })
                .then(viewAllDepartments)
        )
};

const AddRole = () => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    db.query(`SELECT * FROM departments ORDER BY id`, (err, result) => {
        if (err) throw err;
        const departmentList = result.map(({ id, department }) => ({ name: department, value: id }))
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the role title?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the role salary?'
            },
            {
                type: 'rawlist',
                name: 'department_id',
                message: 'Select the department id',
                choices: departmentList
            }
        ])
            .then(data =>
                db.promise().query(sql, [data.title, data.salary, data.department_id], (err, result) => {
                    if (err) throw err;
                })
                    .then(viewAllRoles)
            )
    });
};

const AddEmployee = () => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;
    db.query(`SELECT * FROM employees ORDER BY last_name`, (err, result) => {
        if (err) throw err;
        const managerList = result.map(({ first_name, last_name, id }) => (
            { name: first_name + ' ' + last_name, value: id }))
        db.query(`SELECT * FROM roles ORDER BY id`, (err, result) => {
            if (err) throw err;
            const roleList = result.map(({ id, title }) => ({ name: title, value: id }))
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first_name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last_name?"
                },
                {
                    type: 'rawlist',
                    name: 'role_id',
                    message: "Select the employee's role",
                    choices: roleList
                },
                {
                    type: 'rawlist',
                    name: 'manager_id',
                    message: 'Select a manager',
                    choices: managerList
                }
            ])
                .then(data =>
                    db.promise().query(sql, [data.first_name, data.last_name, data.role_id, data.manager_id], (err, result) => {
                        if (err) throw err;
                    })
                        .then(viewAllEmployees)
                )
        });
    });
};

const DeleteDepartment = () => {
    const sql = `DELETE FROM departments WHERE id = ?`;
    db.query(`SELECT * FROM departments ORDER BY id`, (err, result) => {
        if (err) throw err;
        const departmentList = result.map(({ id, department }) => ({ name: department, value: id }))
        inquirer.prompt([
            {
                type: 'rawlist',
                name: 'department',
                message: 'Select the department to remove',
                choices: departmentList
            }
        ])
            .then(data =>
                db.promise().query(sql, data.department, (err, result) => {
                    if (err) throw err;
                })
                    .then(viewAllDepartments)
            )
    });
};

const DeleteRole = () => {
    const sql = `DELETE FROM roles WHERE id = ?`;
    db.query(`SELECT * FROM roles ORDER BY id`, (err, result) => {
        if (err) throw err;
        const roleList = result.map(({ id, title }) => ({ name: title, value: id }))
        inquirer.prompt([
            {
                type: 'rawlist',
                name: 'title',
                message: 'Select the role to remove',
                choices: roleList
            }
        ])
            .then(data =>
                db.promise().query(sql, data.title, (err, result) => {
                    if (err) throw err;
                })
                    .then(viewAllRoles)
            )
    });
};

const DeleteEmployee = () => {
    const sql = `DELETE FROM employees WHERE id = ?`;
    db.query(`SELECT * FROM employees ORDER BY id`, (err, result) => {
        if (err) throw err;
        const employeeList = result.map(({ id, first_name, last_name }) => (
            { name: first_name + ' ' + last_name, value: id }))
        inquirer.prompt([
            {
                type: 'rawlist',
                name: 'employee',
                message: 'Select the employee to remove',
                choices: employeeList
            }
        ])
            .then(data =>
                db.promise().query(sql, data.employee, (err, result) => {
                    if (err) throw err;
                })
                    .then(viewAllEmployees)
            )
    });
};

const UpdateEmployeeRole = () => {
    const sql = `UPDATE employees SET role_id = ?
    WHERE id = ?`;
    db.query(`SELECT * FROM employees ORDER BY last_name`, (err, result) => {
        if (err) throw err;
        const employeeList = result.map(({ first_name, last_name, id }) => (
            { name: first_name + ' ' + last_name, value: id }))
        db.query(`SELECT * FROM roles ORDER BY id`, (err, result) => {
            if (err) throw err;
            const roleList = result.map(({ id, title }) => ({ name: title, value: id }))
            inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'id',
                    message: 'Select an employee to update',
                    choices: employeeList
                },
                {
                    type: 'rawlist',
                    name: 'role_id',
                    message: "Select the employee's new role",
                    choices: roleList
                }
            ])
                .then(data =>
                    db.promise().query(sql, [data.role_id, data.id], (err, result) => {
                        if (err) throw err;
                    })
                        .then(viewAllEmployees)
                )
        });
    });
};

const UpdateEmployeeManager = () => {
    const sql = `UPDATE employees SET manager_id = ?
    WHERE id = ?`;
    db.query(`SELECT * FROM employees ORDER BY last_name`, (err, result) => {
        if (err) throw err;
        const employeeList = result.map(({ first_name, last_name, id }) => (
            { name: first_name + ' ' + last_name, value: id }))
            db.query(`SELECT * FROM employees ORDER BY last_name`, (err, result) => {
                if (err) throw err;
                const managerList = result.map(({ first_name, last_name, id }) => (
                    { name: first_name + ' ' + last_name, value: id }))
            inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'id',
                    message: 'Select an employee to update',
                    choices: employeeList
                },
                {
                    type: 'rawlist',
                    name: 'manager_id',
                    message: "Select the employee's new manager",
                    choices: managerList
                }
            ])
                .then(data =>
                    db.promise().query(sql, [data.manager_id, data.id], (err, result) => {
                        if (err) throw err;
                    })
                        .then(viewAllEmployees)
                )
        });
    });
};


routing();