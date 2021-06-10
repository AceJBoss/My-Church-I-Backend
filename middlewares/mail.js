require('dotenv').config();
const template = require('./email_template/');
const callbacks = require('../function/index.js');
const secret = process.env.SECRET;

const sgMail = require('@sendgrid/mail');
// set api key
sgMail.setApiKey(process.env.MAIL_ENCRYPTION);


/**
* mail class
*/
class Mailer{

	/**
	* forgot password mail
	*/
	static async resetPasswordMail(email, fullname, newPassword){
		let currentYear = await callbacks.currentYear();
		fullname = await callbacks.transform(fullname);

		// send mail
		const msg = {
			to: email,
			from: process.env.MAIL_USERNAME,
			subject: 'Password Reset',
			html: template.forgotPassword(fullname, newPassword, currentYear)
		}

		return sgMail.send(msg);
	}
}

module.exports = Mailer;