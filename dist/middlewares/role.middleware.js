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
exports.checkUserRole = void 0;
const role_model_1 = require("../models/role.model");
const checkUserRole = (_role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.session.user; // Assuming you store user information in the request object after authentication
        const role = yield role_model_1.Role.findOne({ where: { name: _role } });
        const roles = yield user.getRoles();
        if (!user || !roles.includes(role)) {
            return res.status(403).json({ message: "Access forbidden" });
        }
        next();
    });
};
exports.checkUserRole = checkUserRole;
//# sourceMappingURL=role.middleware.js.map