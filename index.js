const inquirer = require("inquirer");
const con = require('./server.js');

con.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
  questions();
});

function questions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.options) {
        case "View All Departments":
          con.query("SELECT id, class AS department FROM department ORDER BY id;", function (err, results) {
            if (err) throw err;
            console.table(results);
          });
        break;
        case "View All Roles":
          con.query("SELECT job.id, job.title AS job_title, job.salary AS salary, department.class AS department FROM job JOIN department ON job.department_id = department.id ORDER BY job.id;", 
          function (err, results) {
            if (err) throw err;
            console.table(results);
          });
        break;
        case "View All Employees":
          con.query("SELECT e.id, e.first_name, e.last_name, j.title AS job_title, CONCAT(m.first_name, ' ', m.last_name) AS manager_name, d.class AS department FROM employee e JOIN job j ON e.job_id = j.id LEFT JOIN employee m ON e.manager_id = m.id JOIN department d ON e.department_id = d.id ORDER BY e.id;", 
          function (err, results) {
            if (err) throw err;
            console.table(results);
          });
        break;
        case "Add a Department":
            const newDep = inquirer.prompt([
                {
                  type: 'input',
                  name: 'depName',
                  message: 'What is the name of the department?',
                  validate: function (input) {
                    return input === '' ? 'ERROR: Please enter the department name' : true;
                  },
                },
              ]);
        break;
        case "Add a Role":
            const newRole = inquirer.prompt([
                {
                  type: 'input',
                  name: 'depName',
                  message: 'What is the name of the role?',
                  validate: function (input) {
                    return input === '' ? 'ERROR: Please enter the role name' : true;
                  },
                },
              ]);
        break;
        case "Add an Employee":
            const newEmp = inquirer.prompt([
                {
                  type: 'input',
                  name: 'depName',
                  message: 'What is the name of the employee?',
                  validate: function (input) {
                    return input === '' ? 'ERROR: Please enter the employee name' : true;
                  },
                },
              ]);
        break;
        case "Update an Employee role":
            const updEmp = inquirer.prompt([
                {
                  type: 'input',
                  name: 'updateEmp',
                  message: 'Which employee would you like to update?',
                  validate: function (input) {
                    return input === '' ? 'ERROR: Please enter the employee name' : true;
                  },
                },
                {
                    type: 'input',
                    name: 'updateRole',
                    message: 'What role would you like to give this employee?',
                    validate: function (input) {
                        return input === '' ? 'ERROR: Please enter the role name' : true;
                    },
                  },
              ]);
        break;
      }
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
}