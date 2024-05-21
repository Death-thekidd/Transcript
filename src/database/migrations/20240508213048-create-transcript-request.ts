"use strict";
import { QueryInterface, DataTypes } from "sequelize";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable("TranscriptRequests", {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			collegeId: {
				type: Sequelize.UUID,
			},
			departmentId: {
				type: Sequelize.UUID,
			},
			transcriptTypeId: {
				type: Sequelize.UUID,
			},
			status: {
				type: DataTypes.ENUM("pending", "accepted"),
				allowNull: false,
			},
			matricNo: {
				type: Sequelize.STRING,
			},
			userId: {
				type: Sequelize.UUID,
			},
			isPaid: {
				type: Sequelize.BOOLEAN,
			},
			total: {
				type: Sequelize.FLOAT,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface: QueryInterface) {
		await queryInterface.dropTable("TranscriptRequests");
	},
};
