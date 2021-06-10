const distance = (lat1, lon1, lat2, lon2, unit)=>{
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
		return rad * c + `${unit}`;

	}
}
module.exports = distance;