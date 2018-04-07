var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	addBeacon : function (beacon, cb) {
		var findQuery = 'SELECT * FROM beacon WHERE name=?'
		
		mysqlConnection.query(findQuery, [beacon.beaconName], function (err, rows) {
			

			if (rows.length > 0) {
				return cb("Beacon already exist.", beacon.beaconName)
			} else {
				var addQuery = 'INSERT INTO beacon (name, advertisingInterval, broadcastPower, minor, major, uuid) VALUES (?, ?, ?, ?, ?, ?)'
				
				console.log(beacon.beaconName)

				var valArray = [beacon.beaconName, beacon.advertisingInterval, beacon.broadcastPower, beacon.beaconMinor, beacon.beaconMajor, beacon.beaconUuid]
				mysqlConnection.query(addQuery, valArray, function (err, res) {
					if (err) throw err
					
					console.log('Beacon added!')
					return cb(null, beacon.beaconName)
				})
			}
		}) 
	}, 
	getBeacons : function (cb) {
		var getQuery = 'SELECT * FROM beacon'
		
		mysqlConnection.query(getQuery, function (err, rows) {
			return cb(null, rows)
		})
	}, 
	deleteBeacon : function (beaconId, cb) {
		var deleteQuery = 'DELETE FROM beacon WHERE beaconId=?'

		mysqlConnection.query(deleteQuery, [beaconId], function (err, res) {
			if (err) throw err;

			return cb('Deleted beacon ID: ' + beaconId, beaconId)
		})
	}, 

	editBeacon : function (beacon, cb) {
		var editQuery = 'UPDATE beacon SET name=?, advertisingInterval=?, broadcastPower=?, minor=?, major=?, uuid=? WHERE beaconId=?'
		
		mysqlConnection.query(editQuery, [beacon.beaconName, beacon.advertisingInterval, beacon.broadcastPower, beacon.beaconMinor, beacon.beaconMajor, beacon.beaconUuid, beacon.beaconId], function (err, res) {
			if (err) throw err;

			console.log('Beacon edited!')
			return cb('Edited beacon ID: ' + beacon.beaconId, beacon.beaconId)
		})
	}, 
	searchBeacons : function (name, cb) {
		var searchQuery = 'SELECT * FROM beacon WHERE name LIKE ?'
		mysqlConnection.query(searchQuery, ['%'+name+'%'], function (err, rows) {
			return cb(null, rows)
		})
	}
}