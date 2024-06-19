import { QueryInterface } from "sequelize";
import { createDestination } from "../../services/destination.service";
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

		const destinationsToSeed = [
			{
				name: "Lagos",
				rate: 2000,
				deliveryMethod: "DHR",
			},
		];

		for (const { name, rate, deliveryMethod } of destinationsToSeed) {
			// Create the user
			await createDestination(name, rate, deliveryMethod);
		}

		console.log("Destination seeding completed.");
	},

	async down(queryInterface: QueryInterface) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Destinations", null, {});
	},
};
