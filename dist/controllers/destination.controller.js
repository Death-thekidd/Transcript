"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteDestination = exports.editDestination = exports.createDestination = exports.getDestination = exports.getDestinations = void 0;
const express_validator_1 = require("express-validator");
const destinationService = __importStar(require("../services/destination.service"));
const getDestinations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const destinations = yield destinationService.getAllDestinations();
        return res.status(200).json({ data: destinations });
    }
    catch (error) {
        next(error);
    }
});
exports.getDestinations = getDestinations;
const getDestination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const destination = yield destinationService.getDestinationById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        return res.status(200).json({ data: destination });
    }
    catch (error) {
        next(error);
    }
});
exports.getDestination = getDestination;
const createDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, rate, deliveryMethod } = req.body;
        const destination = yield destinationService.createDestination(name, rate, deliveryMethod);
        return res
            .status(201)
            .json({ message: "Destination created successfully", data: destination });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createDestination = createDestination;
const editDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRowsCount = yield destinationService.updateDestination(req.params.id, req.body);
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: "Destination not found" });
        }
        return res.status(204).json({ message: "Destination updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error editing destination", error });
    }
});
exports.editDestination = editDestination;
const deleteDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield destinationService.deleteDestination(req.params.id);
        return res.status(204).json({ message: "Destination deleted successfully" });
    }
    catch (error) {
        if (error.message === "Destination not found") {
            return res.status(404).json({ message: "Destination not found" });
        }
        return res.status(500).json({ message: "Error deleting destination", error });
    }
});
exports.deleteDestination = deleteDestination;
//# sourceMappingURL=destination.controller.js.map