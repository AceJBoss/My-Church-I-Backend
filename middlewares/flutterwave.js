const Ravepay = require('flutterwave-node');
require('dotenv').config();
const rave = new Ravepay(process.env.RAV_PUBLIC_KEY, process.env.RAV_SECRET_KEY, false);

const flutterApi = () =>{
	// send sms
	const createVirtualAccount = async (payload, mycallback)=>{

		const callback = (error, response, body)=>{
			return mycallback(error, body);
		}
		let response = await  rave.VirtualAccount.accountNumber(payload);
		return response;
		// request.post(options, callback);
	}
	return {createVirtualAccount};
}

module.exports = flutterApi;