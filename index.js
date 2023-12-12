const inquirer = require("inquirer");
const con = require("./server.js");

con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the database");
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
          "View All Job Titles",
          "View All Employees",
          "Add a Department",
          "Add a Title",
          "Add an Employee",
          "Update an Employee Title",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.options) {
        // VIEW DEPARTMENT OPTIONS
        case "View All Departments":
          con.query(
            "SELECT id, class AS department FROM department ORDER BY id;",
            function (err, results) {
              if (err) throw err;
              console.table(results);
            }
          );
          break;

        // VIEW JOB OPTIONS
        case "View All Job Titles":
          con.query(
            "SELECT job.id, job.title AS job_title, job.salary AS salary, department.class AS department FROM job JOIN department ON job.department_id = department.id ORDER BY job.id;",
            function (err, results) {
              if (err) throw err;
              console.table(results);
            }
          );
          break;

        // VIEW EMPLOYEE OPTIONS
        case "View All Employees":
          con.query(
            "SELECT e.id, e.first_name, e.last_name, j.title AS job_title, CONCAT(m.first_name, ' ', m.last_name) AS manager_name, d.class AS department FROM employee e JOIN job j ON e.job_id = j.id LEFT JOIN employee m ON e.manager_id = m.id JOIN department d ON e.department_id = d.id ORDER BY e.id;",
            function (err, results) {
              if (err) throw err;
              console.table(results);
            }
          );
          break;

        // ADD DEPARTMENT OPTIONS
        case "Add a Department":
          inquirer
            .prompt([
              {
                type: "input",
                name: "depName",
                message: "What is the name of the new department?",
                validate: function (input) {
                  return input === ""
                    ? "ERROR: Please enter the department name"
                    : true;
                },
              },
            ])
            .then((answers) => {
              const newDepName = answers.depName;

              con.query(
                "INSERT INTO department (class) VALUES (?)",
                [newDepName],
                function (err, result) {
                  if (err) throw err;
                  console.log(
                    `Successfully added ${newDepName} to the department`
                  );

                  con.query(
                    "SELECT id, class AS department FROM department ORDER BY id",
                    function (err, results) {
                      if (err) throw err;
                      console.table(results);
                    }
                  );
                }
              );
            });
          break;

        // ADD JOB TITLE OPTIONS
        case "Add a Title":
          con.query("SELECT class FROM department", function (err, results) {
            if (err) throw err;
            const departmentClasses = results.map((result) => result.class);

            inquirer
              .prompt([
                {
                  type: "input",
                  name: "jobTitle",
                  message: "What is the name of the new job title?",
                  validate: function (input) {
                    return input === ""
                      ? "ERROR: Please enter the job title"
                      : true;
                  },
                },
                {
                  type: "list",
                  name: "jobDep",
                  message: "Which department does this job title fall under?",
                  choices: departmentClasses,
                },
                {
                  type: "input",
                  name: "jobSalary",
                  message: "How much is the salary?",
                  validate: function (input) {
                    return input === ""
                      ? "ERROR: Please enter the salary"
                      : true;
                  },
                },
              ])
              .then((answers) => {
                const newJobTitle = answers.jobTitle;
                const selectedDepartment = answers.jobDep;

                con.query(
                  "INSERT INTO job (title, department_id, salary) VALUES (?, (SELECT id FROM department WHERE class = ?), ?)",
                  [newJobTitle, selectedDepartment, answers.jobSalary],
                  function (err, result) {
                    if (err) throw err;
                    console.log(
                      `Successfully added ${newJobTitle} to the list of job titles`
                    );

                    con.query(
                      "SELECT job.id, job.title AS job_title, job.salary AS salary, department.class AS department FROM job JOIN department ON job.department_id = department.id ORDER BY job.id",
                      function (err, results) {
                        if (err) throw err;
                        console.table(results);
                      }
                    );
                  }
                );
              });
          });
          break;

        // ADD EMPLOYEE OPTIONS
        case "Add an Employee":
          const newEmp = inquirer.prompt([
            {
              type: "input",
              name: "depName",
              message: "What is the name of the employee?",
              validate: function (input) {
                return input === ""
                  ? "ERROR: Please enter the employee name"
                  : true;
              },
            },
          ]);
          break;

        // UPDATE EMPLOYEE INFO OPTION
        case "Update an Employee Title":
          const updEmp = inquirer.prompt([
            {
              type: "input",
              name: "updateEmp",
              message: "Which employee would you like to update?",
              validate: function (input) {
                return input === ""
                  ? "ERROR: Please enter the employee name"
                  : true;
              },
            },
            {
              type: "input",
              name: "updateRole",
              message: "What role would you like to give this employee?",
              validate: function (input) {
                return input === ""
                  ? "ERROR: Please enter the role name"
                  : true;
              },
            },
          ]);
          break;

        // EXIT OPTION
        case "Exit":
          console.log("Goodbye!");
          break;
      }
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
}