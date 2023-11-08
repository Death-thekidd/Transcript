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
exports.seedRolesAndPrivileges = void 0;
const privilege_model_1 = require("../models/privilege.model");
const role_model_1 = require("../models/role.model");
const sequelize_1 = __importDefault(require("../sequelize"));
function seedRolesAndPrivileges() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Synchronize the models with the database
            yield sequelize_1.default.sync();
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
                // Create the role
                const role = yield role_model_1.Role.create({ name: roleData.name });
                // Assign privileges by name
                for (const privilegeName of roleData.privileges) {
                    const privilege = yield privilege_model_1.Privilege.findOne({
                        where: { name: privilegeName },
                    });
                    if (privilege) {
                        yield role.addPrivilege(privilege);
                    }
                }
            }
            console.log("Roles and privileges seeding completed.");
        }
        catch (error) {
            console.error("Error seeding roles and privileges:", error);
        }
        finally {
            // Close the database connection
            yield sequelize_1.default.close();
        }
    });
}
exports.seedRolesAndPrivileges = seedRolesAndPrivileges;
//# sourceMappingURL=role.seeder.js.map