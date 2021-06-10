const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary');

require('dotenv').config();

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET
});

const storage = cloudinaryStorage({
cloudinary: cloudinary,
folder: "users",
allowedFormats: ["jpg", "png", "jpeg"],
transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage: storage, limit:{ fileSize: 1024 * 1024  * 5} });

module.exports = {
	cloudinary,
	parser
}