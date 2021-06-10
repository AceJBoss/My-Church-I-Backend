/**
|----------------------------------------------
| Login Controller
|----------------------------------------------
| Holds all of the
| user login.
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const jwt = require('jsonwebtoken');
const Country = require('../database/models/').Country;
const State = require('../database/models/').State;
const LgaData = require('../database/models/').Lga;
const UserType = require('../database/models/').UserType;
const User = require('../database/models/').User;
const formvalidator = require('../middlewares/formvalidator');
const Sequelize = require('sequelize');
const request = require('request');
var {sendSms, smsBalance} = require('@kidikudazi/smart-sms')(request);
var {createVirtualAccount} = require('../middlewares/flutterwave')();
require('dotenv').config();
var secret = process.env.SECRET;

class RegisterController{
	/**
	* User Registration
	*/
	static async registerUser(req, res){
		try{
			let {title,first_name, last_name, email,phone,gender,marital_status,dob,year,password} = req.body;

			// validate entry
		    let rules = {
		    	first_name:'required',
		    	last_name:'required',
		    	email:'required|email',
		    	phone:'required',
		    	password:'required'
		    }

		    let validator = formvalidator(req, rules);
			
			if(validator){
				return res.status(203).json({
					error:true,
					message:validator
				});
			}
			password = password.replace(/\s/g,'');

			// validate email
			let validateEmail = await callbacks.multiple(User, {email:email});

			if(validateEmail.length > 0){
				return res.status(200).json({
					error:true,
					message:'Email already exist.'
				});
			}

			// validate phone
			let validatePhone = await callbacks.multiple(User, {phone:phone});

			if(validatePhone.length > 0){
				return res.status(200).json({
					error:true,
					message:'Phone number already exist.'
				});
			}

			if(referral_code != undefined){

				// validate of referral code exist
				var validateRefCode = await callbacks.multiple(User, {ref_code:referral_code});

				if(validateRefCode.length < 1){
					return res.status(200).json({
						error:true,
						message:'Invalid referral code supplied.'
					});
				}
			}

			let userType = await callbacks.multiple(UserType, {user_type:'user'});

			// create student registrtion
			let createUser = {
				first_name:first_name,
				last_name:last_name,
				email:email,
				phone:phone,
				user_otp:otp,
				ref_code:ref_code,
				password:bcrypt.hashSync(password, 10),
				user_type_id:userType[0].dataValues.id
			}

			// create
			User.create(createUser)
				.then(async (saved)=>{
					if(saved){

							return res.status(201).json({
								error:false,
								message:"Registration successful. A 5 digit OTP has been sent to your phone. OTP"+otp
							});
						}else{
							return res.status(203).json({
								error:true,
								message:"Failed to register. Kindly try again later."
							});
						}
					})
					.catch(err=>{
						return res.status(200).json({
							error:true,
							message:"Failed to register. Kindly try again later."
						});
					});

		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* resend otp
	*/
	static async resendOTP(req, res){
		try{
			// collect data
			let {phone} = req.body;

			// validate entry
		    let rules = {
		    	'phone':'required'
		    };

		    let validator = formvalidator(req, rules);
			
			if(validator){
				return res.status(203).json({
					error:true,
					message:validator
				});
			}

			// check for otp
			let validateUser = await callbacks.multiple(User, {phone:phone});

			if(validateUser.length < 1){
				return res.status(200).json({
					error:true,
					message:"Invalid phone number supplied."
				});
			}
			// generate otp
			let otp = await callbacks.randomNum(5);

			// send otp to user phone
			var smsOptions = {
	            username: process.env.SMART_SMS_USERNAME,
	            password: process.env.SMART_SMS_PASSWORD,
	            message: `Here is your OTP:${otp}. With love from Viscio Express Logisitics`,
	            sender: 'Viscio',
	            recipient: phone
	        }
	       
			// call the send sms instance
			sendSms(smsOptions, (err, sentRes)=>{
				if(err){
					return res.status(200).json({
						error:true,
						message:"Failed to send OTP. Try again later."
					});
	            }else{
	            	console.log('Sent OTP Response ===>', sentRes);

					// update otp
					User.create({user_otp:otp},{
						where:{
							id:validateUser[0].dataValues.id
						}
					})
					.then(async (updated)=>{
						if(updated){

							return res.status(200).json({
								error:false,
								message:"A 5 digit OTP has been sent to your phone. OTP"+otp
							});
						}else{
							return res.status(203).json({
								error:true,
								message:"Failed to send OTP. Kindly try again later."
							});
						}
					})
					.catch(err=>{
						return res.status(200).json({
							error:true,
							message:err.message
						});
					});
	            }
	        });

		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* verify otp
	*/
	static async verifyUserOTP(req, res){
		try{
			// collect data
			let {phone, otp} = req.body;

			// validate entry
		    let rules = {
		    	'phone':'required',
		    	'otp':'required'
		    };

		    let validator = formvalidator(req, rules);
			
			if(validator){
				return res.status(203).json({
					error:true,
					message:validator
				});
			}

			// check for otp
			let validateUserOTP = await callbacks.multiple(User, {phone:phone, user_otp:otp});

			if(validateUserOTP.length < 1){
				return res.status(200).json({
					error:true,
					message:"Invalid otp supplied."
				});
			}

			let payload = {
				firstname:validateUserOTP[0].dataValues.first_name,
				lastname:validateUserOTP[0].dataValues.last_name,
				email: validateUserOTP[0].dataValues.email,
				is_permanent: false,
				frequency:5000,
				narration:'Make transfer to '+validateUserOTP[0].dataValues.first_name+' '+validateUserOTP[0].dataValues.last_name
			};

			// process virtual cards
			let virtualAcct= await createVirtualAccount(payload);
			if(virtualAcct.status != 'success'){
				return res.status(203).json({
					error:true,
					message:"Failed to verify OTP. Try again later."
				});
			}

			if(virtualAcct.status == 'success'){
				var virtualObj = {
					user_id:validateUserOTP[0].dataValues.id,
					account_name:validateUserOTP[0].dataValues.first_name+' '+validateUserOTP[0].dataValues.last_name,
					bank_name:virtualAcct.data.bankname,
					order_ref:virtualAcct.data.orderRef,
					account_no:virtualAcct.data.accountnumber,
					narration:'Make transfer to '+validateUserOTP[0].dataValues.first_name+' '+validateUserOTP[0].dataValues.last_name
				}
			}

			// update user status
			let updateStatus = {
				user_otp:null,
				status:'Active'
			}

			User.update(updateStatus, {
				where:{
					id:validateUserOTP[0].dataValues.id
				}
			})
			.then(async (updated)=>{
				if(updated){
					// create virtual account
					await VirtualAccount.create(virtualObj);

					return res.status(200).json({
						error:false,
						message:"OTP verified successfully. Account activated."
					});
				}else{
					return res.status(200).json({
						error:true,
						message:"Failed to validate OTP."
					});
				}
			})
			.catch(err=>{
				return res.status(200).json({
					error:true,
					message:err.message
				});
			});

		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}
}

module.exports = RegisterController;