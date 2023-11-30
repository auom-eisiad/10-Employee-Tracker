INSERT INTO department (class)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title, department_id, salary)
VALUES ("Sales Lead", 4, 100000),
       ("Salesperson", 4, 80000),
       ("Lead Engineer", 1, 150000),
       ("Software Engineer", 1, 120000),
       ("Account Manager", 2, 160000),
       ("Accountant", 2, 250000),
       ("Legal Team Lead", 3, 250000),
       ("Lawyer", 3, 190000);

INSERT INTO employee (last_name, first_name, role_id, department_id, salary, manager_id)
VALUES ("Doe", "John", 1, 4, 100000, NULL),
       ("Sue", "Mary", 2, 4, 80000, 1),
       ("Lyson", "Mick", 3, 1, 150000, NULL),
       ("Westwood", "Clint", 4, 1, 120000, 3),
       ("Rowlyn", "KJ", 5, 2, 160000, NULL),
       ("Topper", "Harris", 6, 2, 250000, 5),
       ("Ronson", "Swan", 7, 3, 250000, NULL),
       ("Reed", "Niel", 8, 3, 190000, 7);