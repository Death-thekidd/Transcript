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
exports.getRecentTranscriptRequests = exports.deleteTranscriptRequest = exports.updateTranscriptRequestStatus = exports.createTranscriptRequest = exports.getTranscriptRequestById = exports.getAllTranscriptRequests = void 0;
const transcriptrequest_1 = __importDefault(require("../database/models/transcriptrequest"));
const user_1 = __importDefault(require("../database/models/user"));
const destination_1 = __importDefault(require("../database/models/destination"));
const transcripttype_1 = __importDefault(require("../database/models/transcripttype"));
const PAYSTACK_TRANSACTION_PERCENTAGE = 0.015; // Paystack charges 1.5%
const PAYSTACK_TRANSACTION_CAP = 2000; // The maximum Paystack transaction fee is ₦2000
const PAYSTACK_ADDITIONAL_CHARGE = 100; // An additional ₦100 charge for international transactions (if applicable)
function getAllTranscriptRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield transcriptrequest_1.default.findAll({
            include: [destination_1.default, transcripttype_1.default],
        });
    });
}
exports.getAllTranscriptRequests = getAllTranscriptRequests;
function getTranscriptRequestById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield transcriptrequest_1.default.findByPk(id, {
            include: [destination_1.default, transcripttype_1.default],
        });
    });
}
exports.getTranscriptRequestById = getTranscriptRequestById;
function createTranscriptRequest(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findByPk(data.userId, {
            include: [transcripttype_1.default],
        });
        if (!user) {
            throw new Error("User not found.");
        }
        const transcriptType = yield transcripttype_1.default.findOne({
            where: { name: data.transcriptType },
        });
        if (!transcriptType) {
            throw new Error("Transcript type not found.");
        }
        // Calculate the total amount
        let totalAmount = transcriptType.amount;
        for (const destinationId of data.destinations) {
            const destination = yield destination_1.default.findByPk(destinationId);
            if (destination) {
                totalAmount += destination.rate;
            }
            else {
                throw new Error(`Destination with id ${destinationId} not found.`);
            }
        }
        // Calculate Paystack transaction fee
        let transactionFee = totalAmount * PAYSTACK_TRANSACTION_PERCENTAGE;
        if (transactionFee > PAYSTACK_TRANSACTION_CAP) {
            transactionFee = PAYSTACK_TRANSACTION_CAP;
        }
        // if (/* condition to check if it is an international transaction */) {
        // 	transactionFee += PAYSTACK_ADDITIONAL_CHARGE;
        // }
        const total = totalAmount + transactionFee;
        const request = yield transcriptrequest_1.default.create({
            collegeId: user.collegeId,
            departmentId: user.departmentId,
            matricNo: user.schoolId,
            transcriptTypeId: transcriptType.id,
            status: "pending",
            userId: data.userId,
            total,
        });
        for (const destinationId of data.destinations) {
            const destination = yield destination_1.default.findByPk(destinationId);
            yield request.addDestination(destination);
        }
        return request;
    });
}
exports.createTranscriptRequest = createTranscriptRequest;
function updateTranscriptRequestStatus(id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transcriptrequest_1.default.update({ status }, { where: { id } });
    });
}
exports.updateTranscriptRequestStatus = updateTranscriptRequestStatus;
function deleteTranscriptRequest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const transcriptRequest = yield transcriptrequest_1.default.findByPk(id);
        if (transcriptRequest) {
            yield transcriptRequest.destroy();
            return true;
        }
        return false;
    });
}
exports.deleteTranscriptRequest = deleteTranscriptRequest;
function getRecentTranscriptRequests(limit = 4, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const transcriptRequests = yield transcriptrequest_1.default.findAll({
            limit,
            order: [["createdAt", "DESC"]],
            where: { userId: id },
            include: [user_1.default, transcripttype_1.default],
        });
        const requests = yield Promise.all(transcriptRequests.map((request) => __awaiter(this, void 0, void 0, function* () {
            return ({
                type: (yield request.getTranscriptType()).name || "Unknown",
                createdAt: request.createdAt,
                fee: request.total,
                status: request.status,
                matricNo: request.matricNo,
            });
        })));
        return requests;
    });
}
exports.getRecentTranscriptRequests = getRecentTranscriptRequests;
//# sourceMappingURL=transcriptRequest.service.js.map