import { QueryInterface } from "sequelize";
import { createTranscriptType } from "../../services/transcriptType.service";
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

		const transcriptTypesToSeed = [
			{
				name: "Local",
				amount: 2000,
			},
			{
				name: "International",
				amount: 5000,
			},
		];

		for (const { name, amount } of transcriptTypesToSeed) {
			// Create the transcript type
			await createTranscriptType(name, amount);
		}

		console.log("Transcript Type seeding completed.");
	},

	async down(queryInterface: QueryInterface) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("TranscriptTypes", null, {});
	},
};
