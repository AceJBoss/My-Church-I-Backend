/**
|----------------------------------------------
| Login Controller
|----------------------------------------------
| Holds all of the
| user login.
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const Mailer = require('../middlewares/mail.js');
const callbacks = require('../function/index.js');
const jwt = require('jsonwebtoken');
const Country = require('../database/models/').Country;
const State = require('../database/models/').State;
const LgaData = require('../database/models/').Lga;
const UserType = require('../database/models/').UserType;
const User = require('../database/models/').User;
const Organization = require('../database/models/').Organization;
const Driver = require('../database/models/').Driver;
const formvalidator = require('../middlewares/formvalidator');
const Sequelize = require('sequelize');

require('dotenv').config();
var secret = process.env.SECRET;

class LoginController{
	/**
	* User login
	*/
	static loginUser(req, res){
		try{

			var email = req.body.email;
			var password = req.body.password;

			// validate entry
		    let rules = {
		    	email:'required|email',
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

			User.findAll({
				where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), email.toLowerCase())	
			}).then(async user=>{
				if (user.length == 0) {
		 			res.status(200).json({error:true,message: "Invalid Credentials."})
		 		}else{

		 			var passwordIsValid = bcrypt.compareSync(password, user[0].dataValues.password.trim());
	  		
			  		if (passwordIsValid){

			  			// validate user status
			  			if(user[0].dataValues.status == 'Suspended'){
			  				return res.status(203).json({
			  					error:true,
			  					message:"Your account has been suspended. Contact support."
			  				});
			  			}

			  			if(user[0].dataValues.status == 'Pending'){
			  				return res.status(203).json({
			  					error:true,
			  					message:"Kindly verify your account to be able to login."
			  				});
			  			}

			  			// get user type id
			  			let userTypeId = user[0].dataValues.user_type_id;
			  			let userType = await callbacks.multiple(UserType, {id:userTypeId});

			  			let fetchUserData ='';
			  			let userDetails = '';
			  			let userData = '';

			  			// check user type
			  			switch(userType[0].dataValues.user_type){
			  				case 'user':
			  					// get user details
			  					userDetails = {
			  						id:user[0].dataValues.id,
			  						image_url:user[0].dataValues.image_url,
			  						first_name:user[0].dataValues.first_name,
			  						last_name:user[0].dataValues.last_name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						is_auth: userType[0].dataValues.user_type
			  					};

			  					userData = {
			  						image_url:user[0].dataValues.image_url,
			  						first_name:user[0].dataValues.first_name,
			  						last_name:user[0].dataValues.last_name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						account:'user'
			  					}

			  				break;

			  				case 'organization':
			  					// get organization details
			  					 fetchUserData = await callbacks.multiple(Organization, {user_id:user[0].dataValues.id});
			  					 userDetails = {
			  						id:fetchUserData[0].dataValues.id,
			  						user_id:fetchUserData[0].dataValues.user_id,
			  						image_url:user[0].dataValues.image_url,
			  						organization_name:user[0].dataValues.first_name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						address:fetchUserData[0].dataValues.address,
			  						ride_charge:fetchUserData[0].dataValues.ride_charge,
			  						is_auth: userType[0].dataValues.user_type
			  					};

			  					 userData = {
			  						user_id:fetchUserData[0].dataValues.user_id,
			  						image_url:user[0].dataValues.image_url,
			  						organization_name:user[0].dataValues.first_name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						address:fetchUserData[0].dataValues.address,
			  						ride_charge:fetchUserData[0].dataValues.ride_charge,
			  						account:'organization'
			  					}

			  				break;

			  				case 'driver':
			  					// get drver details
			  					fetchUserData = await callbacks.multiple(Driver, {user_id:user[0].dataValues.id});
			  					userDetails = {
			  						id:fetchUserData[0].dataValues.id,
			  						user_id:fetchUserData[0].dataValues.user_id,
			  						image_url:user[0].dataValues.image_url,
			  						organization_id:fetchUserData[0].dataValues.organization_id,
			  						address:fetchUserData[0].dataValues.address,
			  						lat:fetchUserData[0].dataValues.lat,
			  						lng:fetchUserData[0].dataValues.lng,
			  						wake_point_lat:fetchUserData[0].dataValues.wake_point_lat,
			  						wake_point_lng:fetchUserData[0].dataValues.wake_point_lng,
			  						dob:fetchUserData[0].dataValues.dob,
			  						duty_on:fetchUserData[0].dataValues.duty_on,
			  						license_uploaded:fetchUserData[0].dataValues.license_uploaded,
			  						is_verified_by_admin:fetchUserData[0].dataValues.is_verified_by_admin,
			  						name:user[0].dataValues.name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						status:user[0].dataValues.status,
			  						is_auth: userType[0].dataValues.user_type
			  					};

			  					userData = {
			  						user_id:fetchUserData[0].dataValues.user_id,
			  						image_url:user[0].dataValues.image_url,
			  						organization_id:fetchUserData[0].dataValues.organization_id,
			  						address:fetchUserData[0].dataValues.address,
			  						lat:fetchUserData[0].dataValues.lat,
			  						lng:fetchUserData[0].dataValues.lng,
			  						wake_point_lat:fetchUserData[0].dataValues.wake_point_lat,
			  						wake_point_lng:fetchUserData[0].dataValues.wake_point_lng,
			  						dob:fetchUserData[0].dataValues.dob,
			  						duty_on:fetchUserData[0].dataValues.duty_on,
			  						license_uploaded:fetchUserData[0].dataValues.license_uploaded,
			  						is_verified_by_admin:fetchUserData[0].dataValues.is_verified_by_admin,
			  						name:user[0].dataValues.name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						status:user[0].dataValues.status,
			  						account:'driver'
			  					};

			  				break;

			  				case 'admin':
			  					// get admin details
			  					fetchUserData = await callbacks.multiple(User, {id:user[0].dataValues.id});
			  					userDetails = {
			  						id:fetchUserData[0].dataValues.id,
			  						first_name:user[0].dataValues.first_name,
			  						last_name:user[0].dataValues.last_name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						is_auth: userType[0].dataValues.user_type
			  					};

			  					userData = {
			  						first_name:user[0].dataValues.first_name,
			  						last_name:user[0].dataValues.last_name,
			  						email:user[0].dataValues.email,
			  						phone:user[0].dataValues.phone,
			  						account:'admin'
			  					};

			  				break;

			  				default:
			  					return res.status(200).json({error:true, message:"Invalid Credentials."});
			  				break;
			  			}


			  			
						var token = jwt.sign({
				          user: userDetails
				        }, secret, {
				          expiresIn: '1d'
				        });

				        return res.status(200).json({
				        	error:false,
				        	account:userType[0].dataValues.user_type,
							user: userData,
							token:token
				        });
					}else{
						return res.status(200).json({
				          error: true,
				          message: 'Invalid Credentials.'
				        });
					}
		 		}
			}).catch(e=>{
				return res.status(200).json({
					error:true,
					message:e.message
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
	* forgot password
	*/
	static async forgotPassword (req, res){
		try{

			// collect email address
			var email = req.body.email;

			let rules  = {
				'email':'required'
			}

			let validator = formvalidator(req, rules);

			if(validator){
				return res.status(203).json({
					error:true,
					data:{},
					message:validator
				});
			}

			// validate if email exists
			var validateEmail = await callbacks.validateEmail(User, email);

			if(validateEmail.length < 1){
				return res.status(203).json({error:true, data:{}, message:"Invalid Email Supplied"});
			}

			// reset password
			var newPassword = await callbacks.randomStr(6);
			var hashedPassword = bcrypt.hashSync(newPassword, 10);

			// send mail
			var resetPassword = await Mailer.resetPasswordMail(email, validateEmail[0].dataValues.first_name+" "+validateEmail[0].last_name, newPassword);

			if(resetPassword != undefined){
				// update password
				User.update({password:hashedPassword.trim()},{
					where:{
						email:email
					}
				}).then(result=>{
					if(result){

						return res.status(200).json({error:false, data:{}, message: "Password Reset Successful. Kindly check your email for new Password"});
					}else{	
						// return error message
						return res.status(203).json({error:true, data:{}, message:"Sorry, unable to reset password."});
					}
					return
				}).catch(err=>{
					// return error message
					return res.status(203).json({error:true, data:{}, message:"Sorry, unable to reset password."});
				});
			}else{
				// return error message
				return res.status(203).json({error:true, data:{}, message:"Sorry, unable to reset password."});
			}
		}catch(e){
			console.log(e);
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}
}

module.exports = LoginController;