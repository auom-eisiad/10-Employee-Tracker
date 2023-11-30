INSERT INTO department (class)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title, department_id, salary)
VALUES ("Sales Lead", "Sales", "100000"),
       ("Salesperson", "Sales", "80000"),
       ("Lead Engineer", "Engineering", "150000"),
       ("Software Engineer", "Engineering", "120000"),
       ("Account Manager", "Finance", "160000"),
       ("Accountant", "Finance", "250000"),
       ("Legal Team Lead", "Legal", "250000"),
       ("Lawyer", "Legal", "190000");

INSERT INTO employee (last_name, first_name, role_id, department_id, salary, manager_id)
VALUES ("Doe", "John", "Sales Lead", "Sales", "100000", NULL),
       ("Sue", "Mary", "Salesperson", "Sales", "80000", "John Doe"),
       ("Lyson", "Mick", "Lead Engineer", "Engineering", "150000", NULL),
       ("Westwood", "Clint", "Software Engineer", "Engineering", "120000", "Mick Lyson"),
       ("Rowlyn", "KJ", "Account Manager", "Finance", "160000", NULL),
       ("Topper", "Harris", "Accountant", "Finance", "250000", "KJ Rowlyn"),
       ("Ronson", "Swan", "Legal Team Lead", "Legal", "250000", NULL),
       ("Reed", "Niel", "Lawyer", "Legal", "190000", "Swan Ronson");