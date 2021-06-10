/**
|----------------------------------
| User Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const UserController = require('../../controller/UserController');
const {parser} = require('../../middlewares/cloudinary');
const authGuard = require('../../middlewares/authguard');

/**
* @swagger
* /api/v1/user/profile:
*   get:
*     tags:
*       - User
*     name: Fetch all user details
*     summary: List user profile details
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: profile object
*       500:
*         description: Internal server error
*/
// get all countries
router.get('/user/profile', authGuard, UserController.getUserProfile);

/**
 * @swagger
 * /api/v1/user/update/profile:
 *   put:
 *     tags:
 *       - User
 *     name: Update User profile
 *     summary: Update the user profile
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
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *         required:
 *           - first_name
 *           - last_name
 *           - phone
 *           - email
 *     responses:
 *       '202':
 *         description: profile updated successfully
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// user updates profile
router.put('/user/update/profile', authGuard, UserController.updateBasicProfile);

/**
 * @swagger
 * /api/v1/user/change/password:
 *   put:
 *     tags:
 *       - User
 *     name: Change User password
 *     summary: Change the user password
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
 *             old_password:
 *               type: string
 *             new_password:
 *               type: string
 *         required:
 *           - old_password
 *           - new_password
 *     responses:
 *       '202':
 *         description: password changed successfully
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// user change password
router.put('/user/change/password', authGuard, UserController.changePassword);

/**
* @swagger
* /api/v1/user/wallet:
*   get:
*     tags:
*       - User
*     name: Fetch all wallet details
*     summary: List all wallet details
*     security:
*       - bearerAuth: []
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Wallet object
*       500:
*         description: Internal server error
*/
// get all countries
router.get('/user/wallet', authGuard, UserController.fetchUserWallet);

/**
 * @swagger
 * /api/v1/user/upload/picture:
 *   put:
 *     tags:
 *       - User
 *     name: Update User profile picture
 *     summary: Update the user profile picture
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
 *             file:
 *               type: imagefile
 *         required:
 *           - file
 *     responses:
 *       '202':
 *         description: profile updated successfully
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
// upload profile picture
router.put("/user/upload/picture",  authGuard, parser.single('file'), UserController.updateProfileImage);

module.exports = router;