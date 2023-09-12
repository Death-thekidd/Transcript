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

app.post(
	"/wallet-transactions",
	walletTransactionController.getWalletTransactions
);
app.post(
	"/wallet-transaction/:id",
	walletTransactionController.getWalletTransaction
);

app.post("/transactions", transactionController.getTransactions);
app.post("/transaction/:id", transactionController.getTransaction);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	if (!res.headersSent) {
		logger.error(err.message);
		res.status(err.status || 500).json({ error: err.message });
	}
});

export default app;
