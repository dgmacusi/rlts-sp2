var Location = require(`${__dirname}/../models/Location`) 
var Beacon = require(`${__dirname}/../models/Beacon`);
var User = require(`${__dirname}/../models/User`);

module.exports = {
	getLocationPage : function (req, res, next) {
		res.render('locations', { title : "MyApp" })
	},
	getClassroomPage : function (req, res, next) {
		Location.getClassrooms(function (err, classrooms) {
			console.log(classrooms)
			res.render('location-classroom', { title : "MyApp" , classrooms : classrooms })
		})
	},
	getFacilityPage : function (req, res, next) {
		Location.getFacilities(function (err, facilities) {
			res.render('location-facility', { title : "MyApp" , facilities : facilities })
		})
	}, 
	getAddLocationPage : function (req, res, next) {
		Beacon.getBeacons(function (err, beacons) {
			User.getAllStaff(function (err, staff) {
				res.render('location-add', { title : "MyApp" , beacons : beacons, staff : staff })
			})
		})
	}, 
	addLocation : function (req, res, next) {
		Location.addLocation(req.body, function (err, location) {
			if (err) {
				console.log('Unable to add location ' + location + '. Error: ' + err)
				res.redirect('/location/'+req.body.type)
			} else {
				console.log('Location added. Location name: ' + location)
				res.redirect('/location/'+req.body.type)
			}
		})
	}, 
	deleteClassroom : function (req, res, next) {
		Location.deleteClassroom(req.body.locationId, req.params.id, function (statement, result) {
			console.log(statement)
			res.redirect('/location/classroom')
		})
	},
	deleteFacility : function (req, res, next) {
		Location.deleteFacility(req.body.locationId, req.params.id, function (statement, result) {
			console.log(statement)
			res.redirect('/location/facility')
		})
	}, 
	searchClassroom : function (req, res, next) {
		Location.getClassrooms(function (err, classrooms) {
			var myArray = classrooms
			if (classrooms) {
				myArray = classrooms.filter(function(classroom) {
				    return classroom.name.toLowerCase().indexOf(req.body.search.toLowerCase()) != -1;
				});
			}
			res.render('location-classroom', { title : "MyApp", classrooms : myArray })
		})
	},
	searchFacility : function (req, res, next) {
		Location.getFacilities(function (err, facilities) {
			var myArray = facilities
			if (facilities) {
				myArray = facilities.filter(function(facility) {
				    return facility.name.toLowerCase().indexOf(req.body.search.toLowerCase()) != -1;
				});
			}
			res.render('location-facility', { title : "MyApp", facilities : myArray })
		})
	}, 
	getEditClassroomPage : function (req, res, next) {
		var classroom = {
			classroomId : req.body.classroomId, 
			noOfStudents : req.body.noOfStudents, 
			gradeLevel : req.body.gradeLevel, 
			section : req.body.section, 
			userId : req.body.userId, 
			locationId : req.body.locationId, 
			beaconId : req.body.beaconId, 
			user : req.body.user, 
			beacon : req.body.beacon, 
			name : req.body.name
		}

		Beacon.getBeacons(function (err, beacons) {
			User.getAllStaff(function (err, staff) {
				res.render('classroom-edit', { title : "MyApp" , beacons : beacons, staff : staff, classroom : classroom })
			})
		})
	}, 
	editClassroom : function (req, res, next) {
		Location.editClassroom(req.params.id, req.body, function (err, location) {
			if (err) {
				console.log('Unable to edit location ' + location + '. Error: ' + err)
				res.redirect('/location/'+req.body.type)
			} else {
				console.log('Location edited. Location name: ' + location)
				res.redirect('/location/'+req.body.type)
			}
		})
	},
	getEditFacilityPage : function (req, res, next) {
		var facility = {
			facilityId : req.body.facilityId,
			userId : req.body.userId, 
			locationId : req.body.locationId, 
			beaconId : req.body.beaconId, 
			user : req.body.user, 
			beacon : req.body.beacon, 
			name : req.body.name
		}

		console.log(facility)

		Beacon.getBeacons(function (err, beacons) {
			User.getAllStaff(function (err, staff) {
				res.render('facility-edit', { title : "MyApp" , beacons : beacons, staff : staff, facility : facility })
			})
		})
	}, 
	editFacility : function (req, res, next) {
		Location.editFacility(req.params.id, req.body, function (err, location) {
			if (err) {
				console.log('Unable to edit location ' + location + '. Error: ' + err)
				res.redirect('/location/'+req.body.type)
			} else {
				console.log('Location edited. Location name: ' + location)
				res.redirect('/location/'+req.body.type)
			}
		})
	} 
}