"use strict";
import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
	async up(queryInterface: QueryInterface) {
		await queryInterface.removeColumn("TranscriptRequestDestinations", "id");
	},

	async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.addColumn("TranscriptRequestDestinations", "id", {
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
		});
	},
};
