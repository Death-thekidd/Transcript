import { QueryInterface } from "sequelize";
import { v4 } from "uuid";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		const privilegesToSeed = [
			{
				id: v4(),
				name: "Dashboard",
				path: "/app",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Admin Dashboard",
				path: "/app/admin-dashboard",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Users",
				path: "/app/users",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Colleges",
				path: "/app/colleges",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Departments",
				path: "/app/departments",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Destinations",
				path: "/app/destinations",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Destination requests",
				path: "/app/destination-requests",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Transcript requests",
				path: "/app/transcript-requests",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Roles",
				path: "/app/roles",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Request Transcript",
				path: "/app/request-transcript",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Request Destination",
				path: "/app/request-destination",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: v4(),
				name: "Transcript Types",
				path: "/app/transcript-types",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		await queryInterface.bulkInsert("Privileges", privilegesToSeed, {});
	},

	async down(queryInterface: QueryInterface) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Privileges", null, {});
	},
};
