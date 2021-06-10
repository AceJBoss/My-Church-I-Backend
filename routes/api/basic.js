/**
|----------------------------------
| Basic Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const BasicController = require('../../controller/BasicController');
const LoginController = require('../../controller/LoginController');
const RegisterController = require('../../controller/RegisterController');

/**
* @swagger
* /api/v1/countries:
*   get:
*     tags:
*       - Basic
*     name: Fetch all countries
*     summary: List all countries
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Country object
*       500:
*         description: Internal server error
*/
// get all countries
router.get('/countries', BasicController.getCountries);

/**
* @swagger
* /api/v1/countries/state/{countryId}:
*   get:
*     tags:
*       - Basic
*     name: Fetch all country state
*     summary: List all selected country state
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: countryId
*         schema:
*           type: integer
*         required:
*           - countryId
*     responses:
*       200:
*         description: State object
*       500:
*         description: Internal server error
*/
// get specific state
router.get('/countries/state/:id', BasicController.getSpecificStates);

/**
* @swagger
* /api/v1/nigeria/state:
*   get:
*     tags:
*       - Basic
*     name: Fetch all nigeria states
*     summary: List all states in nigeria
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: State object
*       500:
*         description: Internal server error
*/
// get nigeria  states
router.get('/nigeria/state', BasicController.getStates);

/**
 * @swagger
 * /api/v1/states:
 *   get:
 *     tags:
 *       - Basic
 *     name: Fetch all nigeria states for mobile
 *     summary: List all states in nigeria for mobile
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: State object
 *       500:
 *         description: Internal server error
 */
// get nigeria  states
router.get('/states', BasicController.getMobileStates);

/**
* @swagger
* /api/v1/lga/{stateId}:
*   get:
*     tags:
*       - Basic
*     name: Fetch all state local government 
*     summary: List all selected state LGA
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: stateId
*         schema:
*           type: integer
*         required:
*           - stateId
*     responses:
*       200:
*         description: LGA object
*       500:
*         description: Internal server error
*/
// get lga 
router.get('/lga/:id', BasicController.getLga);

/**
* @swagger
* /api/v1/lga/state/{lgaId}:
*   get:
*     tags:
*       - Basic
*     name: Fetch local government state
*     summary: List selected  LGA state
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: lgaId
*         schema:
*           type: integer
*         required:
*           - lgaId
*     responses:
*       200:
*         description: LGA object
*       500:
*         description: Internal server error
*/
router.get('/lga/state/:id', BasicController.getLgaState);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags:
 *       - Login
 *     name: user login Place
 *     summary: Login user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '200':
 *         description: Login successful
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// login user 
router.post('/login', LoginController.loginUser);

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     tags:
 *       - Register
 *     name: user register
 *     summary: Register user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             password:
 *               type: string
 *         required:
 *           - first_name
 *           - last_name
 *           - email
 *           - phone
 *           - password
 *     responses:
 *       '201':
 *         description: User registration successful
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// register user 
router.post('/register', RegisterController.registerUser);

/**
 * @swagger
 * /api/v1/resend/otp:
 *   post:
 *     tags:
 *       - Resend user OTP
 *     name: user OTP verification
 *     summary: resend user otp
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *         required:
 *           - phone
 *     responses:
 *       '200':
 *         description: OTP resent successfully
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// resend otp 
router.post('/resend/otp', RegisterController.resendOTP);

/**
 * @swagger
 * /api/v1/verify/otp:
 *   post:
 *     tags:
 *       - Verify user OTP
 *     name: user OTP verification
 *     summary: Verify user otp
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *             otp:
 *               type: integer
 *         required:
 *           - phone
 *           - otp
 *     responses:
 *       '200':
 *         description: User OTP verification successful
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// verify otp 
router.post('/verify/otp', RegisterController.verifyUserOTP);

/**
 * @swagger
 * /api/v1/forgot/password:
 *   post:
 *     tags:
 *       - Forgot Password
 *     name: User Forgot password
 *     summary: Forgot password
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *         required:
 *           - email
 *     responses:
 *       '200':
 *         description: response object
 *       '500':
 *         description: Internal server error
 */
// forgot password
router.post('/forgot/password', LoginController.forgotPassword);

module.exports = router;