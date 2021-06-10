/**
|----------------------------------------------
| Organization Controller
|----------------------------------------------
| Holds all of the
| organization process flow.
|----------------------------------------------
*/

const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const jwt = require('jsonwebtoken');
const User = require('../database/models/').User;
const Driver = require('../database/models/').Driver;
const DriverLicense = require('../database/models/').DriverLicense;
const UserWallet = require('../database/models/').UserWallet;
const VirtualAccount = require('../database/models/').VirtualAccount;
const Country = require('../database/models/').Country;
const State = require('../database/models/').State;
const LgaData = require('../database/models/').Lga;
const Organization = require('../database/models/').Organization;
const DeliveryMode = require('../database/models/').DeliveryMode;
const formvalidator = require('../middlewares/formvalidator');
const {cloudinary} = require('../middlewares/cloudinary');
const request = require('request');
var {sendSms, smsBalance} = require('@kidikudazi/smart-sms')(request);
var {createVirtualAccount} = require('../middlewares/flutterwave')();
const Sequelize = require('sequelize');

require('dotenv').config();
var secret = process.env.SECRET;

class OrganizationController{
	/**
	* register new organization
	*/
	static async registerOrganization(req, res){
		try{
			// collect data
			var organization_name = req.body.organization_name;
			var email = req.body.email;
			var phone = req.body.phone;
			var password = req.body.password;
			var address = req.body.address;

			// validate entry
		    let rules = {
		    	organization_name:'required',
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

			// generate otp
			let ref_code = await callbacks.randomStr(organization_name.toUpperCase().length < 6?6:8);
			let otp = await callbacks.randomNum(5);
			let userType = await callbacks.multiple(UserType, {user_type:'organization'});

			// create organzation registration
			let createUser = {
				first_name:organization_name,
				last_name:'',
				email:email,
				phone:phone,
				user_otp:otp,
				ref_code:ref_code+''+Math.floor(Date.now() / 1000),
				password:bcrypt.hashSync(password, 10),
				user_type_id:userType[0].dataValues.id
			}
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
						message:"Failed to send OTP and register user. Try again later."
					});
	            }else{
	            	console.log('sent sms response==>', sentRes);

					// create
					User.create(createUser)
					.then(async (saved)=>{
						if(saved){
							// create user wallet
							await UserWallet.create({
								user_id:saved.id,
								balance:0.00
							});

							await Organization.create({
								user_id:saved.id,
								address:address
							});

							return res.status(201).json({
								error:false,
								message:"Registration successful. A 5 digit OTP has been sent to your phone. OTP"+otp
							});
						}else{
							return res.status(201).json({
								error:false,
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
	            }
	        });

		}catch(e){
			return res.status(203).json({
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
			console.log('virtual Account Response===>', virtualAcct);

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
			return res.status(500).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* organization register driver
	*/
	static async organizationRegisterDriver(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'organization'){
				// collect data
				let {firstname, lastname, email, phone, password, wake_point_lat, wake_point_lng, dob} = req.body;

				// validate data
				let rules = {
					firstname:'required',
					lastname:'required',
					email:'required|email',
					phone:'required',
					password:'required',
					wake_point_lat:'required',
					wake_point_lng:'required',
					dob:'required'
				};

				let validator = formvalidator(req, rules);
			
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate organization 
				let organization_id = req.decoded.user.id;

				let checkOrganizationId =  await callbacks.multiple(Organization, {id:organization_id});

				if(checkOrganizationId.length < 1){
					return res.status(203).json({
						error:true,
						message:"Invalid organization selected."
					});
				}

				// create user account
				let ref_code = await callbacks.randomStr(organization_name.toUpperCase().length < 6?6:8);
				let userType = await callbacks.multiple(UserType, {user_type:'driver'});
				let createUser = {
					first_name:firstname,
					last_name:lastname,
					email:email,
					phone:phone,
					ref_code:ref_code+''+Math.floor(Date.now() / 1000),
					password:bcrypt.hashSync(password, 10),
					user_type_id:userType[0].dataValues.id,
					status:'Active'
				}

				User.create(createUser).then(async saved=>{
					if(saved){
						// create driver account
						let createDriver = {
							user_id:saved.id,
							organization_id:organization_id,
							wake_point_lat:wake_point_lat,
							wake_point_lng:wake_point_lng,
							dob:dob
						}

						await Driver.create(createDriver);

						return res.status(201).json({
							error:false,
							message:"Driver registered successfully."
						});

					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to register driver."
						});
					}
				}).catch(err=>{
					return res.status(203).json({error:true, message:err.message});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(500).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* fetch all attched drivers
	*/
	static async organzationDrivers(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'organization'){
				// fetch record

				Driver.findAll({
					include:[
						{
							model:User
						}
					],
					where:{
						organization_id:req.decoded.user.id
					}
				})
				.then(record=>{
					driverArr = [];

					record.forEach((item)=>{
						driverArr.push(item);
					});

					return res.status(200).json(driverArr);
				})
				.catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				})
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* attach the driver license to 
	* each driver in the organization
	*/
	static async registerDriverLicense(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'organization'){
				// collect data
				let {delivery_mode, vehicle_brand, vehicle_number, vehicle_year} = req.body;

				// validate entry
			    let rules = {
			    	delivery_mode:'required',
			    	vehicle_brand:'required',
			    	vehicle_number:'required',
			    	vehicle_year:'required'
			    }

			    let validator = formvalidator(req, rules);
				
				if(validator){
					await cloudinary.uploader.destroy(req.file.public_id);
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				let license_image = req.file.secure_url;
				let license_key = req.file.public_id;

				// validate delivery models
				let validateDeliveryMode = await callbacks.multiple(DeliveryMode, {id:delivery_mode});

				if(validateDeliveryMode.length < 1){
					return res.status(203).json({
						error:true,
						message:'Vehicle type not found.'
					});
				}

				// check if user has already uploaded driver license
				let checkLicenseUpload =  await callbacks.multiple(DriverLicense, {driver_id:req.params.driver_id});

				if(checkLicenseUpload.length > 0){
					return res.status(203).json({
						error:true,
						message:'Failed! Driver license already uploaded.'
					});
				}

				// upload driver license
				let licenseObj = {
					driver_id:req.params.driver_id,
					license_image:license_image,
					license_key:license_key,
					delivery_mode_id:delivery_mode,
					vehicle_brand:vehicle_brand,
					vehicle_number:vehicle_number,
					vehicle_year:vehicle_year
				}

				DriverLicense.create(licenseObj)
				.then(async saved=>{
					if(saved){
						await Driver.update({
							license_uploaded:'1'
						}, {
							where:{
								id:req.params.driver_id
							}
						});

						return res.status(201).json({
							error:false,
							message:'License uploaded successfully.'
						});

					}else{
						return res.status(203).json({
							error:true,
							message:'Failed to upload driver license.'
						});
					}
				})
				.catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					});
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}
}

module.exports = OrganizationController;