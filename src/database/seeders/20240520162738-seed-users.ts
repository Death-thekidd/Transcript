import { QueryInterface } from "sequelize";
import { UserObj, createUser } from "../../services/auth.service";
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

		const usersToSeed = [
			{
				email: "ohiemidivine7@gmail.com",
				password: "password123",
				name: "Transcript Admin",
				schoolId: "99999",
				roles: ["Admin"],
				userType: "Staff",
			},
		];

		for (const userData of usersToSeed) {
			// Create the user
			await createUser(userData as unknown as UserObj);
		}

		console.log("User seeding completed.");
	},

	async down(queryInterface: QueryInterface) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Users", null, {});
	},
};
