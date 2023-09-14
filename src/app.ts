import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import winston from "winston";
import { SESSION_SECRET } from "./util/secrets";
import SequelizeStore from "connect-session-sequelize";

// Controllers (route handlers)
import * as userController from "./controllers/user.controller";
import * as payStackController from "./controllers/payStack.controller";
import * as walletController from "./controllers/wallet.controller";
import * as walletTransactionController from "./controllers/walletTransaction.controller";
import * as transactionController from "./controllers/transaction.controller";
import * as roleController from "./controllers/role.controller";
import * as collegeController from "./controllers/college.controller";
import * as departmentController from "./controllers/department.controller";
import * as transcriptRequestController from "./controllers/transcript-request.controller";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

import sequelize from "./sequelize";
import { init as initUserModel } from "./models/user.model";
import { init as initWalletModel } from "./models/wallet.model";
import { init as initWalletTransactionModel } from "./models/walletTransaction.model";
import { init as initTransactionModel } from "./models/transaction.model";
import { init as initDestinationModel } from "./models/destination.model";
import { init as initRoleModel } from "./models/role.model";
import { init as initTranscriptRequestModel } from "./models/transcript-request.model";
import { init as initUserDestinationRequestModel } from "./models/user-destination-request.model";
import { init as initCollegeModel } from "./models/college.model";
import { init as initDepartmentModel } from "./models/department.model";
import { init as initTranscriptTypeModel } from "./models/transcript-type.model";

// Create Express server
const app = express();

app.use(cors());

// Initialize models
initUserModel();
initRoleModel();
initWalletModel();
initWalletTransactionModel();
initTransactionModel();
initDestinationModel();
initTranscriptRequestModel();
initUserDestinationRequestModel();
initCollegeModel();
initDepartmentModel();
initTranscriptTypeModel();

// Sync the database
sequelize
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
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: SESSION_SECRET,
		store: new (SequelizeStore(session.Store))({
			db: sequelize, // Use your Sequelize instance
			tableName: "sessions", // Table name to store sessions in your database
		}),
	})
);
app.use(passport.initialize());
app.use(passport.session());

const logger = winston.createLogger({
	transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
	],
});

/**
 * Primary app routes.
 */
app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Welcome to Transcript application." });
});
app.get("/users", userController.getUsers);
app.get("/user/:id", userController.getUser);
app.post("/login", userController.postLogin);
app.post("/forgot", userController.postForgot);
app.post("/signup", userController.postSignup);

app.post("/create-role", roleController.createRole);
app.get("/roles", roleController.getRoles);
app.get("/role/:id", roleController.getRole);

app.post(
	"/account/profile",
	passportConfig.isAuthenticated,
	userController.postUpdateProfile
);
app.post(
	"/account/password",
	passportConfig.isAuthenticated,
	userController.postUpdatePassword
);
app.post(
	"/account/delete",
	passportConfig.isAuthenticated,
	userController.postDeleteAccount
);

app.post("/initialize-payment", payStackController.initializePayment);

app.post("/verify-transaction", walletController.verifyPayment);
app.post("/wallets", walletController.getWallets);
app.post("/wallet/:id", walletController.getWallet);

app.get(
	"/wallet-transactions",
	walletTransactionController.getWalletTransactions
);
app.get(
	"/wallet-transaction/:id",
	walletTransactionController.getWalletTransaction
);

app.get("/transactions", transactionController.getTransactions);
app.get("/transaction/:id", transactionController.getTransaction);

app.get("/colleges", collegeController.getColleges);
app.get("/college/:id", collegeController.getCollege);
app.post("/create-college", collegeController.createCollege);

app.get("/departments", departmentController.getDepartments);
app.get("/department/:id", departmentController.getDepartment);
app.post("/create-department", departmentController.createDepartment);

app.use((err: any, res: Response) => {
	if (!res.headersSent) {
		logger.error(err.message);
		res.status(err.status || 500).json({ error: err.message });
	}
});

export default app;
