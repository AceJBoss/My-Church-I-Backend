module.exports ={
	async fetchSingle(modelName, val){

		return await modelName.findAll({
			where:{
				id:val
			}
		})
	},

	async findOne(modelName, obj){

		return await modelName.findOne({
			where:obj
		});
	},

	async validatePhone(modelName, val){

		return await modelName.findAll({
			where:{
				phone:val
			}
		})
	},

	async validateEmail(modelName, val){

		return await modelName.findAll({
			where:{
				email:val
			}
		})
	},

	async multiple(modelName, obj){
		return await modelName.findAll({
			where:obj
		})
	},

	async transform(name){
		var fullname = name;
		var splitName = fullname.split(' ');
		var newName = "";

		for (var i = 0; i < splitName.length; i++) {
			newName += ' '+splitName[i].charAt(0).toUpperCase() + splitName[i].slice(1);
			if(i == 0){

				newName = newName.trim();
			}
		}

		return  newName;
	},

	async currentDate(){
		var d = new Date();
     
	    var date = d.getDate();
	    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
	    var year = d.getFullYear();
	     
	    var dateStr = date + "-" + month + "-" + year;
	    return dateStr;
	},

	async currentYear(){
		var d = new Date(); // Since getMonth() returns month from 0-11 not 1-12
	    var year = d.getFullYear();
	   
	    return year;
	},

	async randomStr(numLength){
	   var result  = '';
	   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < numLength; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	},

	async randomNum(numLength){
	   var result  = '';
	   var characters = '0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < numLength; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	},

	paginate(page, pageSize) {
		let offset = page == 1 ? 0 : pageSize * (page - 1);

		let limit = pageSize;

		return { offset: offset, limit: limit };
	},

	dataToPagination(result, count, page, pageSize) {
		let total_count = count;
		let total_page = Math.ceil(total_count / pageSize);
		if (page <= total_page) {
		  let data = {};
		  data.meta = {
		    current_page: page,
		    per_page: pageSize,
		    from: 1,
		    to: page,
		    total: total_count,
		    last_page: total_page,
		    prev: page <= total_page ? page == 1 ? null : page - 1 : null,
		    next: page > total_page ? null : page == total_page ? null : page + 1
		  };
		  data.data = result;
		  return data;
		} else {
		  return [];
		}
	},
	
	distance(lat1, lon1, lat2, lon2){
	    if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {

			// distance between latitudes and longitudes
			var dLat = (lat2 - lat1) * Math.PI/180.0;
			var dLon = (lon2 - lon1) * Math.PI/180.0;

			// convert to radians
			var lat1 = (lat1)* Math.PI/180.0;
			var lat2 = (lat2)* Math.PI/180.0;

			// apply formulae
			var a = Math.pow(Math.sin(dLat/2), 2) + Math.pow(Math.sin(dLon/2), 2) * Math.cos(lat1) * Math.cos(lat2);

			var rad = 6371;
			var c = 2 * Math.asin(Math.sqrt(a));
			return rad * c;

		}
	}
}