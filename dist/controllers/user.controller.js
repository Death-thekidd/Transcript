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
exports.postForgot = exports.postReset = exports.postDeleteUser = exports.UpdateUser = exports.postSignup = exports.createUser = exports.logout = exports.postLogin = exports.getUser = exports.getUsers = void 0;
const async_1 = __importDefault(require("async"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../models/user.model");
const express_validator_1 = require("express-validator");
require("../config/passport");
const sequelize_1 = require("sequelize");
const sendMail_1 = __importDefault(require("../sendMail"));
const role_model_1 = require("../models/role.model");
const college_model_1 = require("../models/college.model");
const department_model_1 = require("../models/department.model");
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
/**
 * Get all users
 * @route GET /users
 */
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.findAll();
        return res.status(200).json({ data: users });
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
/**
 * Get User by ID
 * @route GET /user/:id
 */
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_model_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get the user's roles
        const roles = yield user.getRoles();
        // Initialize an array to store privileges
        const privileges = [];
        // Loop through each role and fetch its associated privileges
        for (const role of roles) {
            const rolePrivileges = yield role.getPrivileges();
            // Check and add privileges if they don't already exist in the privileges array
            for (const privilege of rolePrivileges) {
                if (!privileges.some((p) => p.name === privilege.name)) {
                    privileges.push(privilege);
                }
            }
        }
        return res
            .status(200)
            .json({
            data: Object.assign(Object.assign({}, user.dataValues), { privileges, roles: roles.map((role) => role === null || role === void 0 ? void 0 : role.name) }),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
/**
 * Sign in using email and password.
 * @route POST /login
 */
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Email is not valid").isEmail().run(req);
    yield express_validator_1.check("password", "Password cannot be blank")
        .isLength({ min: 1 })
        .run(req);
    yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        // Return validation errors as JSON
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: err.message }); // Internal server error
        }
        if (!user) {
            // Return authentication failure as JSON
            return res.status(401).json({ error: info.message }); // Unauthorized
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message }); // Internal server error
            }
            // Return success message and user data as JSON
            req.session.user = user;
            return res
                .status(200)
                .json({ message: "Success! You are logged in.", user });
        });
    })(req, res, next);
});
exports.postLogin = postLogin;
/**
 * Log out.
 * @route POST /logout
 */
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout();
    return res.status(200).json({ message: "Success! You are logged out." });
});
exports.logout = logout;
const createUser = (userObj) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, college, department, name, schoolId, roles, userType, } = userObj;
    const existingUser = yield user_model_1.User.findOne({ where: { email: email } });
    if (existingUser) {
        console.error("User with this email already exists");
        throw new Error("Account with that email address already exists.");
    }
    let userMain;
    if (userType === "Student") {
        const _college = yield college_model_1.College.findOne({ where: { name: college } });
        const _department = yield department_model_1.Department.findOne({
            where: { name: department },
        });
        const user = yield user_model_1.User.create({
            schoolId: schoolId,
            name: name,
            userType: userType,
            password: password,
            email: email,
            department: department,
            college: college,
            collegeID: _college === null || _college === void 0 ? void 0 : _college.id,
            departmentID: _department === null || _department === void 0 ? void 0 : _department.id,
            isAdmin: roles.includes("Admin") ? true : false,
        });
        userMain = user;
    }
    else {
        const user = yield user_model_1.User.create({
            schoolId: schoolId,
            name: name,
            userType: userType,
            password: password,
            email: email,
            isAdmin: roles.includes("Admin") ? true : false,
        });
        userMain = user;
    }
    roles.map((role) => __awaiter(void 0, void 0, void 0, function* () {
        const defaultRole = yield role_model_1.Role.findOne({
            where: { name: role ? role : "User" },
        });
        if (defaultRole) {
            yield userMain.addRole(defaultRole);
        }
    }));
    sendMail_1.default([userMain.email], "SIGN UP SUCCESFULL", `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:o="urn:schemas-microsoft-com:office:office"
>
	<head>
		<meta charset="UTF-8" />
		<meta content="width=device-width, initial-scale=1" name="viewport" />
		<meta name="x-apple-disable-message-reformatting" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta content="telephone=no" name="format-detection" />
		<title>New message</title>
		<!--[if (mso 16)]>
			<style type="text/css">
				a {
					text-decoration: none;
				}
			</style>
		<![endif]-->
		<!--[if gte mso 9
			]><style>
				sup {
					font-size: 100% !important;
				}
			</style><!
		[endif]-->
		<!--[if !mso]><!-- -->
		<link
			href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i"
			rel="stylesheet"
		/>
		<!--<![endif]-->
		<!--[if gte mso 9]>
			<xml>
				<o:OfficeDocumentSettings>
					<o:AllowPNG></o:AllowPNG>
					<o:PixelsPerInch>96</o:PixelsPerInch>
				</o:OfficeDocumentSettings>
			</xml>
		<![endif]-->
		<style type="text/css">
			.rollover:hover .rollover-first {
				max-height: 0px !important;
				display: none !important;
			}
			.rollover:hover .rollover-second {
				max-height: none !important;
				display: inline-block !important;
			}
			.rollover div {
				font-size: 0px;
			}
			u ~ div img + div > div {
				display: none;
			}
			#outlook a {
				padding: 0;
			}
			span.MsoHyperlink,
			span.MsoHyperlinkFollowed {
				color: inherit;
				mso-style-priority: 99;
			}
			a.es-button {
				mso-style-priority: 100 !important;
				text-decoration: none !important;
			}
			a[x-apple-data-detectors] {
				color: inherit !important;
				text-decoration: none !important;
				font-size: inherit !important;
				font-family: inherit !important;
				font-weight: inherit !important;
				line-height: inherit !important;
			}
			.es-desk-hidden {
				display: none;
				float: left;
				overflow: hidden;
				width: 0;
				max-height: 0;
				line-height: 0;
				mso-hide: all;
			}
			.es-button-border:hover > a.es-button {
				color: #ffffff !important;
			}
			.es-button {
				transition: all 100ms ease-in;
			}
			.es-button:hover {
				background: #555555 !important;
				border-color: #555555 !important;
			}
			td .es-button-border:hover a.es-button-2921 {
				color: rgb(38, 164, 211) !important;
			}
			@media only screen and (max-width: 600px) {
				*[class="gmail-fix"] {
					display: none !important;
				}
				p,
				a {
					line-height: 150% !important;
				}
				h1,
				h1 a {
					line-height: 120% !important;
				}
				h2,
				h2 a {
					line-height: 120% !important;
				}
				h3,
				h3 a {
					line-height: 120% !important;
				}
				h4,
				h4 a {
					line-height: 120% !important;
				}
				h5,
				h5 a {
					line-height: 120% !important;
				}
				h6,
				h6 a {
					line-height: 120% !important;
				}
				h1 {
					font-size: 30px !important;
					text-align: center;
					line-height: 120% !important;
				}
				h2 {
					font-size: 26px !important;
					text-align: left;
					line-height: 120% !important;
				}
				h3 {
					font-size: 20px !important;
					text-align: left;
					line-height: 120% !important;
				}
				h4 {
					font-size: 24px !important;
					text-align: left;
				}
				h5 {
					font-size: 20px !important;
					text-align: left;
				}
				h6 {
					font-size: 16px !important;
					text-align: left;
				}
				.es-header-body h1 a,
				.es-content-body h1 a,
				.es-footer-body h1 a {
					font-size: 30px !important;
				}
				.es-header-body h2 a,
				.es-content-body h2 a,
				.es-footer-body h2 a {
					font-size: 26px !important;
				}
				.es-header-body h3 a,
				.es-content-body h3 a,
				.es-footer-body h3 a {
					font-size: 20px !important;
				}
				.es-header-body h4 a,
				.es-content-body h4 a,
				.es-footer-body h4 a {
					font-size: 24px !important;
				}
				.es-header-body h5 a,
				.es-content-body h5 a,
				.es-footer-body h5 a {
					font-size: 20px !important;
				}
				.es-header-body h6 a,
				.es-content-body h6 a,
				.es-footer-body h6 a {
					font-size: 16px !important;
				}
				.es-menu td a {
					font-size: 16px !important;
				}
				.es-header-body p,
				.es-header-body a {
					font-size: 16px !important;
				}
				.es-content-body p,
				.es-content-body a {
					font-size: 14px !important;
				}
				.es-footer-body p,
				.es-footer-body a {
					font-size: 17px !important;
				}
				.es-infoblock p,
				.es-infoblock a {
					font-size: 12px !important;
				}
				.es-m-txt-c,
				.es-m-txt-c h1,
				.es-m-txt-c h2,
				.es-m-txt-c h3,
				.es-m-txt-c h4,
				.es-m-txt-c h5,
				.es-m-txt-c h6 {
					text-align: center !important;
				}
				.es-m-txt-r,
				.es-m-txt-r h1,
				.es-m-txt-r h2,
				.es-m-txt-r h3,
				.es-m-txt-r h4,
				.es-m-txt-r h5,
				.es-m-txt-r h6 {
					text-align: right !important;
				}
				.es-m-txt-j,
				.es-m-txt-j h1,
				.es-m-txt-j h2,
				.es-m-txt-j h3,
				.es-m-txt-j h4,
				.es-m-txt-j h5,
				.es-m-txt-j h6 {
					text-align: justify !important;
				}
				.es-m-txt-l,
				.es-m-txt-l h1,
				.es-m-txt-l h2,
				.es-m-txt-l h3,
				.es-m-txt-l h4,
				.es-m-txt-l h5,
				.es-m-txt-l h6 {
					text-align: left !important;
				}
				.es-m-txt-r img,
				.es-m-txt-c img,
				.es-m-txt-l img {
					display: inline !important;
				}
				.es-m-txt-r .rollover:hover .rollover-second,
				.es-m-txt-c .rollover:hover .rollover-second,
				.es-m-txt-l .rollover:hover .rollover-second {
					display: inline !important;
				}
				.es-m-txt-r .rollover div,
				.es-m-txt-c .rollover div,
				.es-m-txt-l .rollover div {
					line-height: 0 !important;
					font-size: 0 !important;
				}
				.es-spacer {
					display: inline-table;
				}
				a.es-button,
				button.es-button {
					font-size: 14px !important;
				}
				a.es-button,
				button.es-button {
					display: inline-block !important;
				}
				.es-button-border {
					display: inline-block !important;
				}
				.es-m-fw,
				.es-m-fw.es-fw,
				.es-m-fw .es-button {
					display: block !important;
				}
				.es-m-il,
				.es-m-il .es-button,
				.es-social,
				.es-social td,
				.es-menu {
					display: inline-block !important;
				}
				.es-adaptive table,
				.es-left,
				.es-right {
					width: 100% !important;
				}
				.es-content table,
				.es-header table,
				.es-footer table,
				.es-content,
				.es-footer,
				.es-header {
					width: 100% !important;
					max-width: 600px !important;
				}
				.adapt-img {
					width: 100% !important;
					height: auto !important;
				}
				.es-mobile-hidden,
				.es-hidden {
					display: none !important;
				}
				.es-desk-hidden {
					width: auto !important;
					overflow: visible !important;
					float: none !important;
					max-height: inherit !important;
					line-height: inherit !important;
				}
				tr.es-desk-hidden {
					display: table-row !important;
				}
				table.es-desk-hidden {
					display: table !important;
				}
				td.es-desk-menu-hidden {
					display: table-cell !important;
				}
				.es-menu td {
					width: 1% !important;
				}
				table.es-table-not-adapt,
				.esd-block-html table {
					width: auto !important;
				}
				.es-social td {
					padding-bottom: 10px;
				}
				.h-auto {
					height: auto !important;
				}
				p,
				ul li,
				ol li,
				a {
					font-size: 17px !important;
				}
				h1 a {
					text-align: center;
				}
				h2 a {
					text-align: left;
				}
				h3 a {
					text-align: left;
				}
			}
		</style>
	</head>
	<body style="width: 100%; height: 100%; padding: 0; margin: 0">
		<div class="es-wrapper-color" style="background-color: #f1f1f1">
			<!--[if gte mso 9]>
				<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
					<v:fill type="tile" color="#f1f1f1"></v:fill>
				</v:background>
			<![endif]-->
			<table
				class="es-wrapper"
				width="100%"
				cellspacing="0"
				cellpadding="0"
				style="
					mso-table-lspace: 0pt;
					mso-table-rspace: 0pt;
					border-collapse: collapse;
					border-spacing: 0px;
					padding: 0;
					margin: 0;
					width: 100%;
					height: 100%;
					background-repeat: repeat;
					background-position: center top;
					background-color: #f1f1f1;
				"
			>
				<tr>
					<td valign="top" style="padding: 0; margin: 0">
						<table
							cellpadding="0"
							cellspacing="0"
							class="es-header"
							align="center"
							style="
								mso-table-lspace: 0pt;
								mso-table-rspace: 0pt;
								border-collapse: collapse;
								border-spacing: 0px;
								width: 100%;
								table-layout: fixed !important;
								background-color: transparent;
								background-repeat: repeat;
								background-position: center top;
							"
						>
							<tr>
								<td align="center" style="padding: 0; margin: 0">
									<table
										class="es-header-body"
										style="
											mso-table-lspace: 0pt;
											mso-table-rspace: 0pt;
											border-collapse: collapse;
											border-spacing: 0px;
											background-color: #ffffff;
											width: 600px;
										"
										cellspacing="0"
										cellpadding="0"
										bgcolor="#ffffff"
										align="center"
									>
										<tr>
											<td
												style="
													margin: 0;
													padding-top: 30px;
													padding-right: 40px;
													padding-bottom: 30px;
													padding-left: 40px;
													background-color: #333333;
												"
												bgcolor="#333333"
												align="left"
											>
												<table
													width="100%"
													cellspacing="0"
													cellpadding="0"
													style="
														mso-table-lspace: 0pt;
														mso-table-rspace: 0pt;
														border-collapse: collapse;
														border-spacing: 0px;
													"
												>
													<tr>
														<td
															valign="top"
															align="center"
															style="padding: 0; margin: 0; width: 520px"
														>
															<table
																width="100%"
																cellspacing="0"
																cellpadding="0"
																role="presentation"
																style="
																	mso-table-lspace: 0pt;
																	mso-table-rspace: 0pt;
																	border-collapse: collapse;
																	border-spacing: 0px;
																"
															>
																<tr>
																	<td
																		align="center"
																		style="padding: 0; margin: 0; font-size: 0"
																	>
																		<a
																			href="https://viewstripo.email/"
																			target="_blank"
																			style="
																				mso-line-height-rule: exactly;
																				text-decoration: underline;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				font-size: 14px;
																				color: #ffffff;
																			"
																			><img
																				src="cid:logo"
																				alt=""
																				style="
																					display: block;
																					font-size: 14px;
																					border: 0;
																					outline: none;
																					text-decoration: none;
																				"
																				width="100%"
																		/></a>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<table
							class="es-content"
							cellspacing="0"
							cellpadding="0"
							align="center"
							style="
								mso-table-lspace: 0pt;
								mso-table-rspace: 0pt;
								border-collapse: collapse;
								border-spacing: 0px;
								width: 100%;
								table-layout: fixed !important;
							"
						>
							<tr>
								<td align="center" style="padding: 0; margin: 0">
									<table
										class="es-content-body"
										style="
											mso-table-lspace: 0pt;
											mso-table-rspace: 0pt;
											border-collapse: collapse;
											border-spacing: 0px;
											background-color: #333333;
											width: 600px;
										"
										cellspacing="0"
										cellpadding="0"
										bgcolor="#333333"
										align="center"
									>
										<tr>
											<td
												style="
													margin: 0;
													padding-right: 40px;
													padding-left: 40px;
													padding-top: 40px;
													padding-bottom: 40px;
													background-image: url('https://qxwocb.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png');
													background-repeat: no-repeat;
												"
												align="left"
												background="https://qxwocb.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/93491522393929597.png"
											>
												<table
													width="100%"
													cellspacing="0"
													cellpadding="0"
													style="
														mso-table-lspace: 0pt;
														mso-table-rspace: 0pt;
														border-collapse: collapse;
														border-spacing: 0px;
													"
												>
													<tr>
														<td
															valign="top"
															align="center"
															style="padding: 0; margin: 0; width: 520px"
														>
															<table
																width="100%"
																cellspacing="0"
																cellpadding="0"
																role="presentation"
																style="
																	mso-table-lspace: 0pt;
																	mso-table-rspace: 0pt;
																	border-collapse: collapse;
																	border-spacing: 0px;
																"
															>
																<tr>
																	<td
																		align="center"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-top: 40px;
																			padding-bottom: 10px;
																		"
																	>
																		<h1
																			style="
																				margin: 0;
																				font-family: lato, 'helvetica neue',
																					helvetica, arial, sans-serif;
																				mso-line-height-rule: exactly;
																				letter-spacing: 0;
																				font-size: 30px;
																				font-style: normal;
																				font-weight: bold;
																				line-height: 36px;
																				color: #ffffff;
																			"
																		>
																			Welcome ${userMain.name}
																		</h1>
																	</td>
																</tr>
																<tr>
																	<td
																		esdev-links-color="#757575"
																		align="center"
																		style="
																			margin: 0;
																			padding-top: 10px;
																			padding-right: 30px;
																			padding-bottom: 20px;
																			padding-left: 30px;
																		"
																	>
																		<p
																			style="
																				margin: 0;
																				mso-line-height-rule: exactly;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				line-height: 23px;
																				letter-spacing: 0;
																				color: #757575;
																				font-size: 15px;
																			"
																		>
																			Lorem ipsum dolor sit amet, consectetur
																			adipisicing elit, sed do eiusmod tempor
																			incididunt ut labore.
																		</p>
																	</td>
																</tr>
																<tr>
																	<td
																		align="center"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-top: 10px;
																			padding-bottom: 20px;
																		"
																	>
																		<span
																			class="es-button-border"
																			style="
																				border-style: solid;
																				border-color: #26a4d3;
																				background: none 0% 0% repeat scroll
																					#26a4d3;
																				border-width: 0px;
																				display: inline-block;
																				border-radius: 50px;
																				width: auto;
																			"
																			><a
																				href="https://transcript.dtkapp.com.ng/"
																				class="es-button"
																				target="_blank"
																				style="
																					mso-style-priority: 100 !important;
																					text-decoration: none !important;
																					transition: all 100ms ease-in;
																					mso-line-height-rule: exactly;
																					font-family: arial, 'helvetica neue',
																						helvetica, sans-serif;
																					font-size: 14px;
																					color: #ffffff;
																					padding: 10px 20px 10px 20px;
																					display: inline-block;
																					background: #26a4d3;
																					border-radius: 50px;
																					font-weight: bold;
																					font-style: normal;
																					line-height: 17px !important;
																					width: auto;
																					text-align: center;
																					letter-spacing: 0;
																					mso-padding-alt: 0;
																					mso-border-alt: 10px solid #26a4d3;
																					border-color: #26a4d3;
																				"
																				>ACCESS ACCOUNT</a
																			></span
																		>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<table
							class="es-content"
							cellspacing="0"
							cellpadding="0"
							align="center"
							style="
								mso-table-lspace: 0pt;
								mso-table-rspace: 0pt;
								border-collapse: collapse;
								border-spacing: 0px;
								width: 100%;
								table-layout: fixed !important;
							"
						>
							<tr>
								<td align="center" style="padding: 0; margin: 0">
									<table
										class="es-content-body"
										cellspacing="0"
										cellpadding="0"
										bgcolor="#ffffff"
										align="center"
										style="
											mso-table-lspace: 0pt;
											mso-table-rspace: 0pt;
											border-collapse: collapse;
											border-spacing: 0px;
											background-color: #ffffff;
											width: 600px;
										"
									>
										<tr>
											<td
												align="left"
												style="
													padding: 0;
													margin: 0;
													padding-right: 40px;
													padding-left: 40px;
													padding-top: 40px;
												"
											>
												<table
													width="100%"
													cellspacing="0"
													cellpadding="0"
													style="
														mso-table-lspace: 0pt;
														mso-table-rspace: 0pt;
														border-collapse: collapse;
														border-spacing: 0px;
													"
												>
													<tr>
														<td
															valign="top"
															align="center"
															style="padding: 0; margin: 0; width: 520px"
														>
															<table
																width="100%"
																cellspacing="0"
																cellpadding="0"
																role="presentation"
																style="
																	mso-table-lspace: 0pt;
																	mso-table-rspace: 0pt;
																	border-collapse: collapse;
																	border-spacing: 0px;
																"
															>
																<tr>
																	<td
																		class="es-m-txt-c"
																		align="left"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-bottom: 15px;
																			padding-top: 5px;
																		"
																	>
																		<h2
																			style="
																				margin: 0;
																				font-family: lato, 'helvetica neue',
																					helvetica, arial, sans-serif;
																				mso-line-height-rule: exactly;
																				letter-spacing: 0;
																				font-size: 20px;
																				font-style: normal;
																				font-weight: bold;
																				line-height: 24px;
																				color: #333333;
																			"
																		>
																			YOUR ACCOUNT IS NOW ACTIVE
																		</h2>
																	</td>
																</tr>
																<tr>
																	<td
																		align="left"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-bottom: 10px;
																		"
																	>
																		<p
																			style="
																				margin: 0;
																				mso-line-height-rule: exactly;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				line-height: 23px;
																				letter-spacing: 0;
																				color: #555555;
																				font-size: 15px;
																			"
																		>
																			<strong
																				>Lorem ipsum dolor sit amet, consectetur
																				adipisicing elit, sed do eiusmod tempor
																				incididunt ut labore et dolore magna
																				aliqua. Ut enim ad minim veniam, quis
																				nostrud exercitation ullamco laboris
																				nisi ut aliquip ex ea commodo
																				consequat.</strong
																			>
																		</p>
																	</td>
																</tr>
																<tr>
																	<td
																		align="left"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-bottom: 10px;
																			padding-top: 10px;
																		"
																	>
																		<p
																			style="
																				margin: 0;
																				mso-line-height-rule: exactly;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				line-height: 23px;
																				letter-spacing: 0;
																				color: #555555;
																				font-size: 15px;
																			"
																		>
																			Lorem ipsum dolor sit amet, consectetur
																			adipisicing elit, sed do eiusmod tempor
																			incididunt ut labore et dolore magna
																			aliqua. Ut enim ad minim veniam, quis
																			nostrud exercitation ullamco laboris nisi
																			ut aliquip ex ea commodo consequat.<br />
																		</p>
																	</td>
																</tr>
																<tr>
																	<td
																		align="left"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-bottom: 10px;
																			padding-top: 10px;
																		"
																	>
																		<p
																			style="
																				margin: 0;
																				mso-line-height-rule: exactly;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				line-height: 23px;
																				letter-spacing: 0;
																				color: #555555;
																				font-size: 15px;
																			"
																		>
																			Yours sincerely,
																		</p>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
											</td>
										</tr>
										<tr>
											<td
												align="left"
												style="
													margin: 0;
													padding-right: 40px;
													padding-left: 40px;
													padding-bottom: 40px;
													padding-top: 10px;
												"
											>
												<!--[if mso]><table style="width:520px" cellpadding="0"
cellspacing="0"><tr><td style="width:40px" valign="top"><![endif]-->
												<table
													class="es-left"
													cellspacing="0"
													cellpadding="0"
													align="left"
													style="
														mso-table-lspace: 0pt;
														mso-table-rspace: 0pt;
														border-collapse: collapse;
														border-spacing: 0px;
														float: left;
													"
												>
													<tr>
														<td
															class="es-m-p0r es-m-p20b"
															valign="top"
															align="center"
															style="padding: 0; margin: 0; width: 40px"
														>
															<table
																width="100%"
																cellspacing="0"
																cellpadding="0"
																role="presentation"
																style="
																	mso-table-lspace: 0pt;
																	mso-table-rspace: 0pt;
																	border-collapse: collapse;
																	border-spacing: 0px;
																"
															>
																<tr>
																	<td
																		align="left"
																		style="padding: 0; margin: 0; font-size: 0"
																	>
																		<img
																			src="https://qxwocb.stripocdn.email/content/guids/CABINET_85e4431b39e3c4492fca561009cef9b5/images/29241521207598269.jpg"
																			alt=""
																			style="
																				display: block;
																				font-size: 14px;
																				border: 0;
																				outline: none;
																				text-decoration: none;
																			"
																			width="40"
																		/>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
												<!--[if mso]></td><td style="width:20px"></td><td style="width:460px" valign="top"><![endif]-->
												<table
													cellspacing="0"
													cellpadding="0"
													align="right"
													style="
														mso-table-lspace: 0pt;
														mso-table-rspace: 0pt;
														border-collapse: collapse;
														border-spacing: 0px;
													"
												>
													<tr>
														<td
															align="left"
															style="padding: 0; margin: 0; width: 460px"
														>
															<table
																width="100%"
																cellspacing="0"
																cellpadding="0"
																role="presentation"
																style="
																	mso-table-lspace: 0pt;
																	mso-table-rspace: 0pt;
																	border-collapse: collapse;
																	border-spacing: 0px;
																"
															>
																<tr>
																	<td
																		align="left"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-top: 10px;
																		"
																	>
																		<p
																			style="
																				margin: 0;
																				mso-line-height-rule: exactly;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				line-height: 21px;
																				letter-spacing: 0;
																				color: #222222;
																				font-size: 14px;
																			"
																		>
																			<strong>Anna Bella</strong><br />
																		</p>
																	</td>
																</tr>
																<tr>
																	<td
																		align="left"
																		style="padding: 0; margin: 0"
																	>
																		<p
																			style="
																				margin: 0;
																				mso-line-height-rule: exactly;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				line-height: 21px;
																				letter-spacing: 0;
																				color: #666666;
																				font-size: 14px;
																			"
																		>
																			VC | Bells University of Technology Ota
																		</p>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
												<!--[if mso]></td></tr></table><![endif]-->
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<table
							class="es-content"
							cellspacing="0"
							cellpadding="0"
							align="center"
							style="
								mso-table-lspace: 0pt;
								mso-table-rspace: 0pt;
								border-collapse: collapse;
								border-spacing: 0px;
								width: 100%;
								table-layout: fixed !important;
							"
						>
							<tr>
								<td align="center" style="padding: 0; margin: 0">
									<table
										class="es-content-body"
										style="
											mso-table-lspace: 0pt;
											mso-table-rspace: 0pt;
											border-collapse: collapse;
											border-spacing: 0px;
											background-color: #26a4d3;
											width: 600px;
										"
										cellspacing="0"
										cellpadding="0"
										bgcolor="#26a4d3"
										align="center"
									>
										<tr>
											<td
												style="
													margin: 0;
													padding-right: 40px;
													padding-left: 40px;
													padding-top: 40px;
													padding-bottom: 20px;
													background-color: #26a4d3;
												"
												bgcolor="#26a4d3"
												align="left"
											>
												<table
													width="100%"
													cellspacing="0"
													cellpadding="0"
													style="
														mso-table-lspace: 0pt;
														mso-table-rspace: 0pt;
														border-collapse: collapse;
														border-spacing: 0px;
													"
												>
													<tr>
														<td
															valign="top"
															align="center"
															style="padding: 0; margin: 0; width: 520px"
														>
															<table
																width="100%"
																cellspacing="0"
																cellpadding="0"
																role="presentation"
																style="
																	mso-table-lspace: 0pt;
																	mso-table-rspace: 0pt;
																	border-collapse: collapse;
																	border-spacing: 0px;
																"
															>
																<tr>
																	<td
																		class="es-m-txt-c"
																		align="center"
																		style="padding: 0; margin: 0"
																	>
																		<h2
																			style="
																				margin: 0;
																				font-family: lato, 'helvetica neue',
																					helvetica, arial, sans-serif;
																				mso-line-height-rule: exactly;
																				letter-spacing: 0;
																				font-size: 20px;
																				font-style: normal;
																				font-weight: bold;
																				line-height: 24px;
																				color: #ffffff;
																			"
																		>
																			SUPPORT<br />
																		</h2>
																	</td>
																</tr>
																<tr>
																	<td
																		align="center"
																		style="
																			padding: 0;
																			margin: 0;
																			padding-bottom: 10px;
																			padding-top: 5px;
																		"
																	>
																		<p
																			style="
																				margin: 0;
																				mso-line-height-rule: exactly;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				line-height: 26px;
																				letter-spacing: 0;
																				color: #aad4ea;
																				font-size: 17px;
																			"
																		>
																		If you have any questions or need assistance, please feel free to contact us at support@transcript.dtkapp.com.ng<br />
																		</p>
																	</td>
																</tr>
																<tr>
																	<td
																		align="center"
																		style="padding: 10px; margin: 0"
																	>
																		<span
																			class="es-button-border"
																			style="
																				border-style: solid;
																				border-color: #26a4d3;
																				background: #ffffff;
																				border-width: 0px;
																				display: inline-block;
																				border-radius: 50px;
																				width: auto;
																			"
																			><a
																				href="mailto:support@transcript.dtkapp.com.ng"
																				class="es-button es-button-2921"
																				target="_blank"
																				style="
																					mso-style-priority: 100 !important;
																					text-decoration: none !important;
																					transition: all 100ms ease-in;
																					mso-line-height-rule: exactly;
																					font-family: arial, 'helvetica neue',
																						helvetica, sans-serif;
																					font-size: 14px;
																					color: #26a4d3;
																					padding: 15px 25px;
																					display: inline-block;
																					background: #ffffff;
																					border-radius: 50px;
																					font-weight: bold;
																					font-style: normal;
																					line-height: 17px !important;
																					width: auto;
																					text-align: center;
																					letter-spacing: 0;
																					mso-padding-alt: 0;
																					mso-border-alt: 10px solid #26a4d3;
																					border-color: #ffffff;
																				"
																				>CONTACT SUPPPORT</a
																			></span
																		>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<table
							class="es-content"
							cellspacing="0"
							cellpadding="0"
							align="center"
							style="
								mso-table-lspace: 0pt;
								mso-table-rspace: 0pt;
								border-collapse: collapse;
								border-spacing: 0px;
								width: 100%;
								table-layout: fixed !important;
							"
						>
							<tr>
								<td align="center" style="padding: 0; margin: 0">
									<table
										class="es-content-body"
										style="
											mso-table-lspace: 0pt;
											mso-table-rspace: 0pt;
											border-collapse: collapse;
											border-spacing: 0px;
											background-color: transparent;
											width: 600px;
										"
										cellspacing="0"
										cellpadding="0"
										align="center"
									>
										<tr>
											<td
												align="left"
												style="
													margin: 0;
													padding-top: 30px;
													padding-bottom: 30px;
													padding-right: 20px;
													padding-left: 20px;
												"
											>
												<table
													width="100%"
													cellspacing="0"
													cellpadding="0"
													style="
														mso-table-lspace: 0pt;
														mso-table-rspace: 0pt;
														border-collapse: collapse;
														border-spacing: 0px;
													"
												>
													<tr>
														<td
															valign="top"
															align="center"
															style="padding: 0; margin: 0; width: 560px"
														>
															<table
																width="100%"
																cellspacing="0"
																cellpadding="0"
																role="presentation"
																style="
																	mso-table-lspace: 0pt;
																	mso-table-rspace: 0pt;
																	border-collapse: collapse;
																	border-spacing: 0px;
																"
															>
																<tr>
																	<td
																		class="es-infoblock made_with"
																		align="center"
																		style="padding: 0; margin: 0; font-size: 0"
																	>
																		<a
																			target="_blank"
																			href="https://transcript.dtkapp.com"
																			style="
																				mso-line-height-rule: exactly;
																				text-decoration: underline;
																				font-family: helvetica, 'helvetica neue',
																					arial, verdana, sans-serif;
																				font-size: 12px;
																				color: #cccccc;
																			"
																			><img
																				src="cid:logo"
																				alt=""
																				width="125"
																				style="
																					display: block;
																					font-size: 14px;
																					border: 0;
																					outline: none;
																					text-decoration: none;
																				"
																		/></a>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>`, `Good day ${userMain.name},\nYou have succesfully reqistered to the Transcript request app and can log in at https://transcript.dtkapp.com.ng\nIf you have any questions or need assistance, please feel free to contact us at support@transcript.dtkapp.com.ng.\nSincerely,\nSupport\nBells University of Technology Ota`, {
        filename: "logo.png",
        path: __dirname + "/public/images/logo.png",
        cid: "logo",
    });
});
exports.createUser = createUser;
/**
 * Create a new local account.
 * @route POST /signup
 */
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield express_validator_1.check("email", "Email is not valid").isEmail().run(req);
        yield express_validator_1.check("password", "Password must be at least 4 characters long")
            .isLength({ min: 4 })
            .run(req);
        // await check("confirmPassword", "Passwords do not match")
        // 	.equals(req.body.password)
        // 	.run(req);
        yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        exports.createUser(req.body);
    }
    catch (error) {
        console.error("Unable to create User record : ", error);
        return res.status(500).json({ error });
    }
    return res.status(201).json({ message: "User registered successfully." });
});
exports.postSignup = postSignup;
function updateUser(userId, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find the user by their userId
        const user = yield user_model_1.User.findOne({ where: { id: userId } });
        if (!user) {
            console.log("User not found.");
            throw new Error("User not found");
        }
        // Update user attributes
        if (userData.password) {
            // If a new password is provided, hash it and update the user's password
            const salt = bcrypt_nodejs_1.default.genSaltSync(10);
            const hashedPassword = bcrypt_nodejs_1.default.hashSync(userData.password, salt);
            user.password = hashedPassword;
        }
        // Update other user attributes
        user.email = userData.email || user.email;
        user.name = userData.name || user.name;
        user.department = userData.department || user.department;
        user.college = userData.college || user.college;
        // Add more attributes as needed
        yield user.save();
        // Update user roles
        if (userData.roles) {
            const newRoles = userData.roles;
            const currentRoles = yield user.getRoles();
            // Remove roles that are not in the new roles array
            for (const currentRole of currentRoles) {
                if (!newRoles.includes(currentRole.name)) {
                    yield user.removeRole(currentRole);
                }
            }
            // Add new roles
            for (const role of newRoles) {
                const defaultRole = yield role_model_1.Role.findOne({ where: { name: role } });
                if (defaultRole) {
                    const hasRole = currentRoles.some((currentRole) => currentRole.name === role);
                    if (!hasRole) {
                        yield user.addRole(defaultRole);
                    }
                }
            }
        }
    });
}
/**
 * Update profile information.
 * @route PATCH /update-user/:id
 */
const UpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Please enter a valid email address.").isEmail().run(req);
    yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        // Return validation errors as JSON
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        updateUser(req.params.id, req.body);
        return res
            .status(200)
            .json({ message: "Profile information has been updated." });
    }
    catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            // Handle the case where the email is already associated with another account
            return res.status(409).json({
                error: "The email address is already associated with an account.",
            });
        }
        next(error);
    }
});
exports.UpdateUser = UpdateUser;
/**
 * Delete user account.
 * @route DELETE /delete-user/:ID
 */
const postDeleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Assuming you have a user object in the request with an 'id' property
        const user = yield user_model_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        yield user.destroy();
        // If you're using Passport.js for authentication, you can log the user out
        req.logout();
        return res.status(200).json({ message: "Your account has been deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.postDeleteUser = postDeleteUser;
/**
 * Process the reset password request.
 * @route POST /reset/:token
 */
const postReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("password", "Password must be at least 4 characters long.")
        .isLength({ min: 4 })
        .run(req);
    yield express_validator_1.check("confirm", "Passwords must match.")
        .equals(req.body.password)
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    async_1.default.waterfall([
        function resetPassword(done) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { token } = req.params;
                    const user = yield user_model_1.User.findOne({
                        where: {
                            passwordResetToken: token,
                            passwordResetExpires: {
                                [sequelize_1.Op.gt]: new Date(), // Check if the reset token has not expired
                            },
                        },
                    });
                    if (!user) {
                        return res.status(401).json({
                            message: "Password reset token is invalid or has expired.",
                        });
                    }
                    // Update the user's password and reset token
                    user.password = req.body.password;
                    user.passwordResetToken = null; // Assuming your column allows null values
                    user.passwordResetExpires = null; // Assuming your column allows null values
                    yield user.save();
                    // You can log the user in here if needed
                    // req.logIn(user, (err) => {
                    //   if (err) {
                    //     return next(err);
                    //   }
                    //   res.json({ message: 'Password reset successful.' });
                    // });
                    done(undefined, user);
                }
                catch (error) {
                    return next(error);
                }
            });
        },
        function sendResetPasswordEmail(user, done) {
            const transporter = nodemailer_1.default.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
            const mailOptions = {
                to: user.email,
                from: "express-ts@starter.com",
                subject: "Your password has been changed",
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
            };
            transporter.sendMail(mailOptions, (err) => {
                done(err);
            });
        },
    ], (err) => {
        if (err) {
            return next(err);
        }
    });
    return res
        .status(200)
        .json({ message: "Password reset email sent successfully." });
});
exports.postReset = postReset;
/**
 * Create a random token, then the send user an email with a reset link.
 * @route POST /forgot
 */
const postForgot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Please enter a valid email address.").isEmail().run(req);
    yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    async_1.default.waterfall([
        function createRandomToken(done) {
            crypto_1.default.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function setRandomToken(token, done) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { email } = req.body;
                    const user = yield user_model_1.User.findOne({ where: { email } });
                    if (!user) {
                        return res.status(404).json({
                            message: "Account with that email address does not exist.",
                        });
                    }
                    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now
                    user.passwordResetToken = token;
                    user.passwordResetExpires = resetExpires;
                    yield user.save();
                    done(null, token, user);
                }
                catch (error) {
                    done(error);
                }
            });
        },
        function sendForgotPasswordEmail(token, user, done) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield sendMail_1.default([user.email], "", "Reset your password on Exiat", `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
					Please click on the following link, or paste this into your browser to complete the process:\n\n
					http://${req.headers.host}/reset/${token}\n\n
					If you did not request this, please ignore this email and your password will remain unchanged.\n`, {
                        filename: "logo.png",
                        path: __dirname + "/images/logo.png",
                        cid: "logo",
                    });
                    done(undefined);
                }
                catch (err) {
                    done(err);
                }
            });
        },
    ], (err) => {
        if (err) {
            return next(err);
        }
    });
    return res
        .status(200)
        .json({ message: "An e-mail has been sent with further instructions." });
});
exports.postForgot = postForgot;
//# sourceMappingURL=user.controller.js.map