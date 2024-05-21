// src/database/sequelize.config.js
require("ts-node/register");
import {
	MYSQL_DB_NAME,
	MYSQL_DB_HOST,
	MYSQL_DB_PASSWORD,
	MYSQL_DB_USER,
} from "../util/secrets";

module.exports = {
	username: MYSQL_DB_USER,
	password: null,
	database: MYSQL_DB_NAME,
	host: MYSQL_DB_HOST,
	dialect: "mysql",
};
