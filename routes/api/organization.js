/**
|----------------------------------
| Admin Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const OrganizationController = require('../../controller/OrganizationController');
const {parser} = require('../../middlewares/cloudinary');
const authGuard = require('../../middlewares/authguard');

/**
* @swagger
* /api/v1/organization/register:
*   post:
*     tags:
*       - Organization
*     name: Organization registration
*     summary: Register new organization
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
*             organization_name:
*               type: string
*             address:
*               type: string
*             email:
*               type: string
*             phone:
*               type: string
*             password:
*               type: string
*         required:
*           - organization_name
*           - address
*           - email
*           - phone
*           - password
*     responses:
*       '201':
*         description: Organization registered successfully
*       '203':
*         description: Failed to register organization
*       '403':
*         description: No auth token
*       '500':
*         description: Internl server error
*/
// register organization
router.post("/organization/register", OrganizationController.registerOrganization);


/**
* @swagger
* /api/v1/organization/verify/otp:
*   post:
*     tags:
*       - Organization
*     name: organization OTP verification
*     summary: Verify organization otp
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
*         description: Organization OTP verification successful
*       '403':
*         description: No auth token
*       '500':
*         description: Internl server error
*/
// verify otp
router.post('/organization/verify/otp', OrganizationController.verifyUserOTP);

/**
* @swagger
* /api/v1/organization/driver/register:
*   post:
*     tags:
*       - Organization
*     name: Organization driver registration
*     summary: Register new driver to organization
*     security:
*       - bearerAuth: []
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
*             firstname:
*               type: string
*             lastname:
*               type: string
*             email:
*               type: string
*             phone:
*               type: string
*             password:
*               type: string
*             wake_point_lat:
*               type: string
*             wake_point_lng:
*               type: string
*             dob:
*               type: string
*         required:
*           - firstname
*           - lastname
*           - email
*           - phone
*           - password
*           - wake_point_lat
*           - wake_point_lng
*           - dob
*     responses:
*       '201':
*         description: Driver registered successfully
*       '203':
*         description: Failed to register driver
*       '403':
*         description: No auth token
*       '500':
*         description: Internl server error
*/
// register organization
router.post("/organization/driver/register", authGuard, OrganizationController.organizationRegisterDriver);

/**
 * @swagger
 * /api/v1/organization/drivers:
 *   get:
 *     tags:
 *       - Organization
 *     name: fetch all drivers
 *     summary: fetch all registered organization drivers
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Organization driver records records
 *       '203':
 *         description: Failed to fetch registered organization drivers
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// get all delivery modes
router.get('/organization/drivers', authGuard, OrganizationController.organzationDrivers);

/**
* @swagger
* /api/v1/organization/driver/license/upload/{driver_id}:
*   post:
*     tags:
*       - Organization
*     name: Organization driver license
*     summary: Upload driver license
*     security:
*       - bearerAuth: []
*     produces:
*       - application/json
*     consumes:
*       - application/json
*     parameters:
*       - in: path
*         name: driver_id
*         schema:
*           type: integer
*         required:
*           - driver_id
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             file:
*               type: image
*             delivery_mode:
*               type: string
*             vehicle_brand:
*               type: string
*             vehicle_number:
*               type: string
*             vehicle_year:
*               type: string
*         required:
*           - file
*           - delivery_mode
*           - vehicle_brand
*           - vehicle_number
*           - vehicle_year
*     responses:
*       '201':
*         description: Driver license upload successfully
*       '203':
*         description: Failed to upload driver license
*       '403':
*         description: No auth token
*       '500':
*         description: Internl server error
*/
// register organization
router.post("/organization/driver/license/upload/:driver_id", authGuard, parser.single('file'), OrganizationController.registerDriverLicense);

module.exports = router;