/**
|----------------------------------
| Admin Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const AdminController = require('../../controller/AdminController');
const authGuard = require('../../middlewares/authguard');

/**
 * @swagger
 * /api/v1/delivery/mode/create:
 *   post:
 *     tags:
 *       - Admin
 *     name: Admin create delivery mode
 *     summary: Delivery mode
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
 *             vehicle:
 *               type: string
 *             description:
 *               type: string
 *             max_distance:
 *               type: string
 *         required:
 *           - vehicle
 *           - description
 *           - max_distance
 *     responses:
 *       '201':
 *         description: Delivery mode created successfully
 *       '203':
 *         description: Failed to create delivery mode
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
 // create new delivery mode
router.post("/delivery/mode/create", authGuard, AdminController.createDeliveryMode);

/**
 * @swagger
 * /api/v1/delivery/modes:
 *   get:
 *     tags:
 *       - Admin
 *     name: Admin fetch all delivery modes
 *     summary: Delivery modes
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Delivery modes records
 *       '203':
 *         description: Failed to fetch delivery modes
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// get all delivery modes
router.get('/delivery/modes', authGuard, AdminController.fetchAllDeliveryMode);

/**
* @swagger
* /api/v1/delivery/mode/edit/{delivery_mode_id}:
*   get:
*     tags:
*       - Admin
*     name: List single delivery mode record
*     summary: List only selected delivery mode
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: delivery_mode_id
*         schema:
*           type: integer
*         required:
*           - delivery_mode_id
*     responses:
*       200:
*         description: Single delivery mode object
*       500:
*         description: Internal server error
*/
// edit delivery mode
router.get('/delivery/mode/edit/:delivery_mode_id', authGuard, AdminController.editDeliveryMode);

/**
* @swagger
* /api/v1/delivery/mode/update/{delivery_mode_id}:
*   put:
*     tags:
*       - Admin
*     name: Update single delivery mode record
*     summary: Update only selected delivery mode
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: delivery_mode_id
*         schema:
*           type: integer
*         required:
*           - delivery_mode_id
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             vehicle:
*               type: string
*             description:
*               type: string
*             max_distance:
*               type: string
*         required:
*           - vehicle
*           - description
*           - max_distance
*     responses:
*       200:
*         description: Delivery mode updated successfully
*       203:
*         description: Failed to update delivery mode
*       500:
*         description: Internal server error
*/
// update delivery mode 
router.put('/delivery/mode/update/:delivery_mode_id', authGuard, AdminController.updateDeliveryMode);

/**
* @swagger
* /api/v1/delivery/mode/delete/{delivery_mode_id}:
*   delete:
*     tags:
*       - Admin
*     name: Delete single delivery mode record
*     summary: Delete only selected delivery mode
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: delivery_mode_id
*         schema:
*           type: integer
*         required:
*           - delivery_mode_id
*     responses:
*       200:
*         description: Single delivery mode deleted successfully
*       500:
*         description: Internal server error
*/
// delete delivery mode
router.delete('/delivery/mode/delete/:delivery_mode_id', authGuard, AdminController.deleteDeliveryMode);

/**
 * @swagger
 * /api/v1/delivery/price/create:
 *   post:
 *     tags:
 *       - Admin
 *     name: Admin create delivery price
 *     summary: Delivery price
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
 *             delivery_type:
 *               type: string
 *             delivery_mode_id:
 *               type: integer
 *             km_price:
 *               type: string
 *         required:
 *           - delivery_type
 *           - delivery_mode_id
 *           - km_price
 *     responses:
 *       '201':
 *         description: Delivery price created successfully
 *       '203':
 *         description: Failed to create delivery price
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
 // create new delivery moder
router.post("/delivery/price/create", authGuard, AdminController.createDeliveryPrice);

/**
 * @swagger
 * /api/v1/delivery/prices:
 *   get:
 *     tags:
 *       - Admin
 *     name: Admin fetch all delivery prices
 *     summary: Delivery prices
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Delivery prices records
 *       '203':
 *         description: Failed to fetch delivery prices
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// get all delivery prices
router.get('/delivery/prices', authGuard, AdminController.fetchAllDeliveryPrice);

/**
* @swagger
* /api/v1/delivery/price/edit/{delivery_price_id}:
*   get:
*     tags:
*       - Admin
*     name: List single delivery price record
*     summary: List only selected delivery price
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: delivery_price_id
*         schema:
*           type: integer
*         required:
*           - delivery_price_id
*     responses:
*       200:
*         description: Single delivery price object
*       500:
*         description: Internal server error
*/
// edit delivery price
router.get('/delivery/price/edit/:delivery_price_id', authGuard, AdminController.editDeliveryPrice);

/**
* @swagger
* /api/v1/delivery/price/update/{delivery_price_id}:
*   put:
*     tags:
*       - Admin
*     name: Update single delivery price record
*     summary: Update only selected delivery price
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: delivery_price_id
*         schema:
*           type: integer
*         required:
*           - delivery_price_id
*       - name: body
*         in: body
*         schema:
*           type: object
*           properties:
*             delivery_type:
*               type: string
*             delivery_mode_id:
*               type: integer
*             km_price:
*               type: string
*         required:
*           - delivery_type
*           - delivery_mode_id
*           - km_price
*     responses:
*       200:
*         description: Delivery price updated successfully
*       203:
*         description: Failed to update delivery price
*       500:
*         description: Internal server error
*/
// update delivery price 
router.put('/delivery/price/update/:delivery_mode_id', authGuard, AdminController.updateDeliveryPrice);

/**
* @swagger
* /api/v1/delivery/price/delete/{delivery_price_id}:
*   delete:
*     tags:
*       - Admin
*     name: Delete single delivery price record
*     summary: Delete only selected delivery price
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: delivery_price_id
*         schema:
*           type: integer
*         required:
*           - delivery_price_id
*     responses:
*       200:
*         description: Single delivery price deleted successfully
*       500:
*         description: Internal server error
*/
// delete delivery price
router.delete('/delivery/price/delete/:delivery_price_id', authGuard, AdminController.deleteDeliveryPrice);


/**
* @swagger
* /api/v1/users:
*   get:
*     tags:
*       - Admin
*     name: List all users record
*     summary: List the records of users on the platform
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: users record object
*       500:
*         description: Internal server error
*/
// manage list of users
router.get('/users', authGuard, AdminController.manageUsers);

/**
* @swagger
* /api/v1/admin/organization/register:
*   post:
*     tags:
*       - Organization
*     name: Organization registration
*     summary: Register new organization
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
// admin register organization
router.post("/admin/organization/register", authGuard,  AdminController.adminRegisterOrganisation);

/**
 * @swagger
 * /api/v1/organizations:
 *   get:
 *     tags:
 *       - Admin
 *     name: Admin fetch all 
 *     summary: all registered organizations
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Organization records
 *       '203':
 *         description: Failed to fetch registered organizations
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internl server error
 */
// get all delivery modes
router.get('/organizations', authGuard, AdminController.fetchAllOrganizations);

/**
* @swagger
* /api/v1/organization/status/update/{organization_id}:
*   put:
*     tags:
*       - Admin
*     name: Update single delivery mode record
*     summary: Update only selected delivery mode
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: path
*         name: organization_id
*         schema:
*           type: integer
*         required:
*           - organization_id
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
*       200:
*         description: Organization status updated successfully
*       203:
*         description: Failed to update organization status
*       500:
*         description: Internal server error
*/
// update organization status
router.put('/organization/status/update', authGuard, AdminController.updateOrganizationStatus);

module.exports = router;