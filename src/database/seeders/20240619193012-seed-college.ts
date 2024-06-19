import { QueryInterface } from "sequelize";
import { createCollege } from "../../services/college.service";
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

		const collegessToSeed = [
			{
				name: "Technology",
			},
		];

		for (const { name } of collegessToSeed) {
			// Create the user
			await createCollege(name);
		}

		console.log("College seeding completed.");
	},

	async down(queryInterface: QueryInterface) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Colleges", null, {});
	},
};
