"use strict";
import { QueryInterface } from "sequelize";

const constraints = [
	{
		table: "UserRoles",
		field: "userId",
		name: "FK_UserRole_userId",
		references: { table: "Users", field: "id" },
	},
	{
		table: "UserRoles",
		field: "roleId",
		name: "FK_UserRole_roleId",
		references: { table: "Roles", field: "id" },
	},
	{
		table: "Transactions",
		field: "userId",
		name: "transaction_user",
		references: { table: "Users", field: "id" },
	},
	{
		table: "TranscriptRequestDestinations",
		field: "transcriptRequestId",
		name: "FK_TranscriptRequestDestination_transcriptRequestId",
		references: { table: "TranscriptRequests", field: "id" },
	},
	{
		table: "TranscriptRequestDestinations",
		field: "destinationId",
		name: "FK_TranscriptRequestDestination_destinationId",
		references: { table: "Destinations", field: "id" },
	},
	{
		table: "TranscriptRequests",
		field: "transcriptTypeId",
		name: "transcript_request_type",
		references: { table: "TranscriptTypes", field: "id" },
	},
	{
		table: "TranscriptRequests",
		field: "collegeId",
		name: "transcript_request_college",
		references: { table: "Colleges", field: "id" },
	},
	{
		table: "TranscriptRequests",
		field: "departmentId",
		name: "transcript_request_department",
		references: { table: "Departments", field: "id" },
	},
	{
		table: "TranscriptRequests",
		field: "userId",
		name: "transcript_request_user",
		references: { table: "Users", field: "id" },
	},
	{
		table: "Departments",
		field: "collegeId",
		name: "department_college",
		references: { table: "Colleges", field: "id" },
	},
	{
		table: "RolePrivileges",
		field: "roleId",
		name: "FK_RolePrivilege_roleId",
		references: { table: "Roles", field: "id" },
	},
	{
		table: "RolePrivileges",
		field: "privilegeId",
		name: "FK_RolePrivilege_privilegeId",
		references: { table: "Privileges", field: "id" },
	},
	{
		table: "Wallets",
		field: "userId",
		name: "wallet_user",
		references: { table: "Users", field: "id" },
	},
	{
		table: "WalletTransactions",
		field: "walletId",
		name: "wallet_transactions",
		references: { table: "Wallets", field: "id" },
	},
	{
		table: "Users",
		field: "collegeId",
		name: "college_user",
		references: { table: "Colleges", field: "id" },
	},
	{
		table: "Users",
		field: "departmentId",
		name: "department_user",
		references: { table: "Departments", field: "id" },
	},
];

module.exports = {
	async up(queryInterface: QueryInterface) {
		for (const constraint of constraints) {
			await queryInterface.addConstraint(constraint.table, {
				fields: [constraint.field],
				type: "foreign key",
				name: constraint.name,
				references: constraint.references,
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
		}
	},

	async down(queryInterface: QueryInterface) {
		for (const constraint of constraints) {
			await queryInterface.removeConstraint(constraint.table, constraint.name);
		}
	},
};
