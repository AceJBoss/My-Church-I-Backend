/**
|----------------------------------------------
| User Controller
|----------------------------------------------
| Holds all user operations
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const jwt = require('jsonwebtoken');
const User = require('../database/models/').User;
const UserWallet = require('../database/models/').UserWallet;
const VirtualAccount = require('../database/models/').VirtualAccount;
const Organization = require('../database/models/').Organization;
const Country = require('../database/models/').Country;
const State = require('../database/models/').State;
const LgaData = require('../database/models/').Lga;
const formvalidator = require('../middlewares/formvalidator');
const {cloudinary} = require('../middlewares/cloudinary');
const Sequelize = require('sequelize');

require('dotenv').config();
var secret = process.env.SECRET;


class UserController{

	/**
	* get user profile
	*/
	static async getUserProfile(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'user' || auth == 'admin'){
				
				// fetch all user profile
			    User.findAll({
			    	where:{
			    		id:req.decoded.user.id
			    	}
			    })
			    .then(record=>{
			    	return res.status(200).json(record);
			    })
			    .catch(err=>{
			    	return res.status(203).json({
			    		error:true,
			    		message:err.message
			    	});
			    });
			}else if(auth == 'organization'){
				// fetch all user profile
			    User.findAll({
			    	include:[{
			    		model:Organization
			    	}],
			    	where:{
			    		id:req.decoded.user.user_id
			    	}
			    })
			    .then(record=>{
			    	return res.status(200).json(record);
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
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* update basic profile
	*/
	static async updateBasicProfile(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'user' || auth == 'admin'){
				// collect data
				let user_id = req.decoded.user.id;

				let {first_name, last_name, phone, email} = req.body;
				// validate entry
			    let rules = {
			    	'first_name':'required',
			    	'last_name':'required',
			    	'email':'required|email',
			    	'phone':'required'
			    };

			    let validator = formvalidator(req, rules);
				
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate email 
				let validateEmail = await callbacks.multiple(User, {email:email});

				if(validateEmail.length > 0 && validateEmail[0].dataValues.id != user_id){
					return res.status(203).json({
						error:true,
						message:"Email already exist."
					});
				}


				// validate phone number
				let validatePhone = await callbacks.multiple(User, {phone:phone});

				if(validatePhone.length > 0 && validatePhone[0].dataValues.id != user_id){
					return res.status(203).json({
						error:true,
						message:"Phone number already exist."
					});
				}

			    // update user account
			    let userAccount = {
			    	first_name:first_name,
			    	last_name:last_name,
			    	email:email,
			    	phone:phone,
			    }

			    User.update(userAccount, {
			    	where:{
			    		id:user_id
			    	}
			    })
			    .then(result=>{
			    	if(result){
		    			let userDetails  = {
    						id:user_id,
	  						first_name:first_name,
	  						last_name:last_name,
	  						email:email,
	  						phone:phone,
	  						is_auth: auth
    					}

    					let userData = {
    						first_name:first_name,
	  						last_name:last_name,
	  						fullname:first_name+' '+last_name,
	  						email:email,
	  						phone:phone,
    					};

						var token = jwt.sign({
							user: userDetails
						}, secret, {});

						userData.token = token;
    					return res.status(200).json({
    						error:false,
    						data:userData,
    						message:"Profile updated successfully."
    					});
			    	}else{
			    		return res.status(203).json({
			    			error:true,
			    			message:'Failed to update profile.'
			    		});
			    	}
			    })
			    .catch(err=>{
			    	return res.status(203).json({
			    		error:true,
			    		message:'Profile update failed.'
			    	});
			    });
			}else if(auth == 'organization'){
				// collect data
				let user_id = req.decoded.user.user_id;
				let organization_id = req.decoded.user.id;

				let {organization_name, phone, email, address} = req.body;
				// validate entry
			    let rules = {
			    	'organization_name':'required',
			    	'email':'required|email',
			    	'phone':'required',
			    	'address':'required'
			    };

			    let validator = formvalidator(req, rules);
				
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate email 
				let validateEmail = await callbacks.multiple(User, {email:email});

				if(validateEmail.length > 0 && validateEmail[0].dataValues.id != user_id){
					return res.status(203).json({
						error:true,
						message:"Email already exist."
					});
				}


				// validate phone number
				let validatePhone = await callbacks.multiple(User, {phone:phone});

				if(validatePhone.length > 0 && validatePhone[0].dataValues.id != user_id){
					return res.status(203).json({
						error:true,
						message:"Phone number already exist."
					});
				}

			    // update user account
			    let userAccount = {
			    	first_name:organization_name,
			    	email:email,
			    	phone:phone
			    }

			    User.update(userAccount, {
			    	where:{
			    		id:user_id
			    	}
			    })
			    .then(async result=>{
			    	if(result){

			    		await Organization.update({address:address}, {
			    			where:{
			    				id:organization_id
			    			}
			    		});

		    			let userDetails  = {
    						id:organization_id,
    						user_id:user_id,
	  						organization_name:organization_name,
	  						email:email,
	  						phone:phone,
	  						address:address,
	  						is_auth: auth
    					}

    					let userData = {
    						user_id:user_id,
    						organization_name:organization_name,
	  						email:email,
	  						phone:phone,
	  						address:address
    					};

						var token = jwt.sign({
							user: userDetails
						}, secret, {expiresIn: '1d'});

						userData.token = token;
    					return res.status(200).json({
    						error:false,
    						data:userData,
    						message:"Profile updated successfully."
    					});
			    	}else{
			    		return res.status(203).json({
			    			error:true,
			    			message:'Failed to update profile.'
			    		});
			    	}
			    })
			    .catch(err=>{
			    	return res.status(203).json({
			    		error:true,
			    		message:'Profile update failed.'
			    	});
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
	* change password
	*/
	static async changePassword(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'user' || auth == 'admin'){
				// collect data
				let user_id = req.decoded.user.id;
				let {old_password, new_password} = req.body;

				User.findAll({
		          where: {
		            id: user_id
		          }
		        }).then(response => {
					// verify password
					var verifyPassword = bcrypt.compareSync(old_password.trim(), response[0].password);

					if (verifyPassword) {
						// encrypt password
						var encryptPassword = bcrypt.hashSync(new_password, 10);

						// update password
						User.update({ password: encryptPassword }, {
						  where: {
						    id: user_id
						  }
						}).then(updated => {
						  if (updated) {
						  	let vPassword = {
						  		password:encryptPassword
							}
						    res.status(200).json({ error: false, message: "Password updated successfully." });
						  } else {
						    res.status(203).json({ error: true, message: "Password update failed." })
						  }
						}).catch(err => {
						  return res.status(203).json({
						  	error:true,
						  	message:err.message
						  });
						});
					} else {
						return res.status(203).json({error:true, message: "Invalid old password supplied." });
					}
		        }).catch(err => {
		          return res.status(203).json({
		          	error:true,
		          	message:"Failed to change password."+err.message
		          });
		        });
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.sendStatus(500);
		}
	}

	/**
	* get user wallet info
	*/
	static async fetchUserWallet(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'user'){
				let getWalletData =  await callbacks.multiple(UserWallet, {user_id:req.decoded.user.id});
				let getAccountData = await callbacks.multiple(VirtualAccount, {user_id:req.decoded.user.id});

				// return response
				return res.status(200).json({
					error:false,
					wallet_balance:getWalletData[0].dataValues.balance,
					account_details:{
						account_name:getAccountData[0].dataValues.account_name,
						bank_name:getAccountData[0].dataValues.bank_name,
						account_no:getAccountData[0].dataValues.account_no
					}
				});
			}else{
				return res.status(203).json({
					error:true,
					message:'un-authorized access.'
				});
			}
		}catch(e){
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* update user profile image
	*/
	static async updateProfileImage(req, res){
		try{
			// validate user 
			let auth = req.decoded.user.is_auth;

			if(auth == 'user'){
				// collect data
				var image_url = req.file.secure_url;
				var image_key = req.file.public_id;

				// check if user already has a picture
				let checkUserImage = await callbacks.findOne(User, {id:req.decoded.user.id});
				console.log(checkUserImage.dataValues);
				if(checkUserImage.image_url != null){
					// get previous key and delete key
					await cloudinary.uploader.destroy(checkUserImage.image_key);
				}

				// update new image url
				User.update({
					image_url,
					image_key
				},{
					where:{
						id:req.decoded.user.id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							message:"profile picture updated successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Failed to update user profile picture"
						});
					}
				}).catch(err=>{
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
			console.log(e);
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}
}

module.exports = UserController;