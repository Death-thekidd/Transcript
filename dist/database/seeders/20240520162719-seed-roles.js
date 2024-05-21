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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_service_1 = require("../../services/role.service");
const connection_1 = __importDefault(require("../connection"));
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Add seed commands here.
             *
             * Example:
             * await queryInterface.bulkInsert('People', [{
             *   name: 'John Doe',
             *   isBetaMember: false
             * }], {});
             */
            yield connection_1.default.sync();
            // Define the roles and their associated privilege names
            const rolesWithPrivileges = [
                {
                    name: "Admin",
                    privileges: [
                        "Admin Dashboard",
                        "Users",
                        "Colleges",
                        "Departments",
                        "Destinations",
                        "Destination requests",
                        "Transcript requests",
                        "Transcript Types",
                        "Roles",
                    ],
                },
                {
                    name: "User",
                    privileges: ["Dashboard", "Request Transcript", "Request Destination"],
                },
            ];
            for (const roleData of rolesWithPrivileges) {
                yield role_service_1.createRole(roleData.name, roleData.privileges);
            }
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Add commands to revert seed here.
             *
             * Example:
             * await queryInterface.bulkDelete('People', null, {});
             */
            yield queryInterface.bulkDelete("Roles", null, {});
            yield queryInterface.bulkDelete("Privileges", null, {});
        });
    },
};
//# sourceMappingURL=20240520162719-seed-roles.js.map