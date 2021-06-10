/**
|----------------------------------
| Admin Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const AdminController = require('../../controller/AdminController');
const authGuard = require('../../middlewares/authguard');

router.post('/admin/create/church/unit', authGuard, AdminController.createChurchUnit);

router.get('/admin/view/church/units', authGuard, AdminController.fetchAllChurchUnit);

// edit church unit
router.get('/admin/edit/church/unit/:church_unit_id', authGuard, AdminController.editChurchUnit);

// update church unit
router.put('/admin/update/church/unit/:church_unit_id', authGuard, AdminController.updateChurchUnit);

// delete church unit
router.delete('/admin/delete/church/unit/:church_unit_id', authGuard, AdminController.deleteChurchUnit);

router.post('/admin/create/user', authGuard, AdminController.createUser);

router.get('/admin/view/users', authGuard, AdminController.fetchAllMembers);

// edit members
router.get('/admin/edit/user/:member_id', authGuard, AdminController.editMember);

// suspend church member
router.put('/admin/suspend/user/:member_id', authGuard, AdminController.suspendMember);

router.post('/admin/create/event', authGuard, parser.single('file'), AdminController.createEvents);

// fetch members counselling requests
router.get('/admin/view/counselling/request', authGuard, AdminController.fetchMemberCounsellingRequest);

// Give feedback on counsel requests
router.post('/admin/feedback-to/counsel/request', authGuard, AdminController.counselMembers);


module.exports = router;