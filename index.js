const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connections');

const routing = () => {
    return inquirer.prompt([
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
                break;
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


const viewAllRoles= () => {
    const sql = `SELECT * FROM roles ORDER BY id`;
        
    db.promise().query(sql)
    .then(rows => {
        console.table(rows[0]);
    })
    .then(routing);
};

const viewAllEmployees= () => {
    const sql = `SELECT * FROM employees ORDER BY id`;
        
    db.promise().query(sql)
    .then(rows => {
        console.table(rows[0]);
    })
    .then(routing);
};

const AddDepartment= () => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    
    return inquirer.prompt([
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

// const AddRole= () => {};
// const AddEmployee= () => {};
// const DeleteDepartment= () => {};
// const DeleteRole= () => {};
// const DeleteEmployee= () => {};
// const UpdateEmployeeRole= () => {};
// const UpdateEmployeeManager= () => {};


routing();