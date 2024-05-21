"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    up(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const constraint of constraints) {
                yield queryInterface.addConstraint(constraint.table, {
                    fields: [constraint.field],
                    type: "foreign key",
                    name: constraint.name,
                    references: constraint.references,
                    onDelete: "CASCADE",
                    onUpdate: "CASCADE",
                });
            }
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const constraint of constraints) {
                yield queryInterface.removeConstraint(constraint.table, constraint.name);
            }
        });
    },
};
//# sourceMappingURL=20240510100948-add-constraints.js.map