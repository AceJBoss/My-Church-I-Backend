/**
|----------------------------------------------
| Admin Controller
|----------------------------------------------
| Holds all admin operations
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const Country = require('../database/models/').Country;
const State = require('../database/models/').State;
const LgaData = require('../database/models/').Lga;
const User = require('../database/models/').User;
const UserType = require('../database/models/').UserType;
const UserWallet = require('../database/models/').UserWallet;
const VirtualAccount = require('../database/models/').VirtualAccount;
const DeliveryMode = require('../database/models/').DeliveryMode;
const DeliveryPrice = require('../database/models/').DeliveryPrice;
const DeliveryJob = require('../database/models/').DeliveryJob;
const Organization = require('../database/models/').Organization;
const formvalidator = require('../middlewares/formvalidator');
const request = require('request');
var {sendSms, smsBalance} = require('@kidikudazi/smart-sms')(request);
var {createVirtualAccount} = require('../middlewares/flutterwave')();
const Sequelize = require('sequelize');

class AdminController{
	/**
	* create new delivery mode
	*/
	static async createDeliveryMode(req, res) {
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				let {vehicle, description, max_distance} = req.body;

				// validate data
				let rules = {
					vehicle:'required',
					description:'required',
					max_distance:'required'
				};

				let validator = formvalidator(req, rules);
			
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate delivery mode
				let validateMode =  await callbacks.multiple(DeliveryMode, {vehicle:vehicle.toLowerCase()});

				if(validateMode.length > 0){
					return res.status(203).json({
						error:true,
						message:"Delivery mode has already been created."
					});
				}

				// create delivery mode
				DeliveryMode.create({
					vehicle:vehicle,
					description:description,
					max_distance:max_distance
				}).then(saved=>{
					if(saved){
						return res.status(201).json({
							error:false,
							message:"Delivery mode created successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to create delivery mode."
						})
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
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	*fetch all delivery mode
	*/
	static async fetchAllDeliveryMode(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				DeliveryMode.findAll({}).then(record=>{
					var data = []
					for (var i = 0; i < record.length; i++) {
						data.push(record[i].dataValues);
					}
					return res.status(200).json(data);
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
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* edit delivery mode
	*/
	static async editDeliveryMode(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				var delivery_mode_id = req.params.delivery_mode_id;

				// validate record
				let validateRecord = await callbacks.multiple(DeliveryMode, {id:delivery_mode_id});

				if(validateRecord.length < 1){
					return res.status(203).json({
						error:true,
						message:"Record not found."
					});
				}

				// return record
				return res.status(200).json(validateRecord[0]);
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
	* update delivery mode
	*/
	static async updateDeliveryMode(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				let delivery_mode_id = req.params.delivery_mode_id;
				let {vehicle, description, max_distance} = req.body;

				// validate data
				let rules = {
					vehicle:'required',
					description:'required',
					max_distance:'required'
				};

				let validator = formvalidator(req, rules);
			
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate delivery mode
				let validateMode =  await callbacks.multiple(DeliveryMode, {vehicle:vehicle.toLowerCase()});

				if(validateMode.length > 0 && validateMode[0].dataValues.id != delivery_mode_id){
					return res.status(203).json({
						error:true,
						message:"Failed! Delivery mode has already been created."
					});
				}

				// update delivery mode
				DeliveryMode.update({
					vehicle:vehicle,
					description:description,
					max_distance:max_distance
				},{
					where:{
						id:delivery_mode_id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							message:"Delivery mode updated successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to update delivery mode."
						})
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
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* delete delivery mode
	*/
	static async deleteDeliveryMode(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				let delivery_mode_id = req.params.delivery_mode_id;

				// validate record
				let validateRecord = await callbacks.multiple(DeliveryMode, {id:delivery_mode_id});

				if(validateRecord.length < 1){
					return res.status(203).json({
						error:true,
						message:"Failed! record not found."
					});
				}

				// check if delivery mode has been attached to a delivery price
				let checkAttachment = await callbacks.multiple(DeliveryPrice, {delivery_mode_id:delivery_mode_id});

				if(checkAttachment.length > 0){
					return res.status(203).json({
						error:true,
						message: 'Failed! Delivery mode is attached to a delivery price.'
					});
				}

				// delete the record
				DeliveryMode.destroy({
					where:{
						id:delivery_mode_id
					}
				}).then(deleted=>{
					if(deleted){
						return res.status(200).json({
							error:false,
							message:"Delivery mode deleted successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Faield to delete delivery mode. Try again later."
						});
					}
				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:err.message
					})
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

	/**
	* create delivery price
	*/
	static async createDeliveryPrice(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				let {delivery_type, delivery_mode_id, km_price} = req.body;

				// validate data
				let rules = {
					delivery_type:'required',
					delivery_mode_id:'required',
					km_price:'required'
				};

				let validator = formvalidator(req, rules);
			
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate delivery mode
				let validateMode = await callbacks.multiple(DeliveryMode, {id:delivery_mode_id});

				if(validateMode.length < 1){
					return res.status(203).json({
						error:true,
						message:"Invalid delivery mode suppied."
					});
				}

				// validate delivery price
				let validateRecord =  await callbacks.multiple(DeliveryPrice, {delivery_type:delivery_type, delivery_mode_id:delivery_mode_id});

				if(validateRecord.length > 0){
					return res.status(203).json({
						error:true,
						message:"Delivery pricing has already been created."
					});
				}

				// create delivery price
				DeliveryPrice.create({
					delivery_type:delivery_type,
					delivery_mode_id:delivery_mode_id,
					km_price:km_price
				}).then(saved=>{
					if(saved){
						return res.status(201).json({
							error:false,
							message:"Delivery price saved successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to create delivery price."
						})
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
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* fetch all delivery price
	*/
	static async fetchAllDeliveryPrice(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				DeliveryPrice.findAll({
					include:[{
						model:DeliveryMode
					}]
				}).then(record=>{
					var data = []
					for (var i = 0; i < record.length; i++) {
						data.push(record[i].dataValues);
					}
					return res.status(200).json(data);
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
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* edit delivery price
	*/
	static async editDeliveryPrice(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				var delivery_price_id = req.params.delivery_price_id;

				// validate record
				let validateRecord = await callbacks.multiple(DeliveryPrice, {id:delivery_price_id});

				if(validateRecord.length < 1){
					return res.status(203).json({
						error:true,
						message:"Record not found."
					});
				}

				// return record
				return res.status(200).json(validateRecord[0]);
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
	* update delivery price
	*/
	static async updateDeliveryPrice(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				let delivery_price_id = req.params.delivery_mode_id;
				let {delivery_type, delivery_mode_id, km_price} = req.body;

				// validate data
				let rules = {
					delivery_type:'required',
					delivery_mode_id:'required',
					km_price:'required'
				};

				let validator = formvalidator(req, rules);
			
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate delivery mode
				let validateMode = await callbacks.multiple(DeliveryMode, {id:delivery_mode_id});

				if(validateMode.length < 1){
					return res.status(203).json({
						error:true,
						message:"Invalid delivery mode suppied."
					});
				}

				// validate delivery price
				let validateRecord =  await callbacks.multiple(DeliveryPrice, {delivery_type:delivery_type, delivery_mode_id:delivery_mode_id});

				if(validateRecord.length > 0 && validateRecord[0].dataValues.id != delivery_price_id){
					return res.status(203).json({
						error:true,
						message:"Delivery pricing has already been created."
					});
				}

				// update delivery price
				DeliveryPrice.update({
					delivery_type:delivery_type,
					delivery_mode_id:delivery_mode_id,
					km_price:km_price
				},{
					where:{
						id:delivery_price_id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							message:"Delivery price updated successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to update delivery price."
						})
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
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}	
	}

	/**
	* delete delivery price
	*/
	static async deleteDeliveryPrice(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				let delivery_price_id = req.params.delivery_price_id;

				// validate record
				let validateRecord = await callbacks.multiple(DeliveryPrice, {id:delivery_price_id});

				if(validateRecord.length < 1){
					return res.status(203).json({
						error:true,
						message:"Failed! record not found."
					});
				}

				// check if delivery price has been attached to a delivery job
				let checkAttachment = await callbacks.multiple(DeliveryJob, {delivery_price_id:delivery_price_id});

				if(checkAttachment.length > 0){
					return res.status(203).json({
						error:true,
						message: 'Failed! Delivery price is attached to a delivery job.'
					});
				}

				// delete the record
				DeliveryPrice.destroy({
					where:{
						id:delivery_price_id
					}
				}).then(deleted=>{
					if(deleted){
						return res.status(200).json({
							error:false,
							message:"Delivery price deleted successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Faield to delete delivery price. Try again later."
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
			return res.status(200).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* manage all users
	*/
	static async manageUsers(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// get user type id
				let getUserType = await callbacks.findOne(UserType, {user_type:'user'});

				if(getUserType.length < 1){
					return res.status(203).json({
						error:true,
						message:'Failed to fetch records'
					});
				}

				User.findAll({
					where:{
						user_type_id:getUserType.id
					}
				}).then(users=>{
					// collect data
					let data = [];

					for (var i = 0; i < users.length; i++) {
						data.push(users[i].dataValues);
					}
					// return record
					return res.status(200).json(data);
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
			return res.status(203).json({
				error:true,
				message:e.message
			});
		}
	}

	/**
	* admin register new organization
	*/
	static async adminRegisterOrganisation(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
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
				// let otp = await callbacks.randomNum(5);
				let userType = await callbacks.multiple(UserType, {user_type:'organization'});

				// create organzation registration
				let createUser = {
					first_name:organization_name,
					last_name:'',
					email:email,
					phone:phone,
					ref_code:ref_code+''+Math.floor(Date.now() / 1000),
					password:bcrypt.hashSync(password, 10),
					user_type_id:userType[0].dataValues.id
				}
		       	
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
							message:"Registration successful."
						});
					}else{
						return res.status(201).json({
							error:false,
							message:"Failed to register organization. Kindly try again later."
						});
					}
				})
				.catch(err=>{
					return res.status(200).json({
						error:true,
						message:"Failed to register. Kindly try again later."
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
	* list all organizations registered
	*/
	static async fetchAllOrganizations(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// fetch all organizations
				Organization.findAll({
					include:[
						{
							model:User
						}
					]
				})
				.then(record=>{
					var dataArr  = [];

					record.forEach((item, index)=>{
						var dataObj  = {
							organization_id:item.id,
							user_id:item.User.user_id,
							organization_name:item.User.first_name,
							email:item.User.email,
							phone:item.User.phone,
							address:item.address,
							status:item.status
						}

						dataArr.push(dataObj);
					});

					return res.status(200).json(dataArr);
				})
				.catch(err=>{
					return res.status(203).json({
						error:true,
						message:"Falied to fetch Organization record."
					});
				})
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
	* admin update organization status
	*/
	static async updateOrganizationStatus(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'admin'){
				// collect data
				var organization_id = req.params.organization_id;

				// validate organization id
				var checkId = await callbacks.multiple(Organization, {id:organization_id});

				if(checkId.length < 1){
					return res.status(203).json({
						error:true,
						message: 'Invalid data supplied.'
					});
				}

				// check status and update
				Organization.update({
					status: (checkId[0].dataValues.status == 'pending')? 'verified': 'pending'
				}, {
					where:{
						id:organization_id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							message:"Organization status updated successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to update Organization status."
						});
					}

				}).catch(err=>{
					return res.status(203).json({
						error:true,
						message:"Falied to update Organization status."
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

}

module.exports = AdminController;