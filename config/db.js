const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "mysql.afritradecenter.com",
    user: "tradeafrica",
    password: "###Afritrade124",
    database: "afritrade_dbx",
  });
  
connection.connect();

export default connection