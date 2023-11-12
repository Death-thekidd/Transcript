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
const privilegeController = __importStar(require("./controllers/privilege.controller"));
const collegeController = __importStar(require("./controllers/college.controller"));
const departmentController = __importStar(require("./controllers/department.controller"));
const destinationController = __importStar(require("./controllers/destination.controller"));
const transcriptRequestController = __importStar(require("./controllers/transcript-request.controller"));
const transcriptTypeController = __importStar(require("./controllers/transcript-type.controller"));
const userDestinationRequestController = __importStar(require("./controllers/user-destination-request.controller"));
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
const priviledge_seeder_1 = require("./seeders/priviledge.seeder");
const user_seeder_1 = require("./seeders/user.seeder");
const role_seeder_1 = require("./seeders/role.seeder");
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
function runAllSeeders() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Synchronize the models with the database
            yield sequelize_1.default.sync();
            // Call the privilege seeder
            yield priviledge_seeder_1.seedPrivileges();
            // Call the role seeder
            yield role_seeder_1.seedRolesAndPrivileges();
            // Call the user seeder
            yield user_seeder_1.seedUsers();
            console.log("All seeders completed.");
        }
        catch (error) {
            console.error("Error running seeders:", error);
        }
    });
}
// Call the function to run all seeders
runAllSeeders();
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
    resave: false,
    saveUninitialized: false,
    secret: secrets_1.SESSION_SECRET,
    store: new (connect_session_sequelize_1.default(express_session_1.default.Store))({
        db: sequelize_1.default,
        tableName: "sessions", // Table name to store sessions in your database
    }),
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 30,
    },
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
    var _a;
    if (req === null || req === void 0 ? void 0 : req.user) {
        return res.json({ valid: true, userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id });
    }
    else {
        return res.json({ valid: false });
    }
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
app.patch("/edit-role/:id", roleController.editRole);
app.delete("/delete-role/:id", roleController.deleteRole);
app.get("/privileges", privilegeController.getPrivileges);
app.patch("/update-user/:id", userController.UpdateUser);
app.delete("/delete-user/:id", userController.postDeleteUser);
app.post("/initialize-payment", payStackController.initializePayment);
app.post("/verify-payment", payStackController.verifyPayment);
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
app.patch("/update-transcript-request-status/:id", transcriptRequestController.updateTranscriptRequestStaus);
app.delete("/delete-transcript-request/:id", transcriptRequestController.deleteTranscriptRequest);
app.get("/destination-requests", userDestinationRequestController.getDestinationRequests);
app.get("/destination-request/:id", userDestinationRequestController.getDestinationRequest);
app.post("/submit-destination-request", userDestinationRequestController.submitDestinationRequest);
app.patch("/accept-destination-request/:id", userDestinationRequestController.acceptDestinationRequest);
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
app.use((err, req, res, next) => {
    if (!res.headersSent) {
        logger.error(err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map