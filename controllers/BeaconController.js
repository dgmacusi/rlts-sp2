var Beacon = require(`${__dirname}/../models/Beacon`);

module.exports = {
	addBeacon  : function (req, res, next) {		
		Beacon.addBeacon(req.body, function (err, beacon) {
			if (err) {
				console.log('Unable to add beacon. Error: ' + err)
				res.redirect('/beacons')
			} else {
				console.log('Beacon added. Beacon name: ' + beacon)
				res.redirect('/beacons')
			}
		})
	}, 
	getBeaconPage : function (req, res, next) {
		Beacon.getBeacons(function (err, beacons) {
			res.render('beacons', { title : "MyApp" , beacons : beacons})
		})
	},

	deleteBeacon : function (req, res, next) {
		Beacon.deleteBeacon(req.params.id, function (statement, result) {
			console.log(statement)
			res.redirect('/beacons')
		})
	}, 
	editBeacon : function (req, res, next) {
		Beacon.editBeacon(req.body, function (statement, result) {
			console.log(statement)
			res.redirect('/beacons')
		})
	}, 
	getEditBeaconPage : function (req, res, next) {
		var beacon = {
			uuid : req.body.uuid, 
			minor : req.body.minor, 
			major : req.body.major, 
			advertisingInterval : req.body.advertisingInterval, 
			broadcastPower : req.body.broadcastPower, 
			beaconId : req.body.beaconId, 
			name : req.body.name
		}

		res.render('beacon-edit', { title : "MyApp", beacon : beacon })
	}, 
	searchBeacons : function (req, res, next) {
		Beacon.searchBeacons(req.body.search, function (err, beacons) {
			res.render('beacons', { title : "MyApp" , beacons : beacons})
		})
	}

}