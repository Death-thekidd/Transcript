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
exports.deleteDestination = exports.editDestination = exports.createDestination = exports.getDestination = exports.getDestinations = void 0;
const express_validator_1 = require("express-validator");
const college_model_1 = require("../models/college.model");
const destination_model_1 = require("../models/destination.model");
/**
 * Get all destinations
 * @route GET /destinations
 */
const getDestinations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const destinations = yield destination_model_1.Destination.findAll();
        return res.status(200).json({ data: destinations });
    }
    catch (error) {
        next(error);
    }
});
exports.getDestinations = getDestinations;
/**
 * Get destination by ID
 * @route GET /destination/:id
 */
const getDestination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const destinationId = req.params.id;
        const destination = yield destination_model_1.Destination.findByPk(destinationId);
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
/**
 * Create new Destination
 * @route POST /create-destination
 */
const createDestination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const destination = yield destination_model_1.Destination.create({
            name: req.body.name,
            rate: req.body.rate,
            deliveryMethod: req.body.deliveryMethod,
        });
        return res
            .status(200)
            .json({ message: "Destination created succesfully", data: destination });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createDestination = createDestination;
/**
 * Edit existing destination
 * @route PATCH /edit-destination/:id
 */
const editDestination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield destination_model_1.Destination.update(Object.assign({}, req.body), { where: { id: id } });
        if (result[0] === 0) {
            return res.status(404).json({ message: "college not found" });
        }
        return res
            .status(204)
            .json({ message: "destination updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error editing college", error });
    }
});
exports.editDestination = editDestination;
/**
 * Delete destination
 * @route DELETE /delete-destination/:id
 */
const deleteDestination = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const college = yield college_model_1.College.findOne({
            where: { id: req.params.id },
        });
        if (college) {
            // Delete the record
            yield college.destroy();
            return res.status(204).json({ message: "college deleted successfully." });
        }
        else {
            return res.status(404).json({ message: "college not found." });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting college", error });
    }
});
exports.deleteDestination = deleteDestination;
//# sourceMappingURL=destination.controller.js.map