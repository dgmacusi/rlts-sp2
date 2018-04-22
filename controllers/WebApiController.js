var User = require(`${__dirname}/../models/User`);
var Beacon = require(`${__dirname}/../models/Beacon`);

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
	, 
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
					} else {
						beacon.locationName = "NA"
						beacon.type = "NA"
					}

					var b = {
						locationName : beacon.locationName, 
						beaconName : beacon.name, 
						uuid : beacon.uuid, 
						minor : beacon.minor, 
						major : beacon.major, 
						type : beacon.type
					}

					beaconArray.push(b)

					if (index == beacons.length-1) {
						return res.json({ beaconArray : beaconArray })
					}
				})
			}) 
		})
	}
}
