"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/destinationRoutes.ts
const express_1 = __importDefault(require("express"));
const destination_controller_1 = require("../controllers/destination.controller");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/destinations", destination_controller_1.getDestinations);
router.get("/destination/:id", destination_controller_1.getDestination);
router.post("/create-destination", [
    express_validator_1.body("name").notEmpty().withMessage("Name is required"),
    express_validator_1.body("rate").isNumeric().withMessage("Rate must be a number"),
    express_validator_1.body("deliveryMethod").notEmpty().withMessage("Delivery method is required"),
], destination_controller_1.createDestination);
router.patch("/edit-destination/:id", destination_controller_1.editDestination);
router.delete("/delete-destination/:id", destination_controller_1.deleteDestination);
exports.default = router;
//# sourceMappingURL=destination.router.js.map