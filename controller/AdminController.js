/**
|----------------------------------------------
| Admin Controller
|----------------------------------------------
| Holds all admin operations
|----------------------------------------------
*/
const bcrypt = require('bcryptjs');
const callbacks = require('../function/index.js');
const User = require('../database/models/').User;
const UserType = require('../database/models/').UserType;
const ChurchUnit = require('../database/models/').ChurchUnit;
const Event = require('../database/models/').Event;
const Sermon = require('../database/models/').Sermon;
const Preaching = require('../database/models/').Preaching;
const ScheduleCounselling = require('../database/models/').ScheduleCounselling;
const CounselFeedback = require('../database/models/').CounselFeedback;
const formvalidator = require('../middlewares/formvalidator');
const {cloudinary} = require('../middlewares/cloudinary');
const request = require('request');
const Sequelize = require('sequelize');

class AdminController{
	/**
	* create new church units
	*/
	static async createChurchUnit(req, res) {
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;

			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				let {unit_name} = req.body;

				// validate data
				let rules = {
					unit_name:'required',
				};

				let validator = formvalidator(req, rules);
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}
				// validate church unit
				let validateChurchUnit =  await callbacks.multiple(ChurchUnit, {unit_name:unit_name.toLowerCase()});
				if(validateChurchUnit.length > 0){
					return res.status(203).json({
						error:true,
						message:"Church Unit has already been created."
					});
				}

				// create church unit
				ChurchUnit.create({
					unit_name:unit_name
				}).then(saved=>{
					if(saved){
						return res.status(201).json({
							error:false,
							message:"Church Unit created successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to create church unit."
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
	*fetch all church unit
	*/
	static async fetchAllChurchUnit(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				ChurchUnit.findAll({}).then(record=>{
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
	* edit church unit
	*/
	static async editChurchUnit(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				var church_unit_id = req.params.church_unit_id;

				// validate record
				let validateRecord = await callbacks.multiple(ChurchUnit, {id:church_unit_id});

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
	* update church unit
	*/
	static async updateChurchUnit(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				var church_unit_id = req.params.church_unit_id;
				let {unit_name} = req.body;

				// validate data
				let rules = {
					unit_name:'required'
				};

				let validator = formvalidator(req, rules);
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate delivery mode
				let validateChurchUnit =  await callbacks.multiple(ChurchUnit, {unit_name:unit_name.toLowerCase()});
				if(validateChurchUnit.length > 0 && validateChurchUnit[0].dataValues.id != church_unit_id){
					return res.status(203).json({
						error:true,
						message:"Failed! Church Unit has already been created."
					});
				}

				// update delivery mode
				ChurchUnit.update({
					unit_name:unit_name
				},{
					where:{
						id:church_unit_id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							message:"Church unit updated successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Falied to update church unit."
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
	* delete church unit
	*/
	static async deleteChurchUnit(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				let church_unit_id = req.params.church_unit_id;

				// validate record
				let validateRecord = await callbacks.multiple(ChurchUnit, {id:church_unit_id});
				if(validateRecord.length < 1){
					return res.status(203).json({
						error:true,
						message:"Failed! record not found."
					});
				}

				// delete the record
				ChurchUnit.destroy({
					where:{
						id:church_unit_id
					}
				}).then(deleted=>{
					if(deleted){
						return res.status(200).json({
							error:false,
							message:"Church unit deleted successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Failed to delete church unit. Try again later."
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
	 * create user
	 */
	static async createUser(req, res) {
		try {
			let {title, first_name, last_name, email, phone, dob, year, month, day, password, user_type_id} = req.body;
			// validate entry
			let rules = {
				title: 'required',
				first_name: 'required',
				last_name: 'required',
				email: 'required|email',
				phone: 'required',
				password: 'required',
				dob: 'required'
			}

			let validator = formvalidator(req, rules);
			if (validator) {
				return res.status(203).json({
					error: true,
					message: validator
				});
			}
			password = password.replace(/\s/g, '');
			// validate email
			let validateEmail = await callbacks.multiple(User, {email: email});
			if (validateEmail.length > 0) {
				return res.status(200).json({
					error: true,
					message: 'Email already exist.'
				});
			}
			// validate phone
			let validatePhone = await callbacks.multiple(User, {phone: phone});
			if (validatePhone.length > 0) {
				return res.status(200).json({
					error: true,
					message: 'Phone number already exist.'
				});
			}

			// create user
			let createUser = {
				title:title,
				first_name: first_name,
				last_name: last_name,
				email: email,
				phone: phone,
				password: bcrypt.hashSync(password, 10),
				dob: dob,
				year: year,
				month: month,
				day: day,
				user_type_id: user_type_id
			}

			// create
			User.create(createUser)
				.then(async (saved) => {
					if (saved) {
						return res.status(201).json({
							error: false,
							message: "Registration successful"
						});
					} else {
						return res.status(203).json({
							error: true,
							message: "Failed to register. Kindly try again later."
						});
					}
				})
				.catch(err => {
					return res.status(200).json({
						error: true,
						message: "Failed to register. Kindly try again later."
					});
				});

		} catch (e) {
			return res.status(200).json({
				error: true,
				message: e.message
			});
		}
	}

	/**
	* manage all members
	*/
	static async fetchAllMembers(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// get user type id
				let getUserType = await callbacks.findOne(UserType, {user_type:'member'});

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
	 * edit church unit
	 */
	static async editMember(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				var member_id = req.params.member_id;

				// validate record
				let validateRecord = await callbacks.multiple(User, {id:member_id});

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
	 * suspend church member
	 */
	static async suspendMember(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				var member_id = req.params.member_id;
				let {status} = 'Suspended';

				// update delivery mode
				User.update({
					status:status
				},{
					where:{
						id:member_id
					}
				}).then(updated=>{
					if(updated){
						return res.status(200).json({
							error:false,
							message:"Member suspended successfully."
						});
					}else{
						return res.status(203).json({
							error:true,
							message:"Failed to suspend church member."
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
	 * Create Events
	 */
	static async createEvents(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				let {title, description} = req.body;

				// validate entry
				let rules = {
					title:'required',
					description:'required'
				}

				let validator = formvalidator(req, rules);

				if(validator){
					await cloudinary.uploader.destroy(req.file.public_id);
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				let image_url = req.file.secure_url;
				let image_key = req.file.public_id;

				// validate delivery models
				let validateEvent = await callbacks.multiple(Event, {title:title});

				if(validateEvent.length > 0){
					return res.status(203).json({
						error:true,
						message:'Event already exists.'
					});
				}

				// upload events
				let eventObj = {
					title:title,
					description:description,
					image_url:image_url,
					image_key:image_key
				}

				Event.create(eventObj)
					.then(async saved=>{
						if(saved){
							return res.status(201).json({
								error:false,
								message:'Event uploaded successfully.',
								data:saved
							});

						}else{
							return res.status(203).json({
								error:true,
								message:'Failed to upload event.'
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

	/**
	 * fetch All Events
	 */
	static async fetchAllEvents(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				Event.findAll({
					order: [['createdAt', 'DESC']]
				}).then(events=>{
					// collect data
					let data = [];
					for (var i = 0; i < events.length; i++) {
						data.push(events[i].dataValues);
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
	 * Create Sermon
	 */
	static async createSermon(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				let {title, video, preacher} = req.body;

				// validate entry
				let rules = {
					title:'required',
					preacher:'required',
					video:'required'
				}

				let validator = formvalidator(req, rules);

				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				// validate sermon
				let validateSermon = await callbacks.multiple(Event, {title:title});

				if(validateSermon.length > 0){
					return res.status(203).json({
						error:true,
						message:'A Sermon with this title already exist.'
					});
				}

				// upload sermon
				let sermonObj = {
					title:title,
					video:video.replace("watch?v=", "embed/"),
					preacher:preacher,
				}

				Sermon.create(sermonObj)
					.then(async saved=>{
						if(saved){
							return res.status(201).json({
								error:false,
								message:'Sermon saved successfully.'
							});

						}else{
							return res.status(203).json({
								error:true,
								message:'Failed to save sermon.'
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

	/**
	 * Create Preaching
	 */
	static async createPreaching(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor' || auth == 'deaconate' || auth == 'admin'){
				// collect data
				let {title, preacher} = req.body;

				// validate entry
				let rules = {
					title:'required',
					preacher:'required'
				}

				let validator = formvalidator(req, rules);

				if(validator){
					await cloudinary.uploader.destroy(req.file.public_id);
					return res.status(203).json({
						error:true,
						message:validator
					});
				}

				let video_url = req.file.secure_url;
				let video_key = req.file.public_id;

				// validate Preaching
				let validatePreaching = await callbacks.multiple(Preaching, {title:title});

				if(validatePreaching.length > 0){
					return res.status(203).json({
						error:true,
						message:'A Preaching with this title already exist.'
					});
				}

				// upload preaching
				let preachingObj = {
					title:title,
					video_url:video_url,
					video_key: video_key,
					preacher:preacher
				}

				Preaching.create(preachingObj)
					.then(async saved=>{
						if(saved){
							return res.status(201).json({
								error:false,
								message:'Preaching uploaded successfully.'
							});

						}else{
							return res.status(203).json({
								error:true,
								message:'Failed to upload preaching.'
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


	/**
	 * fetch Member Counsellings Request
	 */
	static async fetchMemberCounsellingRequest(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor'){
				ScheduleCounselling.findAll({
					include: [
						{
							model: User
						},{
						model: CounselFeedback
						}
						]
				}).then(counsels=>{
					// collect data
					let data = [];
					for (var i = 0; i < counsels.length; i++) {
						// data[i].dataValues.responseTime = moment(counsels[i].createdAt, "YYYY-MM-DD h:mm:ss:a").fromNow();
						data.push(counsels[i].dataValues);
					}
					// return record
					return res.status(200).json({data});
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
	 * Counsel Members
	 */
	static async counselMembers(req, res){
		try{
			// validate access
			let auth =  req.decoded.user.is_auth;
			if(auth == 'pastor'){
				let pastor_id = req.decoded.user.id;
				// collect data
				let {feedback,counsel_id} = req.body;
				// validate entry
				let rules = {
					feedback:'required',
				}

				let validator = formvalidator(req, rules);
				if(validator){
					return res.status(203).json({
						error:true,
						message:validator
					});
				}
				// upload feedback
				let feedbackObj = {
					feedback:feedback,
					counsel_id:counsel_id,
					pastor_id:pastor_id
				}

				CounselFeedback.create(feedbackObj)
					.then(async saved=>{
						if(saved){
							let stat = {status:'Treated'}
							await ScheduleCounselling.update(stat, {
								where:{
									id:counsel_id
								}
							})
							return res.status(201).json({
								error:false,
								message:'Counselling Feedback sent successfully.'
							});

						}else{
							return res.status(203).json({
								error:true,
								message:'Failed to upload event.'
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

module.exports = AdminController;