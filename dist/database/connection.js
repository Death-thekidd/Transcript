"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const secrets_1 = require("../util/secrets");
const sequelizeConnection = new sequelize_1.Sequelize(secrets_1.MYSQL_DB_NAME, secrets_1.MYSQL_DB_USER, secrets_1.MYSQL_DB_PASSWORD, {
    host: secrets_1.MYSQL_DB_HOST,
    dialect: "mysql",
    port: 3306,
});
console.log(secrets_1.MYSQL_DB_NAME, secrets_1.MYSQL_DB_USER, null, {
    host: secrets_1.MYSQL_DB_HOST,
    dialect: "mysql",
    port: 3306,
});
exports.default = sequelizeConnection;
//# sourceMappingURL=connection.js.map