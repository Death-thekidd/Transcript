"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/database/sequelize.config.js
const secrets_1 = require("../util/secrets");
module.exports = {
    username: secrets_1.MYSQL_DB_USER,
    password: secrets_1.MYSQL_DB_PASSWORD,
    database: secrets_1.MYSQL_DB_NAME,
    host: secrets_1.MYSQL_DB_HOST,
    dialect: "mysql",
};
//# sourceMappingURL=sequelize.config.js.map