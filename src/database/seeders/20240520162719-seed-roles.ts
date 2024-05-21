import { QueryInterface } from "sequelize";
import { createRole } from "../../services/role.service";
import sequelizeConnection from "../connection";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up() {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await sequelizeConnection.sync();

		// Define the roles and their associated privilege names
		const rolesWithPrivileges = [
			{
				name: "Admin",
				privileges: [
					"Admin Dashboard",
					"Users",
					"Colleges",
					"Departments",
					"Destinations",
					"Destination requests",
					"Transcript requests",
					"Transcript Types",
					"Roles",
				],
			},
			{
				name: "User",
				privileges: ["Dashboard", "Request Transcript", "Request Destination"],
			},
		];

		for (const roleData of rolesWithPrivileges) {
			await createRole(roleData.name, roleData.privileges);
		}
	},

	async down(queryInterface: QueryInterface) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Roles", null, {});
		await queryInterface.bulkDelete("Privileges", null, {});
	},
};
