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
exports.deleteDestination = exports.updateDestination = exports.createDestination = exports.getDestinationById = exports.getAllDestinations = void 0;
// services/destinationService.ts
const destination_1 = __importDefault(require("../database/models/destination"));
const getAllDestinations = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield destination_1.default.findAll();
});
exports.getAllDestinations = getAllDestinations;
const getDestinationById = (destinationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield destination_1.default.findByPk(destinationId);
});
exports.getDestinationById = getDestinationById;
const createDestination = (name, rate, deliveryMethod) => __awaiter(void 0, void 0, void 0, function* () {
    return yield destination_1.default.create({ name, rate, deliveryMethod });
});
exports.createDestination = createDestination;
const updateDestination = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const [updatedRowsCount] = yield destination_1.default.update(updateData, {
        where: { id },
    });
    return updatedRowsCount;
});
exports.updateDestination = updateDestination;
const deleteDestination = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const destination = yield destination_1.default.findByPk(id);
    if (destination) {
        yield destination.destroy();
    }
    else {
        throw new Error("Destination not found");
    }
});
exports.deleteDestination = deleteDestination;
//# sourceMappingURL=destination.service.js.map