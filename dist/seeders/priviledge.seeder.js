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
exports.seedPrivileges = void 0;
const privilege_model_1 = require("../models/privilege.model");
const sequelize_1 = __importDefault(require("../sequelize"));
// Define an array of privileges to seed
const privilegesToSeed = [
    {
        name: "Dashboard",
        path: "/app",
    },
    {
        name: "Admin Dashboard",
        path: "/app/admin-dashboard",
    },
    {
        name: "Users",
        path: "/app/users",
    },
    {
        name: "Colleges",
        path: "/app/colleges",
    },
    {
        name: "Departments",
        path: "/app/departments",
    },
    {
        name: "Destinations",
        path: "/app/destinations",
    },
    {
        name: "Destination requests",
        path: "/app/destination-requests",
    },
    {
        name: "Transcript requests",
        path: "/app/transcript-requests",
    },
    {
        name: "Roles",
        path: "/app/roles",
    },
    {
        name: "Request Transcript",
        path: "/app/request-transcript",
    },
    {
        name: "Request Destination",
        path: "/app/request-destination",
    },
    {
        name: "Transcript Types",
        path: "/app/transcript-types",
    },
];
// Function to seed privileges into the database
function seedPrivileges() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Synchronize the model with the database
            yield sequelize_1.default.sync();
            // Insert privileges into the database
            for (const privilege of privilegesToSeed) {
                yield privilege_model_1.Privilege.create(privilege);
                console.log(`Privilege '${privilege.name}' seeded.`);
            }
            console.log("Privileges seeding completed.");
        }
        catch (error) {
            console.error("Error seeding privileges:", error);
        }
        finally {
            // Close the database connection
            yield sequelize_1.default.close();
        }
    });
}
exports.seedPrivileges = seedPrivileges;
//# sourceMappingURL=priviledge.seeder.js.map