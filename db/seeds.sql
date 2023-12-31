INSERT INTO department (class)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO job (title, department_id, salary)
VALUES ("Sales Lead", 4, 100000),
       ("Salesperson", 4, 80000),
       ("Lead Engineer", 1, 150000),
       ("Software Engineer", 1, 120000),
       ("Account Manager", 2, 160000),
       ("Accountant", 2, 250000),
       ("Legal Team Lead", 3, 250000),
       ("Lawyer", 3, 190000);

INSERT INTO employee (last_name, first_name, job_id, department_id, manager_id)
VALUES ("Doe", "John", 1, 4, NULL),
       ("Sue", "Mary", 2, 4, 1),
       ("Lyson", "Mick", 3, 1, NULL),
       ("Westwood", "Clint", 4, 1, 3),
       ("Rowlyn", "KJ", 5, 2, NULL),
       ("Topper", "Harris", 6, 2, 5),
       ("Ronson", "Swan", 7, 3, NULL),
       ("Reed", "Niel", 8, 3, 7);