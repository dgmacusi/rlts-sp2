var express = require('express');
var router = express.Router();

var indexController = require(`${__dirname}/../controllers/IndexController`);
var authenticationController = require(`${__dirname}/../controllers/AuthenticationController`);
var beaconController = require(`${__dirname}/../controllers/BeaconController`); 
var locationController = require(`${__dirname}/../controllers/LocationController`);
var userController = require(`${__dirname}/../controllers/userController`);
var webApiController = require(`${__dirname}/../controllers/webApiController`);
var timelogController = require(`${__dirname}/../controllers/TimelogController`);
var dashboardController = require(`${__dirname}/../controllers/DashboardController`);

/* GET home page. */
router.get('/', indexController.getIndexPage)
router.get('/login', indexController.getLoginPage)
router.get('/beacons', authenticationController.authenticate, beaconController.getBeaconPage)
router.get('/location/classroom', authenticationController.authenticate, locationController.getClassroomPage)
router.get('/location/facility', authenticationController.authenticate, locationController.getFacilityPage) 
router.get('/users/administrator', authenticationController.authenticate, userController.getAdministratorPage)
router.get('/users/student', authenticationController.authenticate, userController.getStudentPage)
router.get('/users/teacher', authenticationController.authenticate, userController.getTeacherPage)
router.get('/users/nonteaching', authenticationController.authenticate, userController.getStaffPage)
router.get('/timelogs', authenticationController.authenticate, timelogController.getTimelogPage)
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

router.get('/users/administrator/add', authenticationController.authenticate, userController.getAddAdministratorPage)

router.post('/users/administrator/search', authenticationController.authenticate, userController.searchAdministrators)
router.post('/users/administrator/add', authenticationController.authenticate, userController.addAdministrator)
router.post('/users/administrator/delete/:id', authenticationController.authenticate, userController.deleteAdministrator)
router.post('/users/administrator/edit', authenticationController.authenticate, userController.getEditAdministratorPage)
router.post('/users/administrator/edit/:id', authenticationController.authenticate, userController.editAdministrator)

router.get('/users/student/add', authenticationController.authenticate, userController.getAddStudentPage)

router.post('/users/student/search', authenticationController.authenticate, userController.searchStudents)
router.post('/users/student/add', authenticationController.authenticate, userController.addStudent)
router.post('/users/student/delete/:id', authenticationController.authenticate, userController.deleteStudent)
router.post('/users/student/edit', authenticationController.authenticate, userController.getEditStudentPage)
router.post('/users/student/edit/:id', authenticationController.authenticate, userController.editStudent)

router.get('/users/teacher/add', authenticationController.authenticate, userController.getAddTeacherPage)

router.post('/users/teacher/search', authenticationController.authenticate, userController.searchTeachers)
router.post('/users/teacher/add', authenticationController.authenticate, userController.addTeacher)
router.post('/users/teacher/delete/:id', authenticationController.authenticate, userController.deleteTeacher)
router.post('/users/teacher/edit', authenticationController.authenticate, userController.getEditTeacherPage)
router.post('/users/teacher/edit/:id', authenticationController.authenticate, userController.editTeacher)

router.get('/users/nonteachingstaff/add', authenticationController.authenticate, userController.getAddStaffPage)
	
router.post('/users/nonteachingstaff/search', authenticationController.authenticate, userController.searchStaff)
router.post('/users/nonteachingstaff/add', authenticationController.authenticate, userController.addStaff)
router.post('/users/nonteachingstaff/delete/:id', authenticationController.authenticate, userController.deleteStaff)
router.post('/users/nonteachingstaff/edit', authenticationController.authenticate, userController.getEditStaffPage)
router.post('/users/nonteachingstaff/edit/:id', authenticationController.authenticate, userController.editStaff)


router.get('/timelogs/add', authenticationController.authenticate, timelogController.getAddTimelogPage)

router.post('/timelogs/add', authenticationController.authenticate, timelogController.addTimelog)
router.post('/timelogs/delete/:id', authenticationController.authenticate, timelogController.deleteTimelog)
router.post('/timelogs/search', authenticationController.authenticate, timelogController.searchTimelog)

// Dashboard Controller
router.get('/home', authenticationController.authenticate, dashboardController.getHomePage)
router.get('/dashboard/systemactivity', dashboardController.getSystemActivity)
router.get('/dashboard/locationactivity', dashboardController.getLocationActivity)
router.get('/dashboard/heatmap', dashboardController.getHeatmap)
router.get('/dashboard/toplocations', dashboardController.getTopLocations)
router.post('/dashboard/systemactivity2', dashboardController.getSystemActivity2)
router.post('/dashboard/locationactivity2', dashboardController.getLocationActivity2)
router.post('/dashboard/toplocations2', dashboardController.getTopLocations2)

// Web API controller
router.get('/getAllBeacons/web', webApiController.getAllBeacons)
router.get('/getAllNotifications/web', webApiController.getAllNotifications)
router.post('/login/web', webApiController.login)
router.post('/addTimelog/web', webApiController.addTimelog)
router.post('/getStudentTeacherTimelog/web', webApiController.getStudentTeacherTimelog)
router.post('/getClassroomTimelog/web', webApiController.getClassroomTimelog)
router.post('/getFacilityTimelog/web', webApiController.getFacilityTimelog)
router.post('/sendNotification/web', webApiController.addNotification)


module.exports = router;
