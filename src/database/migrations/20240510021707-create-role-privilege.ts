import { QueryInterface, DataTypes } from "sequelize";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable("RolePrivileges", {
			roleId: {
				type: Sequelize.UUID,
			},
			privilegeId: {
				type: Sequelize.UUID,
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
		await queryInterface.dropTable("RolePrivileges");
	},
};
