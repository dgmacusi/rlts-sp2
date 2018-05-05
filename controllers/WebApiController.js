var User = require(`${__dirname}/../models/User`);
var Beacon = require(`${__dirname}/../models/Beacon`);
var Timelog = require(`${__dirname}/../models/Timelog`);
var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	login : function (req, res, next) {
		console.log(req.body)
		var user = {
			username : req.body.username,
			password : req.body.password
		}
		
		User.authenticateUser(user, function (err, user) {
			if (err) {
				console.log(err)
				res.json({ user : {
					username : null,
					type : null, 
					authenticated : false
				}})
			} else {
				res.json({ user : {
					username : user.username, 
					type : user.type,
					authenticated : true
				}})
			}
		})


	}, 
	getAllBeacons : function (req, res, next) {
		var getQuery = 'SELECT * FROM beacon'
		var getLocationQuery = 'SELECT * FROM location WHERE beaconId=?'

		var beaconArray = []

		mysqlConnection.query(getQuery, function (err, beacons) {
			beacons.forEach(function (beacon, index) {
				mysqlConnection.query(getLocationQuery, [beacon.beaconId], function (err, location) {
					if (location[0] != undefined && location[0] != null) {
						beacon.locationName = location[0].name
						beacon.type = location[0].type
						beacon.locationId = location[0].locationId
					} else {
						beacon.locationName = "NA"
						beacon.type = "NA"
						beacon.locationId = "NA"
					}

					var b = {
						locationName : beacon.locationName, 
						beaconName : beacon.name, 
						uuid : beacon.uuid, 
						minor : beacon.minor, 
						major : beacon.major, 
						type : beacon.type, 
						locationId : beacon.locationId
					}

					beaconArray.push(b)

					if (index == beacons.length-1) {
						console.log(beaconArray)
						res.json({ beaconArray : beaconArray })
					}
				})
			}) 
		})
	}, 
	addTimelog : function (req, res, next) {
		Timelog.addTimelog(req.body, function (err, user) {
			if (err) throw err;
			res.json({ success : true })
		})
	}, 
	getStudentTeacherTimelog : function (req, res, next) {
		Timelog.getStudentTeacherTimelog(req.body, function (err, timelogArray) {
			res.json({ timelogArray : timelogArray })
		})
	}, 
	getClassroomTimelog : function (req, res, next) {
		Timelog.getClassroomTimelog(req.body, function (err, timelogArray) {
			res.json({ timelogArray : timelogArray })
		})
	},
	getFacilityTimelog : function (req, res, next) {
		Timelog.getFacilityTimelog(req.body, function (err, timelogArray) {
			res.json({ timelogArray : timelogArray })
		})
	}
}
