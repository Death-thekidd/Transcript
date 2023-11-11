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
import * as privilegeController from "./controllers/privilege.controller";
import * as collegeController from "./controllers/college.controller";
import * as departmentController from "./controllers/department.controller";
import * as destinationController from "./controllers/destination.controller";
import * as transcriptRequestController from "./controllers/transcript-request.controller";
import * as transcriptTypeController from "./controllers/transcript-type.controller";
import * as userDestinationRequestController from "./controllers/user-destination-request.controller";

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
import { seedPrivileges } from "./seeders/priviledge.seeder";
import { seedUsers } from "./seeders/user.seeder";
import { seedRolesAndPrivileges } from "./seeders/role.seeder";

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

async function runAllSeeders() {
	try {
		// Synchronize the models with the database
		await sequelize.sync();

		// Call the privilege seeder
		await seedPrivileges();

		// Call the role seeder
		await seedRolesAndPrivileges();

		// Call the user seeder
		await seedUsers();

		console.log("All seeders completed.");
	} catch (error) {
		console.error("Error running seeders:", error);
	}
}

// Call the function to run all seeders
runAllSeeders();

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
		resave: false,
		saveUninitialized: false,
		secret: SESSION_SECRET,
		// store: new (SequelizeStore(session.Store))({
		// 	db: sequelize, // Use your Sequelize instance
		// 	tableName: "sessions", // Table name to store sessions in your database
		// }),
		cookie: {
			secure: true,
			maxAge: 1000 * 60 * 30,
		},
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
	if (req?.session?.userId) {
		return res.json({ valid: true, userId: req?.session?.userId });
	} else {
		return res.json({ valid: false });
	}
});
app.get("/users", [passportConfig.isAuthenticated], userController.getUsers);
app.get("/user/:id", [passportConfig.isAuthenticated], userController.getUser);
app.post("/login", userController.postLogin);
app.post("/logout", userController.logout);
app.post("/forgot", userController.postForgot);
app.post("/signup", userController.postSignup);

app.post(
	"/create-role",
	[passportConfig.isAuthenticated],
	roleController.createRole
);
app.get("/roles", [passportConfig.isAuthenticated], roleController.getRoles);
app.get("/role/:id", [passportConfig.isAuthenticated], roleController.getRole);
app.patch(
	"/edit-role/:id",
	[passportConfig.isAuthenticated],
	roleController.editRole
);
app.delete(
	"/delete-role/:id",
	[passportConfig.isAuthenticated],
	roleController.deleteRole
);

app.get(
	"/privileges",
	[passportConfig.isAuthenticated],
	privilegeController.getPrivileges
);

app.patch(
	"/update-user/:id",
	[passportConfig.isAuthenticated],
	userController.UpdateUser
);
app.delete(
	"/delete-user/:id",
	[passportConfig.isAuthenticated],
	userController.postDeleteUser
);

app.post(
	"/initialize-payment",
	[passportConfig.isAuthenticated],
	payStackController.initializePayment
);
app.post("/verify-payment", payStackController.verifyPayment);

app.post("/verify-transaction", walletController.verifyPayment);
app.post("/wallets", walletController.getWallets);
app.post("/wallet/:id", walletController.getWallet);

app.get(
	"/wallet-transactions",
	[passportConfig.isAuthenticated],
	walletTransactionController.getWalletTransactions
);
app.get(
	"/wallet-transaction/:id",
	[passportConfig.isAuthenticated],
	walletTransactionController.getWalletTransaction
);

app.get(
	"/transactions",
	[passportConfig.isAuthenticated],
	transactionController.getTransactions
);
app.get(
	"/transaction/:id",
	[passportConfig.isAuthenticated],
	transactionController.getTransaction
);

app.get(
	"/colleges",
	[passportConfig.isAuthenticated],
	collegeController.getColleges
);
app.get(
	"/college/:id",
	[passportConfig.isAuthenticated],
	collegeController.getCollege
);
app.post(
	"/create-college",
	[passportConfig.isAuthenticated],
	collegeController.createCollege
);
app.patch(
	"/edit-college/:id",
	[passportConfig.isAuthenticated],
	collegeController.editCollege
);
app.delete(
	"/delete-college/:id",
	[passportConfig.isAuthenticated],
	collegeController.deleteCollege
);

app.get(
	"/departments",
	[passportConfig.isAuthenticated],
	departmentController.getDepartments
);
app.get(
	"/department/:id",
	[passportConfig.isAuthenticated],
	departmentController.getDepartment
);
app.post(
	"/create-department",
	[passportConfig.isAuthenticated],
	departmentController.createDepartment
);
app.patch(
	"/edit-department/:id",
	[passportConfig.isAuthenticated],
	departmentController.editDepartment
);
app.delete(
	"/delete-department/:id",
	[passportConfig.isAuthenticated],
	departmentController.deleteDepartment
);

app.get(
	"/destinations",
	[passportConfig.isAuthenticated],
	destinationController.getDestinations
);
app.get(
	"/destination/:id",
	[passportConfig.isAuthenticated],
	destinationController.getDestination
);
app.post(
	"/create-destination",
	[passportConfig.isAuthenticated],
	destinationController.createDestination
);
app.patch(
	"/edit-destination/:id",
	[passportConfig.isAuthenticated],
	destinationController.editDestination
);
app.delete(
	"/delete-destination/:id",
	[passportConfig.isAuthenticated],
	destinationController.deleteDestination
);

app.get(
	"/transcript-types",
	[passportConfig.isAuthenticated],
	transcriptTypeController.getTranscriptTypes
);
app.get(
	"/transcript-type/:id",
	[passportConfig.isAuthenticated],
	transcriptTypeController.getTranscriptType
);
app.post(
	"/create-transcript-type",
	[passportConfig.isAuthenticated],
	transcriptTypeController.createTranscriptType
);
app.patch(
	"/edit-transcript-type/:id",
	[passportConfig.isAuthenticated],
	transcriptTypeController.editTranscriptType
);
app.delete(
	"/delete-transcript-type/:id",
	[passportConfig.isAuthenticated],
	transcriptTypeController.deleteTranscriptType
);

app.get(
	"/transcript-requests",
	[passportConfig.isAuthenticated],
	transcriptRequestController.getTranscriptRequests
);
app.get(
	"/transcript-request/:id",
	[passportConfig.isAuthenticated],
	transcriptRequestController.getTranscriptRequest
);
app.post(
	"/submit-request",
	[passportConfig.isAuthenticated],
	transcriptRequestController.submitTranscriptRequest
);
app.patch(
	"/update-transcript-request-status/:id",
	[passportConfig.isAuthenticated],
	transcriptRequestController.updateTranscriptRequestStaus
);
app.delete(
	"/delete-transcript-request/:id",
	[passportConfig.isAuthenticated],
	transcriptRequestController.deleteTranscriptRequest
);

app.get(
	"/destination-requests",
	[passportConfig.isAuthenticated],
	userDestinationRequestController.getDestinationRequests
);

app.get(
	"/destination-request/:id",
	[passportConfig.isAuthenticated],
	userDestinationRequestController.getDestinationRequest
);

app.post(
	"/submit-destination-request",
	[passportConfig.isAuthenticated],
	userDestinationRequestController.submitDestinationRequest
);

app.patch(
	"/accept-destination-request/:id",
	[passportConfig.isAuthenticated],
	userDestinationRequestController.acceptDestinationRequest
);

// sendMail(
// 	["ohiemidivine7@gmail.com"],
// 	"SIGN UP SUCCESFULL",
// 	`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// 	<html
// 		xmlns="http://www.w3.org/1999/xhtml"
// 		xmlns:o="urn:schemas-microsoft-com:office:office"
// 	>
// 		<head>
// 			<meta charset="UTF-8" />
// 			<meta content="width=device-width, initial-scale=1" name="viewport" />
// 			<meta name="x-apple-disable-message-reformatting" />
// 			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
// 			<meta content="telephone=no" name="format-detection" />
// 			<title>New message</title>
// 			<!--[if (mso 16)]>
// 				<style type="text/css">
// 					a {
// 						text-decoration: none;
// 					}
// 				</style>
// 			<![endif]-->
// 			<!--[if gte mso 9
// 				]><style>
// 					sup {
// 						font-size: 100% !important;
// 					}
// 				</style><!
// 			[endif]-->
// 			<!--[if !mso]><!-- -->
// 			<link
// 				href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i"
// 				rel="stylesheet"
// 			/>
// 			<!--<![endif]-->
// 			<!--[if gte mso 9]>
// 				<xml>
// 					<o:OfficeDocumentSettings>
// 						<o:AllowPNG></o:AllowPNG>
// 						<o:PixelsPerInch>96</o:PixelsPerInch>
// 					</o:OfficeDocumentSettings>
// 				</xml>
// 			<![endif]-->
// 			<style type="text/css">
// 				.rollover:hover .rollover-first {
// 					max-height: 0px !important;
// 					display: none !important;
// 				}
// 				.rollover:hover .rollover-second {
// 					max-height: none !important;
// 					display: inline-block !important;
// 				}
// 				.rollover div {
// 					font-size: 0px;
// 				}
// 				u ~ div img + div > div {
// 					display: none;
// 				}
// 				#outlook a {
// 					padding: 0;
// 				}
// 				span.MsoHyperlink,
// 				span.MsoHyperlinkFollowed {
// 					color: inherit;
// 					mso-style-priority: 99;
// 				}
// 				a.es-button {
// 					mso-style-priority: 100 !important;
// 					text-decoration: none !important;
// 				}
// 				a[x-apple-data-detectors] {
// 					color: inherit !important;
// 					text-decoration: none !important;
// 					font-size: inherit !important;
// 					font-family: inherit !important;
// 					font-weight: inherit !important;
// 					line-height: inherit !important;
// 				}
// 				.es-desk-hidden {
// 					display: none;
// 					float: left;
// 					overflow: hidden;
// 					width: 0;
// 					max-height: 0;
// 					line-height: 0;
// 					mso-hide: all;
// 				}
// 				.es-button-border:hover > a.es-button {
// 					color: #ffffff !important;
// 				}
// 				.es-button {
// 					transition: all 100ms ease-in;
// 				}
// 				.es-button:hover {
// 					background: #555555 !important;
// 					border-color: #555555 !important;
// 				}
// 				td .es-button-border:hover a.es-button-2921 {
// 					color: rgb(38, 164, 211) !important;
// 				}
// 				@media only screen and (max-width: 600px) {
// 					*[class="gmail-fix"] {
// 						display: none !important;
// 					}
// 					p,
// 					a {
// 						line-height: 150% !important;
// 					}
// 					h1,
// 					h1 a {
// 						line-height: 120% !important;
// 					}
// 					h2,
// 					h2 a {
// 						line-height: 120% !important;
// 					}
// 					h3,
// 					h3 a {
// 						line-height: 120% !important;
// 					}
// 					h4,
// 					h4 a {
// 						line-height: 120% !important;
// 					}
// 					h5,
// 					h5 a {
// 						line-height: 120% !important;
// 					}
// 					h6,
// 					h6 a {
// 						line-height: 120% !important;
// 					}
// 					h1 {
// 						font-size: 30px !important;
// 						text-align: center;
// 						line-height: 120% !important;
// 					}
// 					h2 {
// 						font-size: 26px !important;
// 						text-align: left;
// 						line-height: 120% !important;
// 					}
// 					h3 {
// 						font-size: 20px !important;
// 						text-align: left;
// 						line-height: 120% !important;
// 					}
// 					h4 {
// 						font-size: 24px !important;
// 						text-align: left;
// 					}
// 					h5 {
// 						font-size: 20px !important;
// 						text-align: left;
// 					}
// 					h6 {
// 						font-size: 16px !important;
// 						text-align: left;
// 					}
// 					.es-header-body h1 a,
// 					.es-content-body h1 a,
// 					.es-footer-body h1 a {
// 						font-size: 30px !important;
// 					}
// 					.es-header-body h2 a,
// 					.es-content-body h2 a,
// 					.es-footer-body h2 a {
// 						font-size: 26px !important;
// 					}
// 					.es-header-body h3 a,
// 					.es-content-body h3 a,
// 					.es-footer-body h3 a {
// 						font-size: 20px !important;
// 					}
// 					.es-header-body h4 a,
// 					.es-content-body h4 a,
// 					.es-footer-body h4 a {
// 						font-size: 24px !important;
// 					}
// 					.es-header-body h5 a,
// 					.es-content-body h5 a,
// 					.es-footer-body h5 a {
// 						font-size: 20px !important;
// 					}
// 					.es-header-body h6 a,
// 					.es-content-body h6 a,
// 					.es-footer-body h6 a {
// 						font-size: 16px !important;
// 					}
// 					.es-menu td a {
// 						font-size: 16px !important;
// 					}
// 					.es-header-body p,
// 					.es-header-body a {
// 						font-size: 16px !important;
// 					}
// 					.es-content-body p,
// 					.es-content-body a {
// 						font-size: 14px !important;
// 					}
// 					.es-footer-body p,
// 					.es-footer-body a {
// 						font-size: 17px !important;
// 					}
// 					.es-infoblock p,
// 					.es-infoblock a {
// 						font-size: 12px !important;
// 					}
// 					.es-m-txt-c,
// 					.es-m-txt-c h1,
// 					.es-m-txt-c h2,
// 					.es-m-txt-c h3,
// 					.es-m-txt-c h4,
// 					.es-m-txt-c h5,
// 					.es-m-txt-c h6 {
// 						text-align: center !important;
// 					}
// 					.es-m-txt-r,
// 					.es-m-txt-r h1,
// 					.es-m-txt-r h2,
// 					.es-m-txt-r h3,
// 					.es-m-txt-r h4,
// 					.es-m-txt-r h5,
// 					.es-m-txt-r h6 {
// 						text-align: right !important;
// 					}
// 					.es-m-txt-j,
// 					.es-m-txt-j h1,
// 					.es-m-txt-j h2,
// 					.es-m-txt-j h3,
// 					.es-m-txt-j h4,
// 					.es-m-txt-j h5,
// 					.es-m-txt-j h6 {
// 						text-align: justify !important;
// 					}
// 					.es-m-txt-l,
// 					.es-m-txt-l h1,
// 					.es-m-txt-l h2,
// 					.es-m-txt-l h3,
// 					.es-m-txt-l h4,
// 					.es-m-txt-l h5,
// 					.es-m-txt-l h6 {
// 						text-align: left !important;
// 					}
// 					.es-m-txt-r img,
// 					.es-m-txt-c img,
// 					.es-m-txt-l img {
// 						display: inline !important;
// 					}
// 					.es-m-txt-r .rollover:hover .rollover-second,
// 					.es-m-txt-c .rollover:hover .rollover-second,
// 					.es-m-txt-l .rollover:hover .rollover-second {
// 						display: inline !important;
// 					}
// 					.es-m-txt-r .rollover div,
// 					.es-m-txt-c .rollover div,
// 					.es-m-txt-l .rollover div {
// 						line-height: 0 !important;
// 						font-size: 0 !important;
// 					}
// 					.es-spacer {
// 						display: inline-table;
// 					}
// 					a.es-button,
// 					button.es-button {
// 						font-size: 14px !important;
// 					}
// 					a.es-button,
// 					button.es-button {
// 						display: inline-block !important;
// 					}
// 					.es-button-border {
// 						display: inline-block !important;
// 					}
// 					.es-m-fw,
// 					.es-m-fw.es-fw,
// 					.es-m-fw .es-button {
// 						display: block !important;
// 					}
// 					.es-m-il,
// 					.es-m-il .es-button,
// 					.es-social,
// 					.es-social td,
// 					.es-menu {
// 						display: inline-block !important;
// 					}
// 					.es-adaptive table,
// 					.es-left,
// 					.es-right {
// 						width: 100% !important;
// 					}
// 					.es-content table,
// 					.es-header table,
// 					.es-footer table,
// 					.es-content,
// 					.es-footer,
// 					.es-header {
// 						width: 100% !important;
// 						max-width: 600px !important;
// 					}
// 					.adapt-img {
// 						width: 100% !important;
// 						height: auto !important;
// 					}
// 					.es-mobile-hidden,
// 					.es-hidden {
// 						display: none !important;
// 					}
// 					.es-desk-hidden {
// 						width: auto !important;
// 						overflow: visible !important;
// 						float: none !important;
// 						max-height: inherit !important;
// 						line-height: inherit !important;
// 					}
// 					tr.es-desk-hidden {
// 						display: table-row !important;
// 					}
// 					table.es-desk-hidden {
// 						display: table !important;
// 					}
// 					td.es-desk-menu-hidden {
// 						display: table-cell !important;
// 					}
// 					.es-menu td {
// 						width: 1% !important;
// 					}
// 					table.es-table-not-adapt,
// 					.esd-block-html table {
// 						width: auto !important;
// 					}
// 					.es-social td {
// 						padding-bottom: 10px;
// 					}
// 					.h-auto {
// 						height: auto !important;
// 					}
// 					p,
// 					ul li,
// 					ol li,
// 					a {
// 						font-size: 17px !important;
// 					}
// 					h1 a {
// 						text-align: center;
// 					}
// 					h2 a {
// 						text-align: left;
// 					}
// 					h3 a {
// 						text-align: left;
// 					}
// 				}
// 			</style>
// 		</head>
// 		<body style="width: 100%; height: 100%; padding: 0; margin: 0">
// 			<div class="es-wrapper-color" style="background-color: #f1f1f1">
// 				<!--[if gte mso 9]>
// 					<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
// 						<v:fill type="tile" color="#f1f1f1"></v:fill>
// 					</v:background>
// 				<![endif]-->
// 				<table
// 					class="es-wrapper"
// 					width="100%"
// 					cellspacing="0"
// 					cellpadding="0"
// 					style="
// 						mso-table-lspace: 0pt;
// 						mso-table-rspace: 0pt;
// 						border-collapse: collapse;
// 						border-spacing: 0px;
// 						padding: 0;
// 						margin: 0;
// 						width: 100%;
// 						height: 100%;
// 						background-repeat: repeat;
// 						background-position: center top;
// 						background-color: #f1f1f1;
// 					"
// 				>
// 					<tr>
// 						<td valign="top" style="padding: 0; margin: 0">
// 							<table
// 								cellpadding="0"
// 								cellspacing="0"
// 								class="es-header"
// 								align="center"
// 								style="
// 									mso-table-lspace: 0pt;
// 									mso-table-rspace: 0pt;
// 									border-collapse: collapse;
// 									border-spacing: 0px;
// 									width: 100%;
// 									table-layout: fixed !important;
// 									background-color: transparent;
// 									background-repeat: repeat;
// 									background-position: center top;
// 								"
// 							>
// 								<tr>
// 									<td align="center" style="padding: 0; margin: 0">
// 										<table
// 											class="es-header-body"
// 											style="
// 												mso-table-lspace: 0pt;
// 												mso-table-rspace: 0pt;
// 												border-collapse: collapse;
// 												border-spacing: 0px;
// 												background-color: #ffffff;
// 												width: 600px;
// 											"
// 											cellspacing="0"
// 											cellpadding="0"
// 											bgcolor="#ffffff"
// 											align="center"
// 										>
// 											<tr>
// 												<td
// 													style="
// 														margin: 0;
// 														padding-top: 30px;
// 														padding-right: 40px;
// 														padding-bottom: 30px;
// 														padding-left: 40px;
// 														background-color: #333333;
// 													"
// 													bgcolor="#333333"
// 													align="left"
// 												>
// 													<table
// 														width="100%"
// 														cellspacing="0"
// 														cellpadding="0"
// 														style="
// 															mso-table-lspace: 0pt;
// 															mso-table-rspace: 0pt;
// 															border-collapse: collapse;
// 															border-spacing: 0px;
// 														"
// 													>
// 														<tr>
// 															<td
// 																valign="top"
// 																align="center"
// 																style="padding: 0; margin: 0; width: 520px"
// 															>
// 																<table
// 																	width="100%"
// 																	cellspacing="0"
// 																	cellpadding="0"
// 																	role="presentation"
// 																	style="
// 																		mso-table-lspace: 0pt;
// 																		mso-table-rspace: 0pt;
// 																		border-collapse: collapse;
// 																		border-spacing: 0px;
// 																	"
// 																>
// 																	<tr>
// 																		<td
// 																			align="center"
// 																			style="padding: 0; margin: 0; font-size: 0"
// 																		>
// 																			<a
// 																				href="https://viewstripo.email/"
// 																				target="_blank"
// 																				style="
// 																					mso-line-height-rule: exactly;
// 																					text-decoration: underline;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					font-size: 14px;
// 																					color: #ffffff;
// 																				"
// 																				><img
// 																					src="cid:logo"
// 																					alt=""
// 																					style="
// 																						display: block;
// 																						font-size: 14px;
// 																						border: 0;
// 																						outline: none;
// 																						text-decoration: none;
// 																					"
// 																					width="100%"
// 																			/></a>
// 																		</td>
// 																	</tr>
// 																</table>
// 															</td>
// 														</tr>
// 													</table>
// 												</td>
// 											</tr>
// 										</table>
// 									</td>
// 								</tr>
// 							</table>
// 							<table
// 								class="es-content"
// 								cellspacing="0"
// 								cellpadding="0"
// 								align="center"
// 								style="
// 									mso-table-lspace: 0pt;
// 									mso-table-rspace: 0pt;
// 									border-collapse: collapse;
// 									border-spacing: 0px;
// 									width: 100%;
// 									table-layout: fixed !important;
// 								"
// 							>
// 								<tr>
// 									<td align="center" style="padding: 0; margin: 0">
// 										<table
// 											class="es-content-body"
// 											style="
// 												mso-table-lspace: 0pt;
// 												mso-table-rspace: 0pt;
// 												border-collapse: collapse;
// 												border-spacing: 0px;
// 												background-color: #333333;
// 												width: 600px;
// 											"
// 											cellspacing="0"
// 											cellpadding="0"
// 											bgcolor="#333333"
// 											align="center"
// 										>
// 											<tr>
// 												<td
// 													style="
// 														margin: 0;
// 														padding-right: 40px;
// 														padding-left: 40px;
// 														padding-top: 40px;
// 														padding-bottom: 40px;
// 														background-image: url('https://qxwocb.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png');
// 														background-repeat: no-repeat;
// 													"
// 													align="left"
// 													background="https://qxwocb.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"
// 												>
// 													<table
// 														width="100%"
// 														cellspacing="0"
// 														cellpadding="0"
// 														style="
// 															mso-table-lspace: 0pt;
// 															mso-table-rspace: 0pt;
// 															border-collapse: collapse;
// 															border-spacing: 0px;
// 														"
// 													>
// 														<tr>
// 															<td
// 																valign="top"
// 																align="center"
// 																style="padding: 0; margin: 0; width: 520px"
// 															>
// 																<table
// 																	width="100%"
// 																	cellspacing="0"
// 																	cellpadding="0"
// 																	role="presentation"
// 																	style="
// 																		mso-table-lspace: 0pt;
// 																		mso-table-rspace: 0pt;
// 																		border-collapse: collapse;
// 																		border-spacing: 0px;
// 																	"
// 																>
// 																	<tr>
// 																		<td
// 																			align="center"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-top: 40px;
// 																				padding-bottom: 10px;
// 																			"
// 																		>
// 																			<h1
// 																				style="
// 																					margin: 0;
// 																					font-family: lato, 'helvetica neue',
// 																						helvetica, arial, sans-serif;
// 																					mso-line-height-rule: exactly;
// 																					letter-spacing: 0;
// 																					font-size: 30px;
// 																					font-style: normal;
// 																					font-weight: bold;
// 																					line-height: 36px;
// 																					color: #ffffff;
// 																				"
// 																			>
// 																				Welcome Transcript Admin
// 																			</h1>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			esdev-links-color="#757575"
// 																			align="center"
// 																			style="
// 																				margin: 0;
// 																				padding-top: 10px;
// 																				padding-right: 30px;
// 																				padding-bottom: 20px;
// 																				padding-left: 30px;
// 																			"
// 																		>
// 																			<p
// 																				style="
// 																					margin: 0;
// 																					mso-line-height-rule: exactly;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					line-height: 23px;
// 																					letter-spacing: 0;
// 																					color: #757575;
// 																					font-size: 15px;
// 																				"
// 																			>
// 																				Lorem ipsum dolor sit amet, consectetur
// 																				adipisicing elit, sed do eiusmod tempor
// 																				incididunt ut labore.
// 																			</p>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			align="center"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-top: 10px;
// 																				padding-bottom: 20px;
// 																			"
// 																		>
// 																			<span
// 																				class="es-button-border"
// 																				style="
// 																					border-style: solid;
// 																					border-color: #26a4d3;
// 																					background: none 0% 0% repeat scroll
// 																						#26a4d3;
// 																					border-width: 0px;
// 																					display: inline-block;
// 																					border-radius: 50px;
// 																					width: auto;
// 																				"
// 																				><a
// 																					href="https://transcript.dtkapp.com.ng/"
// 																					class="es-button"
// 																					target="_blank"
// 																					style="
// 																						mso-style-priority: 100 !important;
// 																						text-decoration: none !important;
// 																						transition: all 100ms ease-in;
// 																						mso-line-height-rule: exactly;
// 																						font-family: arial, 'helvetica neue',
// 																							helvetica, sans-serif;
// 																						font-size: 14px;
// 																						color: #ffffff;
// 																						padding: 10px 20px 10px 20px;
// 																						display: inline-block;
// 																						background: #26a4d3;
// 																						border-radius: 50px;
// 																						font-weight: bold;
// 																						font-style: normal;
// 																						line-height: 17px !important;
// 																						width: auto;
// 																						text-align: center;
// 																						letter-spacing: 0;
// 																						mso-padding-alt: 0;
// 																						mso-border-alt: 10px solid #26a4d3;
// 																						border-color: #26a4d3;
// 																					"
// 																					>ACCESS ACCOUNT</a
// 																				></span
// 																			>
// 																		</td>
// 																	</tr>
// 																</table>
// 															</td>
// 														</tr>
// 													</table>
// 												</td>
// 											</tr>
// 										</table>
// 									</td>
// 								</tr>
// 							</table>
// 							<table
// 								class="es-content"
// 								cellspacing="0"
// 								cellpadding="0"
// 								align="center"
// 								style="
// 									mso-table-lspace: 0pt;
// 									mso-table-rspace: 0pt;
// 									border-collapse: collapse;
// 									border-spacing: 0px;
// 									width: 100%;
// 									table-layout: fixed !important;
// 								"
// 							>
// 								<tr>
// 									<td align="center" style="padding: 0; margin: 0">
// 										<table
// 											class="es-content-body"
// 											cellspacing="0"
// 											cellpadding="0"
// 											bgcolor="#ffffff"
// 											align="center"
// 											style="
// 												mso-table-lspace: 0pt;
// 												mso-table-rspace: 0pt;
// 												border-collapse: collapse;
// 												border-spacing: 0px;
// 												background-color: #ffffff;
// 												width: 600px;
// 											"
// 										>
// 											<tr>
// 												<td
// 													align="left"
// 													style="
// 														padding: 0;
// 														margin: 0;
// 														padding-right: 40px;
// 														padding-left: 40px;
// 														padding-top: 40px;
// 													"
// 												>
// 													<table
// 														width="100%"
// 														cellspacing="0"
// 														cellpadding="0"
// 														style="
// 															mso-table-lspace: 0pt;
// 															mso-table-rspace: 0pt;
// 															border-collapse: collapse;
// 															border-spacing: 0px;
// 														"
// 													>
// 														<tr>
// 															<td
// 																valign="top"
// 																align="center"
// 																style="padding: 0; margin: 0; width: 520px"
// 															>
// 																<table
// 																	width="100%"
// 																	cellspacing="0"
// 																	cellpadding="0"
// 																	role="presentation"
// 																	style="
// 																		mso-table-lspace: 0pt;
// 																		mso-table-rspace: 0pt;
// 																		border-collapse: collapse;
// 																		border-spacing: 0px;
// 																	"
// 																>
// 																	<tr>
// 																		<td
// 																			class="es-m-txt-c"
// 																			align="left"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-bottom: 15px;
// 																				padding-top: 5px;
// 																			"
// 																		>
// 																			<h2
// 																				style="
// 																					margin: 0;
// 																					font-family: lato, 'helvetica neue',
// 																						helvetica, arial, sans-serif;
// 																					mso-line-height-rule: exactly;
// 																					letter-spacing: 0;
// 																					font-size: 20px;
// 																					font-style: normal;
// 																					font-weight: bold;
// 																					line-height: 24px;
// 																					color: #333333;
// 																				"
// 																			>
// 																				YOUR ACCOUNT IS NOW ACTIVE
// 																			</h2>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			align="left"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-bottom: 10px;
// 																			"
// 																		>
// 																			<p
// 																				style="
// 																					margin: 0;
// 																					mso-line-height-rule: exactly;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					line-height: 23px;
// 																					letter-spacing: 0;
// 																					color: #555555;
// 																					font-size: 15px;
// 																				"
// 																			>
// 																				<strong
// 																					>Lorem ipsum dolor sit amet, consectetur
// 																					adipisicing elit, sed do eiusmod tempor
// 																					incididunt ut labore et dolore magna
// 																					aliqua. Ut enim ad minim veniam, quis
// 																					nostrud exercitation ullamco laboris
// 																					nisi ut aliquip ex ea commodo
// 																					consequat.</strong
// 																				>
// 																			</p>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			align="left"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-bottom: 10px;
// 																				padding-top: 10px;
// 																			"
// 																		>
// 																			<p
// 																				style="
// 																					margin: 0;
// 																					mso-line-height-rule: exactly;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					line-height: 23px;
// 																					letter-spacing: 0;
// 																					color: #555555;
// 																					font-size: 15px;
// 																				"
// 																			>
// 																				Lorem ipsum dolor sit amet, consectetur
// 																				adipisicing elit, sed do eiusmod tempor
// 																				incididunt ut labore et dolore magna
// 																				aliqua. Ut enim ad minim veniam, quis
// 																				nostrud exercitation ullamco laboris nisi
// 																				ut aliquip ex ea commodo consequat.<br />
// 																			</p>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			align="left"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-bottom: 10px;
// 																				padding-top: 10px;
// 																			"
// 																		>
// 																			<p
// 																				style="
// 																					margin: 0;
// 																					mso-line-height-rule: exactly;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					line-height: 23px;
// 																					letter-spacing: 0;
// 																					color: #555555;
// 																					font-size: 15px;
// 																				"
// 																			>
// 																				Yours sincerely,
// 																			</p>
// 																		</td>
// 																	</tr>
// 																</table>
// 															</td>
// 														</tr>
// 													</table>
// 												</td>
// 											</tr>
// 											<tr>
// 												<td
// 													align="left"
// 													style="
// 														margin: 0;
// 														padding-right: 40px;
// 														padding-left: 40px;
// 														padding-bottom: 40px;
// 														padding-top: 10px;
// 													"
// 												>
// 													<!--[if mso]><table style="width:520px" cellpadding="0"
// 	cellspacing="0"><tr><td style="width:40px" valign="top"><![endif]-->
// 													<table
// 														class="es-left"
// 														cellspacing="0"
// 														cellpadding="0"
// 														align="left"
// 														style="
// 															mso-table-lspace: 0pt;
// 															mso-table-rspace: 0pt;
// 															border-collapse: collapse;
// 															border-spacing: 0px;
// 															float: left;
// 														"
// 													>
// 														<tr>
// 															<td
// 																class="es-m-p0r es-m-p20b"
// 																valign="top"
// 																align="center"
// 																style="padding: 0; margin: 0; width: 40px"
// 															>
// 																<table
// 																	width="100%"
// 																	cellspacing="0"
// 																	cellpadding="0"
// 																	role="presentation"
// 																	style="
// 																		mso-table-lspace: 0pt;
// 																		mso-table-rspace: 0pt;
// 																		border-collapse: collapse;
// 																		border-spacing: 0px;
// 																	"
// 																>
// 																	<tr>
// 																		<td
// 																			align="left"
// 																			style="padding: 0; margin: 0; font-size: 0"
// 																		>
// 																			<img
// 																				src="https://qxwocb.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/29241521207598269.jpg"
// 																				alt=""
// 																				style="
// 																					display: block;
// 																					font-size: 14px;
// 																					border: 0;
// 																					outline: none;
// 																					text-decoration: none;
// 																				"
// 																				width="40"
// 																			/>
// 																		</td>
// 																	</tr>
// 																</table>
// 															</td>
// 														</tr>
// 													</table>
// 													<!--[if mso]></td><td style="width:20px"></td><td style="width:460px" valign="top"><![endif]-->
// 													<table
// 														cellspacing="0"
// 														cellpadding="0"
// 														align="right"
// 														style="
// 															mso-table-lspace: 0pt;
// 															mso-table-rspace: 0pt;
// 															border-collapse: collapse;
// 															border-spacing: 0px;
// 														"
// 													>
// 														<tr>
// 															<td
// 																align="left"
// 																style="padding: 0; margin: 0; width: 460px"
// 															>
// 																<table
// 																	width="100%"
// 																	cellspacing="0"
// 																	cellpadding="0"
// 																	role="presentation"
// 																	style="
// 																		mso-table-lspace: 0pt;
// 																		mso-table-rspace: 0pt;
// 																		border-collapse: collapse;
// 																		border-spacing: 0px;
// 																	"
// 																>
// 																	<tr>
// 																		<td
// 																			align="left"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-top: 10px;
// 																			"
// 																		>
// 																			<p
// 																				style="
// 																					margin: 0;
// 																					mso-line-height-rule: exactly;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					line-height: 21px;
// 																					letter-spacing: 0;
// 																					color: #222222;
// 																					font-size: 14px;
// 																				"
// 																			>
// 																				<strong>Anna Bella</strong><br />
// 																			</p>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			align="left"
// 																			style="padding: 0; margin: 0"
// 																		>
// 																			<p
// 																				style="
// 																					margin: 0;
// 																					mso-line-height-rule: exactly;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					line-height: 21px;
// 																					letter-spacing: 0;
// 																					color: #666666;
// 																					font-size: 14px;
// 																				"
// 																			>
// 																				VC | Bells University of Technology Ota
// 																			</p>
// 																		</td>
// 																	</tr>
// 																</table>
// 															</td>
// 														</tr>
// 													</table>
// 													<!--[if mso]></td></tr></table><![endif]-->
// 												</td>
// 											</tr>
// 										</table>
// 									</td>
// 								</tr>
// 							</table>
// 							<table
// 								class="es-content"
// 								cellspacing="0"
// 								cellpadding="0"
// 								align="center"
// 								style="
// 									mso-table-lspace: 0pt;
// 									mso-table-rspace: 0pt;
// 									border-collapse: collapse;
// 									border-spacing: 0px;
// 									width: 100%;
// 									table-layout: fixed !important;
// 								"
// 							>
// 								<tr>
// 									<td align="center" style="padding: 0; margin: 0">
// 										<table
// 											class="es-content-body"
// 											style="
// 												mso-table-lspace: 0pt;
// 												mso-table-rspace: 0pt;
// 												border-collapse: collapse;
// 												border-spacing: 0px;
// 												background-color: #26a4d3;
// 												width: 600px;
// 											"
// 											cellspacing="0"
// 											cellpadding="0"
// 											bgcolor="#26a4d3"
// 											align="center"
// 										>
// 											<tr>
// 												<td
// 													style="
// 														margin: 0;
// 														padding-right: 40px;
// 														padding-left: 40px;
// 														padding-top: 40px;
// 														padding-bottom: 20px;
// 														background-color: #26a4d3;
// 													"
// 													bgcolor="#26a4d3"
// 													align="left"
// 												>
// 													<table
// 														width="100%"
// 														cellspacing="0"
// 														cellpadding="0"
// 														style="
// 															mso-table-lspace: 0pt;
// 															mso-table-rspace: 0pt;
// 															border-collapse: collapse;
// 															border-spacing: 0px;
// 														"
// 													>
// 														<tr>
// 															<td
// 																valign="top"
// 																align="center"
// 																style="padding: 0; margin: 0; width: 520px"
// 															>
// 																<table
// 																	width="100%"
// 																	cellspacing="0"
// 																	cellpadding="0"
// 																	role="presentation"
// 																	style="
// 																		mso-table-lspace: 0pt;
// 																		mso-table-rspace: 0pt;
// 																		border-collapse: collapse;
// 																		border-spacing: 0px;
// 																	"
// 																>
// 																	<tr>
// 																		<td
// 																			class="es-m-txt-c"
// 																			align="center"
// 																			style="padding: 0; margin: 0"
// 																		>
// 																			<h2
// 																				style="
// 																					margin: 0;
// 																					font-family: lato, 'helvetica neue',
// 																						helvetica, arial, sans-serif;
// 																					mso-line-height-rule: exactly;
// 																					letter-spacing: 0;
// 																					font-size: 20px;
// 																					font-style: normal;
// 																					font-weight: bold;
// 																					line-height: 24px;
// 																					color: #ffffff;
// 																				"
// 																			>
// 																				SUPPORT<br />
// 																			</h2>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			align="center"
// 																			style="
// 																				padding: 0;
// 																				margin: 0;
// 																				padding-bottom: 10px;
// 																				padding-top: 5px;
// 																			"
// 																		>
// 																			<p
// 																				style="
// 																					margin: 0;
// 																					mso-line-height-rule: exactly;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					line-height: 26px;
// 																					letter-spacing: 0;
// 																					color: #aad4ea;
// 																					font-size: 17px;
// 																				"
// 																			>
// 																			If you have any questions or need assistance, please feel free to contact us at support@transcript.dtkapp.com.ng<br />
// 																			</p>
// 																		</td>
// 																	</tr>
// 																	<tr>
// 																		<td
// 																			align="center"
// 																			style="padding: 10px; margin: 0"
// 																		>
// 																			<span
// 																				class="es-button-border"
// 																				style="
// 																					border-style: solid;
// 																					border-color: #26a4d3;
// 																					background: #ffffff;
// 																					border-width: 0px;
// 																					display: inline-block;
// 																					border-radius: 50px;
// 																					width: auto;
// 																				"
// 																				><a
// 																					href="mailto:support@transcript.dtkapp.com.ng"
// 																					class="es-button es-button-2921"
// 																					target="_blank"
// 																					style="
// 																						mso-style-priority: 100 !important;
// 																						text-decoration: none !important;
// 																						transition: all 100ms ease-in;
// 																						mso-line-height-rule: exactly;
// 																						font-family: arial, 'helvetica neue',
// 																							helvetica, sans-serif;
// 																						font-size: 14px;
// 																						color: #26a4d3;
// 																						padding: 15px 25px;
// 																						display: inline-block;
// 																						background: #ffffff;
// 																						border-radius: 50px;
// 																						font-weight: bold;
// 																						font-style: normal;
// 																						line-height: 17px !important;
// 																						width: auto;
// 																						text-align: center;
// 																						letter-spacing: 0;
// 																						mso-padding-alt: 0;
// 																						mso-border-alt: 10px solid #26a4d3;
// 																						border-color: #ffffff;
// 																					"
// 																					>CONTACT SUPPPORT</a
// 																				></span
// 																			>
// 																		</td>
// 																	</tr>
// 																</table>
// 															</td>
// 														</tr>
// 													</table>
// 												</td>
// 											</tr>
// 										</table>
// 									</td>
// 								</tr>
// 							</table>
// 							<table
// 								class="es-content"
// 								cellspacing="0"
// 								cellpadding="0"
// 								align="center"
// 								style="
// 									mso-table-lspace: 0pt;
// 									mso-table-rspace: 0pt;
// 									border-collapse: collapse;
// 									border-spacing: 0px;
// 									width: 100%;
// 									table-layout: fixed !important;
// 								"
// 							>
// 								<tr>
// 									<td align="center" style="padding: 0; margin: 0">
// 										<table
// 											class="es-content-body"
// 											style="
// 												mso-table-lspace: 0pt;
// 												mso-table-rspace: 0pt;
// 												border-collapse: collapse;
// 												border-spacing: 0px;
// 												background-color: transparent;
// 												width: 600px;
// 											"
// 											cellspacing="0"
// 											cellpadding="0"
// 											align="center"
// 										>
// 											<tr>
// 												<td
// 													align="left"
// 													style="
// 														margin: 0;
// 														padding-top: 30px;
// 														padding-bottom: 30px;
// 														padding-right: 20px;
// 														padding-left: 20px;
// 													"
// 												>
// 													<table
// 														width="100%"
// 														cellspacing="0"
// 														cellpadding="0"
// 														style="
// 															mso-table-lspace: 0pt;
// 															mso-table-rspace: 0pt;
// 															border-collapse: collapse;
// 															border-spacing: 0px;
// 														"
// 													>
// 														<tr>
// 															<td
// 																valign="top"
// 																align="center"
// 																style="padding: 0; margin: 0; width: 560px"
// 															>
// 																<table
// 																	width="100%"
// 																	cellspacing="0"
// 																	cellpadding="0"
// 																	role="presentation"
// 																	style="
// 																		mso-table-lspace: 0pt;
// 																		mso-table-rspace: 0pt;
// 																		border-collapse: collapse;
// 																		border-spacing: 0px;
// 																	"
// 																>
// 																	<tr>
// 																		<td
// 																			class="es-infoblock made_with"
// 																			align="center"
// 																			style="padding: 0; margin: 0; font-size: 0"
// 																		>
// 																			<a
// 																				target="_blank"
// 																				href="https://transcript.dtkapp.com"
// 																				style="
// 																					mso-line-height-rule: exactly;
// 																					text-decoration: underline;
// 																					font-family: helvetica, 'helvetica neue',
// 																						arial, verdana, sans-serif;
// 																					font-size: 12px;
// 																					color: #cccccc;
// 																				"
// 																				><img
// 																					src="cid:logo"
// 																					alt=""
// 																					width="125"
// 																					style="
// 																						display: block;
// 																						font-size: 14px;
// 																						border: 0;
// 																						outline: none;
// 																						text-decoration: none;
// 																					"
// 																			/></a>
// 																		</td>
// 																	</tr>
// 																</table>
// 															</td>
// 														</tr>
// 													</table>
// 												</td>
// 											</tr>
// 										</table>
// 									</td>
// 								</tr>
// 							</table>
// 						</td>
// 					</tr>
// 				</table>
// 			</div>
// 		</body>
// 	</html>`,
// 	"Good day transcript admin,\nYou have succesfully reqistered to the Transcript request app and can log in at https://transcript.dtkapp.com.ng\nIf you have any questions or need assistance, please feel free to contact us at support@transcript.dtkapp.com.ng.\nSincerely,\nSupport\nBells University of Technology Ota",
// 	{
// 		filename: "logo.png",
// 		path: __dirname + "/public/images/logo.png",
// 		cid: "logo",
// 	}
// );

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	if (!res.headersSent) {
		logger.error(err.message);
		res.status(err.status || 500).json({ error: err.message });
	}
});

export default app;
