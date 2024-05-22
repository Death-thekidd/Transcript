// src/database/sequelize.config.js
import {
	MYSQL_DB_NAME,
	MYSQL_DB_HOST,
	MYSQL_DB_PASSWORD,
	MYSQL_DB_USER,
} from "../util/secrets";

module.exports = {
	username: MYSQL_DB_USER,
	password: MYSQL_DB_PASSWORD,
	database: MYSQL_DB_NAME,
	host: MYSQL_DB_HOST,
	dialect: "mysql",
};
