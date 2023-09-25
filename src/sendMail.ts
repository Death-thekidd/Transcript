import nodemailer from "nodemailer";
import { SENDER_EMAIL, SENDER_PASS } from "./util/secrets";

const createTransporter = async () => {
	const transporter = nodemailer.createTransport({
		host: "mail.dtkapp.com.ng",
		port: 465,
		secure: true,
		auth: {
			user: SENDER_EMAIL,
			pass: SENDER_PASS,
		},
	});

	return transporter;
};

async function sendMail(
	to: string[],
	subject: string,
	html: string,
	text: string,
	attachment: any
): Promise<void> {
	const mailOptions = {
		from: SENDER_EMAIL, // sender address
		to: to, // list of receivers
		subject: subject, // Subject line
		html: html, // plain text body
		text: text,
		attachments: [attachment],
	};

	console.log(mailOptions);

	try {
		// Get response from the createTransport
		const emailTransporter = await createTransporter();

		// Send email
		await new Promise((resolve, reject) => {
			emailTransporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					// failed block
					console.log(error);
					reject(error);
				} else {
					// Success block
					console.log("Email sent: " + info.response);
					resolve(info);
				}
			});
		});
	} catch (error) {
		return console.log(error);
	}
}

export default sendMail;
