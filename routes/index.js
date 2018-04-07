var express = require('express');
var router = express.Router();

var indexController = require(`${__dirname}/../controllers/IndexController`);
var authenticationController = require(`${__dirname}/../controllers/AuthenticationController`);
var beaconController = require(`${__dirname}/../controllers/BeaconController`); 
var locationController = require(`${__dirname}/../controllers/LocationController`);
/* GET home page. */
router.get('/', indexController.getIndexPage)
router.get('/login', indexController.getLoginPage)
router.get('/home', authenticationController.authenticate, indexController.getHomePage)
router.get('/beacons', authenticationController.authenticate, beaconController.getBeaconPage)
router.get('/location/classroom', authenticationController.authenticate, locationController.getClassroomPage)
router.get('/location/facility', authenticationController.authenticate, locationController.getFacilityPage)
router.get('/timelogs', authenticationController.authenticate, indexController.getTimelogPage)
router.get('/users', authenticationController.authenticate, indexController.getUserPage)
router.get('/beacons/add', authenticationController.authenticate, indexController.getAddBeaconPage)
router.get('/signout', authenticationController.authenticate, authenticationController.signout)

router.post('/login', authenticationController.login, indexController.getHomePageOnLogin)

router.post('/beacons/add', authenticationController.authenticate, beaconController.addBeacon)
router.post('/beacons/delete/:id', authenticationController.authenticate, beaconController.deleteBeacon)
router.post('/beacon/edit/:id', authenticationController.authenticate, beaconController.editBeacon)
router.post('/beacons/edit', authenticationController.authenticate, beaconController.getEditBeaconPage)
router.post('/beacons/search', authenticationController.authenticate, beaconController.searchBeacons)

router.get('/location/add', authenticationController.authenticate, locationController.getAddLocationPage)

router.post('/location/add', authenticationController.authenticate, locationController.addLocation)
router.post('/classroom/delete/:id', authenticationController.authenticate, locationController.deleteClassroom)
router.post('/facility/delete/:id', authenticationController.authenticate, locationController.deleteFacility)
router.post('/classroom/search', authenticationController.authenticate, locationController.searchClassroom)
router.post('/facility/search', authenticationController.authenticate, locationController.searchFacility)
router.post('/classroom/edit', authenticationController.authenticate, locationController.getEditClassroomPage)
router.post('/classroom/edit/:id', authenticationController.authenticate, locationController.editClassroom)
router.post('/facility/edit', authenticationController.authenticate, locationController.getEditFacilityPage)
router.post('/facility/edit/:id', authenticationController.authenticate, locationController.editFacility)

module.exports = router;
