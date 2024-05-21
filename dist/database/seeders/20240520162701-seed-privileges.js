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
const uuid_1 = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface) {
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
            const privilegesToSeed = [
                {
                    id: uuid_1.v4(),
                    name: "Dashboard",
                    path: "/app",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Admin Dashboard",
                    path: "/app/admin-dashboard",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Users",
                    path: "/app/users",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Colleges",
                    path: "/app/colleges",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Departments",
                    path: "/app/departments",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Destinations",
                    path: "/app/destinations",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Destination requests",
                    path: "/app/destination-requests",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Transcript requests",
                    path: "/app/transcript-requests",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Roles",
                    path: "/app/roles",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Request Transcript",
                    path: "/app/request-transcript",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Request Destination",
                    path: "/app/request-destination",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: uuid_1.v4(),
                    name: "Transcript Types",
                    path: "/app/transcript-types",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            yield queryInterface.bulkInsert("Privileges", privilegesToSeed, {});
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
            yield queryInterface.bulkDelete("Privileges", null, {});
        });
    },
};
//# sourceMappingURL=20240520162701-seed-privileges.js.map