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
exports.findUserById = exports.acceptDestinationRequestById = exports.createDestinationRequest = exports.getDestinationRequestById = exports.getAllDestinationRequests = void 0;
// src/services/destinationRequestService.ts
const userdestinationrequest_1 = __importDefault(require("../database/models/userdestinationrequest"));
const user_1 = __importDefault(require("../database/models/user"));
const getAllDestinationRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield userdestinationrequest_1.default.findAll();
});
exports.getAllDestinationRequests = getAllDestinationRequests;
const getDestinationRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userdestinationrequest_1.default.findByPk(id);
});
exports.getDestinationRequestById = getDestinationRequestById;
const createDestinationRequest = (name, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userdestinationrequest_1.default.create({
        name,
        userId,
        status: "pending",
    });
});
exports.createDestinationRequest = createDestinationRequest;
const acceptDestinationRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userdestinationrequest_1.default.update({ status: "accepted" }, { where: { id }, returning: true });
});
exports.acceptDestinationRequestById = acceptDestinationRequestById;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByPk(id);
});
exports.findUserById = findUserById;
//# sourceMappingURL=userDestinationRequest.service.js.map