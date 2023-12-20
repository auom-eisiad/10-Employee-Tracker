# Employee Tracker

![Screenshot](images/website.png)

## Description

This application is designed to assist users in efficiently overseeing their employees through a user-friendly command-line interface. Users can effortlessly view, add, and update information within the CLI. During the development of this application, I gained valuable skills in managing prompt lists, assigning functions to each option, and enhancing my understanding of tables and their interconnections through foreign keys.

## Table of Contents (Optional)

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

All installations should already be provided. The only thing that you will need to have is a `dotenv file` provided with your own password to your root. 

```

DB_PASSWORD: enter your password here

```

## Usage

[Tutorial](https://drive.google.com/file/d/1Kee5yvGWCmxlyo8w7XGBtZbQNb0utjFg/view)

`Step 1:` Install and complete any installations needed such as having a `dotenv` file to access the application.

`Step 2:` Enter your CLI application and type "`node index.js`" to start the tracker.

`Step 3:` A prompt with 8 options will appear. Select the one you would like to do with the tracker.

`Step 4:` After you complete your choice, hold "`CTRL + ^ + C`" to exit or select the "`Exit`" option. 

## Credits

N/A

## Codes Used

- [index.js](/index.js) LINE 4-12 & [server.js](/server.js) LINE 13-21: Based on the work of [Refsnes Data and W3schools Network](https://www.w3schools.com/nodejs/nodejs_mysql_select.asp)

```
const con = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'tracker_db'
  },
  console.log(`Connected to the tracker_db database.`)
);


con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the database");
  questions();
});
```

## License

N/A

## Badges

N/A

## Features

N/A

## How to Contribute

N/A

## Tests

N/A