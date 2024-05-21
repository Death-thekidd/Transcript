"use strict";
import { QueryInterface, DataTypes } from "sequelize";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			schoolId: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			isAdmin: {
				type: Sequelize.BIGINT,
			},
			collegeId: {
				type: Sequelize.UUID,
			},
			departmentId: {
				type: Sequelize.UUID,
			},
			resetToken: {
				type: Sequelize.STRING,
			},
			resetTokenExpires: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("Users");
	},
};
