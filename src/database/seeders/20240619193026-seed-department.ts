import { QueryInterface } from "sequelize";
import { createDepartment } from "../../services/department.service";
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

		const departmentsToSeed = [
			{
				name: "Computer Science",
				collegeName: "Technology",
			},
		];

		for (const { name, collegeName } of departmentsToSeed) {
			// Create the user
			await createDepartment(name, collegeName);
		}

		console.log("Departments seeding completed.");
	},

	async down(queryInterface: QueryInterface) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Departments", null, {});
	},
};
