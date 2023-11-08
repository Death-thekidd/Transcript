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
exports.seedUsers = void 0;
const user_controller_1 = require("../controllers/user.controller");
const sequelize_1 = __importDefault(require("../sequelize"));
// Function to seed user data
function seedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Synchronize the models with the database
            yield sequelize_1.default.sync();
            // Define user data for seeding
            const usersToSeed = [
                {
                    email: "ohiemidivine7@gmail.com",
                    password: "password123",
                    name: "Transcript Admin",
                    schoolId: "99999",
                    roles: ["Admin"],
                    userType: "Staff",
                },
            ];
            for (const userData of usersToSeed) {
                // Create the user
                yield user_controller_1.createUser(userData);
            }
            console.log("User seeding completed.");
        }
        catch (error) {
            console.error("Error seeding users:", error);
        }
    });
}
exports.seedUsers = seedUsers;
//# sourceMappingURL=user.seeder.js.map