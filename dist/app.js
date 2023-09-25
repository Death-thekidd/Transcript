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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const winston_1 = __importDefault(require("winston"));
const secrets_1 = require("./util/secrets");
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
// Controllers (route handlers)
const userController = __importStar(require("./controllers/user.controller"));
const payStackController = __importStar(require("./controllers/payStack.controller"));
const walletController = __importStar(require("./controllers/wallet.controller"));
const walletTransactionController = __importStar(require("./controllers/walletTransaction.controller"));
const transactionController = __importStar(require("./controllers/transaction.controller"));
const roleController = __importStar(require("./controllers/role.controller"));
const collegeController = __importStar(require("./controllers/college.controller"));
const departmentController = __importStar(require("./controllers/department.controller"));
const destinationController = __importStar(require("./controllers/destination.controller"));
const transcriptRequestController = __importStar(require("./controllers/transcript-request.controller"));
const transcriptTypeController = __importStar(require("./controllers/transcript-type.controller"));
const userDestinationRequestController = __importStar(require("./controllers/user-destination-request.controller"));
// API keys and Passport configuration
const passportConfig = __importStar(require("./config/passport"));
const sequelize_1 = __importDefault(require("./sequelize"));
const user_model_1 = require("./models/user.model");
const wallet_model_1 = require("./models/wallet.model");
const walletTransaction_model_1 = require("./models/walletTransaction.model");
const transaction_model_1 = require("./models/transaction.model");
const destination_model_1 = require("./models/destination.model");
const role_model_1 = require("./models/role.model");
const transcript_request_model_1 = require("./models/transcript-request.model");
const user_destination_request_model_1 = require("./models/user-destination-request.model");
const college_model_1 = require("./models/college.model");
const department_model_1 = require("./models/department.model");
const transcript_type_model_1 = require("./models/transcript-type.model");
// Create Express server
const app = express_1.default();
app.use(cors_1.default());
// Initialize models
user_model_1.init();
role_model_1.init();
wallet_model_1.init();
walletTransaction_model_1.init();
transaction_model_1.init();
destination_model_1.init();
transcript_request_model_1.init();
user_destination_request_model_1.init();
college_model_1.init();
department_model_1.init();
transcript_type_model_1.init();
// Sync the database
sequelize_1.default
    .authenticate()
    .then(() => {
    console.log("Connected to the database");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
// Express configuration
app.set("port", process.env.PORT || 3001);
// parse requests of content-type - application/json
app.use(express_1.default.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    store: new (connect_session_sequelize_1.default(express_session_1.default.Store))({
        db: sequelize_1.default,
        tableName: "sessions", // Table name to store sessions in your database
    }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.File({ filename: "error.log", level: "error" }),
    ],
});
/**
 * Primary app routes.
 */
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Transcript application." });
});
app.get("/users", userController.getUsers);
app.get("/user/:id", userController.getUser);
app.post("/login", userController.postLogin);
app.post("/logout", userController.logout);
app.post("/forgot", userController.postForgot);
app.post("/signup", userController.postSignup);
app.post("/create-role", roleController.createRole);
app.get("/roles", roleController.getRoles);
app.get("/role/:id", roleController.getRole);
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.post("/initialize-payment", payStackController.initializePayment);
app.post("/verify-transaction", walletController.verifyPayment);
app.post("/wallets", walletController.getWallets);
app.post("/wallet/:id", walletController.getWallet);
app.get("/wallet-transactions", walletTransactionController.getWalletTransactions);
app.get("/wallet-transaction/:id", walletTransactionController.getWalletTransaction);
app.get("/transactions", transactionController.getTransactions);
app.get("/transaction/:id", transactionController.getTransaction);
app.get("/colleges", collegeController.getColleges);
app.get("/college/:id", collegeController.getCollege);
app.post("/create-college", collegeController.createCollege);
app.patch("/edit-college/:id", collegeController.editCollege);
app.delete("/delete-college/:id", collegeController.deleteCollege);
app.get("/departments", departmentController.getDepartments);
app.get("/department/:id", departmentController.getDepartment);
app.post("/create-department", departmentController.createDepartment);
app.patch("/edit-department/:id", departmentController.editDepartment);
app.delete("/delete-department/:id", departmentController.deleteDepartment);
app.get("/destinations", destinationController.getDestinations);
app.get("/destination/:id", destinationController.getDestination);
app.post("/create-destination", destinationController.createDestination);
app.patch("/edit-destination/:id", destinationController.editDestination);
app.delete("/delete-destination/:id", destinationController.deleteDestination);
app.get("/transcript-types", transcriptTypeController.getTranscriptTypes);
app.get("/transcript-type/:id", transcriptTypeController.getTranscriptType);
app.post("/create-transcript-type", transcriptTypeController.createTranscriptType);
app.patch("/edit-transcript-type/:id", transcriptTypeController.editTranscriptType);
app.delete("/delete-transcript-type/:id", transcriptTypeController.deleteTranscriptType);
app.get("/transcript-requests", transcriptRequestController.getTranscriptRequests);
app.get("/transcript-request/:id", transcriptRequestController.getTranscriptRequest);
app.post("/submit-request", transcriptRequestController.submitTranscriptRequest);
app.post("/submit-destination-request", userDestinationRequestController.submitDestinationRequest);
app.patch("/accept-destination-request/:id", userDestinationRequestController.acceptDestinationRequest);
app.use((err, req, res, next) => {
    if (!res.headersSent) {
        logger.error(err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map