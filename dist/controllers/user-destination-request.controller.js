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
exports.acceptDestinationRequest = exports.submitDestinationRequest = void 0;
const user_model_1 = require("../models/user.model");
const express_validator_1 = require("express-validator");
const async_1 = __importDefault(require("async"));
const user_destination_request_model_1 = require("../models/user-destination-request.model");
/**
 * Create Destination request
 * @route POST /submit-destination-request
 */
const submitDestinationRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        async_1.default.waterfall([
            function checkUser(done) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield user_model_1.User.findByPk(req.body.userId);
                    if (!user) {
                        return done(new Error("User not found."), null); // Pass an error to the next function
                    }
                    done(undefined, user);
                });
            },
            function saveRequest(user, done) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { name, userId } = req.body;
                        const request = yield user_destination_request_model_1.UserDestinationRequest.create({
                            name,
                            userId,
                            status: "pending",
                        });
                        done(null, request, user);
                    }
                    catch (error) {
                        console.error("Unable to create Destination request : ", error);
                        return done(error, null, null); // Pass an error to the next function
                    }
                });
            },
        ], (err, request) => {
            if (err) {
                return next(err); // Handle errors at the end of the waterfall
            }
            return res.status(201).json({
                message: "Destination Request created successfully.",
                data: request,
            });
        });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.submitDestinationRequest = submitDestinationRequest;
/**
 * Accept Destination request
 * @route PATCH accept-destination-request/:id
 */
const acceptDestinationRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield user_destination_request_model_1.UserDestinationRequest.update({ status: "accepted" }, { where: { id: id } });
        return res.status(204).json({ message: "Destination accepted" });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.acceptDestinationRequest = acceptDestinationRequest;
//# sourceMappingURL=user-destination-request.controller.js.map