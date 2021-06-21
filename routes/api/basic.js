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

// get all countries
router.get('/countries', BasicController.getCountries);

// get specific state
router.get('/countries/state/:id', BasicController.getSpecificStates);

// get nigeria  states
router.get('/nigeria/state', BasicController.getStates);

// get nigeria  states
router.get('/states', BasicController.getMobileStates);

// get lga 
router.get('/lga/:id', BasicController.getLga);

router.get('/lga/state/:id', BasicController.getLgaState);

router.get('/state/lga', BasicController.getStateWithLgas);

// user view events
router.get('/view/events',  BasicController.fetchEvents);

// user view sermon
router.get('/view/sermons',  BasicController.fetchSermons);

// user view preachings
router.get('/view/preachings',  BasicController.fetchPreachings);

// login user 
router.post('/login', LoginController.loginUser);

// register user 
router.post('/register', RegisterController.registerUser);

// user forgot password
router.post('/forgot/password', LoginController.forgotPassword);

module.exports = router;