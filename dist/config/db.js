"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "mysql.afritradecenter.com",
  user: "tradeafrica",
  password: "###Afritrade124",
  database: "afritrade_dbx"
});
connection.connect();
var _default = connection;
exports["default"] = _default;
//# sourceMappingURL=db.js.map