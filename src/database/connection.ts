import { Sequelize } from "sequelize";
import {
	MYSQL_DB_NAME,
	MYSQL_DB_HOST,
	MYSQL_DB_PASSWORD,
	MYSQL_DB_USER,
} from "../util/secrets";

const sequelizeConnection: Sequelize = new Sequelize(
	MYSQL_DB_NAME,
	MYSQL_DB_USER,
	MYSQL_DB_PASSWORD,
	{
		host: MYSQL_DB_HOST,
		dialect: "mysql",
		port: 3306,
	}
);

console.log(MYSQL_DB_NAME, MYSQL_DB_USER, null, {
	host: MYSQL_DB_HOST,
	dialect: "mysql",
	port: 3306,
});

export default sequelizeConnection;
