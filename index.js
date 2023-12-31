const inquirer = require("inquirer");
const con = require("./server.js");

// Connect to the port in server.js and log if connected or not
con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the database");
  questions();
});

// OPTIONS FOR THE EMPLOYEE TRACKER
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
          con.query("SELECT class FROM department", function (err, results) {
            if (err) throw err;

            const departmentClasses = results.map((result) => result.class);

            con.query(
              "SELECT DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee AS manager JOIN employee AS subordinate ON manager.id = subordinate.manager_id",
              function (err, managerResults) {
                if (err) throw err;

                inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "firstName",
                      message: "What is the employee's first name?",
                      validate: function (input) {
                        return input === ""
                          ? "ERROR: Please enter the employee's first name"
                          : true;
                      },
                    },
                    {
                      type: "input",
                      name: "lastName",
                      message: "What is the employee's last name?",
                      validate: function (input) {
                        return input === ""
                          ? "ERROR: Please enter the employee's last name"
                          : true;
                      },
                    },
                    {
                      type: "input",
                      name: "empJob",
                      message: "What is the employee's job title?",
                      validate: function (input) {
                        return input === ""
                          ? "ERROR: Please enter the employee's job title"
                          : true;
                      },
                    },
                    {
                      type: "list",
                      name: "empDep",
                      message: "Which department is the employee under?",
                      choices: departmentClasses,
                    },
                    {
                      type: "list",
                      name: "empMang",
                      message: "Does the employee work under someone?",
                      choices: managerResults.map(
                        (result) => result.manager_name
                      ),
                    },
                  ])
                  .then((answers) => {
                    const newEmpFirstName = answers.firstName;
                    const newEmpLastName = answers.lastName;
                    const selectedJobTitle = answers.empJob;
                    const selectedDepartment = answers.empDep;
                    const selectedManager = answers.empMang;

                    con.query(
                      "INSERT INTO employee (first_name, last_name, job_id, department_id, manager_id) VALUES (?, ?, (SELECT id FROM job WHERE title = ?), (SELECT id FROM department WHERE class = ?), (SELECT m.id FROM employee m JOIN employee e ON m.id = e.manager_id WHERE CONCAT(m.first_name, ' ', m.last_name) = ? LIMIT 1));",
                      [
                        newEmpFirstName,
                        newEmpLastName,
                        selectedJobTitle,
                        selectedDepartment,
                        selectedManager,
                      ],
                      function (err, result) {
                        if (err) throw err;

                        console.log(
                          `${newEmpFirstName} ${newEmpLastName} has been successfully added`
                        );

                        // Display the updated employee list with details
                        con.query(
                          "SELECT e.id, e.first_name, e.last_name, j.title AS job_title, CONCAT(m.first_name, ' ', m.last_name) AS manager_name, d.class AS department FROM employee e JOIN job j ON e.job_id = j.id LEFT JOIN employee m ON e.manager_id = m.id JOIN department d ON e.department_id = d.id ORDER BY e.id;",
                          function (err, results) {
                            if (err) throw err;
                            console.table(results);
                          }
                        );
                      }
                    );
                  });
              }
            );
          });
          break;

        // UPDATE EMPLOYEE INFO OPTION
        case "Update an Employee Title":
          con.query("SELECT class FROM department", function (err, results) {
            if (err) throw err;

            const departmentClasses = results.map((result) => result.class);

            con.query(
              "SELECT DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee AS manager JOIN employee AS subordinate ON manager.id = subordinate.manager_id",
              function (err, managerResults) {
                if (err) throw err;

                con.query(
                  "SELECT CONCAT(first_name, ' ', last_name) AS employee_name FROM employee",
                  function (err, employeeResults) {
                    if (err) throw err;

                    const employeeList = employeeResults.map(
                      (result) => result.employee_name
                    );

                    inquirer
                      .prompt([
                        {
                          type: "list",
                          name: "empList",
                          message:
                            "Please select the employee you would like to update:",
                          choices: employeeList,
                        },
                        {
                          type: "input",
                          name: "newJob",
                          message: "What is the employee's new job title?",
                          validate: function (input) {
                            return input === ""
                              ? "ERROR: Please enter the employee's new job title"
                              : true;
                          },
                        },
                        {
                          type: "list",
                          name: "newDep",
                          message:
                            "Which department will the employee fall under?",
                          choices: departmentClasses,
                        },
                        {
                          type: "list",
                          name: "newMang",
                          message: "Who is the employee's manager?",
                          choices: managerResults.map(
                            (result) => result.manager_name
                          ),
                        },
                      ])
                      .then((answers) => {
                        const selectedEmployee = answers.empList;
                        const selectedJobTitle = answers.newJob;
                        const selectedDepartment = answers.newDep;
                        const selectedManager = answers.newMang;

                        con.query(
                          "UPDATE employee SET job_id = (SELECT id FROM job WHERE title = ?), department_id = (SELECT id FROM department WHERE class = ?), manager_id = (SELECT m.id FROM (SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee) m JOIN employee e ON m.id = e.manager_id WHERE m.full_name = ? LIMIT 1) WHERE CONCAT(first_name, ' ', last_name) = ?",
                          [
                            selectedJobTitle,
                            selectedDepartment,
                            selectedManager,
                            selectedEmployee,
                          ],
                          function (err, result) {
                            if (err) throw err;

                            console.log(
                              `Employee ${selectedEmployee} has been successfully updated`
                            );

                            con.query(
                              "SELECT e.id, e.first_name, e.last_name, j.title AS job_title, CONCAT(m.first_name, ' ', m.last_name) AS manager_name, d.class AS department FROM employee e JOIN job j ON e.job_id = j.id LEFT JOIN employee m ON e.manager_id = m.id JOIN department d ON e.department_id = d.id ORDER BY e.id;",
                              function (err, results) {
                                if (err) throw err;
                                console.table(results);
                              }
                            );
                          }
                        );
                      });
                  }
                );
              }
            );
          });
          break;

        // EXIT OPTION
        case "Exit":
          console.log("Goodbye!");
          process.exit();
      }
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
}