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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptDestinationRequest = exports.submitDestinationRequest = exports.getDestinationRequest = exports.getDestinationRequests = void 0;
const express_validator_1 = require("express-validator");
const async_1 = __importDefault(require("async"));
const destinationRequestService = __importStar(require("../services/userDestinationRequest.service"));
/**
 * Get all destinations
 * @route GET /destination-requests
 */
const getDestinationRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const destinationRequests = yield destinationRequestService.getAllDestinationRequests();
        return res.status(200).json({ data: destinationRequests });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getDestinationRequests = getDestinationRequests;
/**
 * Get destination by id
 * @route GET /destination-request/:id
 */
const getDestinationRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const destinationRequestId = req.params.id;
        const destinationRequest = yield destinationRequestService.getDestinationRequestById(destinationRequestId);
        if (!destinationRequest) {
            return res.status(404).json({ message: "Destination Request not found" });
        }
        return res.status(200).json({ data: destinationRequest });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getDestinationRequest = getDestinationRequest;
/**
 * Create Destination request
 * @route POST /submit-destination-request
 */
const submitDestinationRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        async_1.default.waterfall([
            function checkUser(done) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield destinationRequestService.findUserById(req.body.userId);
                    if (!user) {
                        return done(new Error("User not found."), null);
                    }
                    done(null, user);
                });
            },
            function saveRequest(user, done) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { name, userId } = req.body;
                        const request = yield destinationRequestService.createDestinationRequest(name, userId);
                        done(null, request, user);
                    }
                    catch (error) {
                        console.error("Unable to create Destination request: ", error);
                        return done(error, null, null);
                    }
                });
            },
        ], (err, request) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json({
                message: "Destination Request created successfully.",
                data: request,
            });
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
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
        const result = yield destinationRequestService.acceptDestinationRequestById(id);
        if (result[0] === 0) {
            return res.status(404).json({ message: "Destination Request not found" });
        }
        return res.status(200).json({ message: "Destination accepted" });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.acceptDestinationRequest = acceptDestinationRequest;
//# sourceMappingURL=user-destination-request.controller.js.map