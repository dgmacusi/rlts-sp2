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
		var findLocationQuery = 'SELECT * FROM location WHERE beaconId=?'
		var deleteClassroomQuery = 'DELETE FROM classroom WHERE locationId=?'
		var deleteFacilityQuery = 'DELETE FROM facility WHERE locationId=?'


		var deleteLocationQuery = 'DELETE FROM location WHERE beaconId=?' 
		var deleteBeaconQuery = 'DELETE FROM beacon WHERE beaconId=?'

		mysqlConnection.query(findLocationQuery, [beaconId], function (err, row) {
			console.log(row)


			if (row[0].type == 'classroom') {
				mysqlConnection.query(deleteClassroomQuery, [row[0].locationId], function (err, res) {
					mysqlConnection.query(deleteLocationQuery, [beaconId], function (err, res) {
						if (err) throw err;


						mysqlConnection.query(deleteBeaconQuery, [beaconId], function (err, res) {
							if (err) throw err;

							return cb('Deleted beacon ID: ' + beaconId, beaconId)
						})
					})
				})
			} else if (row[0].type == 'facility') {
				mysqlConnection.query(deleteFacilityQuery, [row[0].locationId], function (err, res) {
					mysqlConnection.query(deleteLocationQuery, [beaconId], function (err, res) {
						if (err) throw err;


						mysqlConnection.query(deleteBeaconQuery, [beaconId], function (err, res) {
							if (err) throw err;

							return cb('Deleted beacon ID: ' + beaconId, beaconId)
						})
					})
				})
			}
		})
	}, 

	editBeacon : function (beacon, cb) {
		var findQuery = 'SELECT * FROM beacon WHERE name=? AND beaconId<>?'
		var editQuery = 'UPDATE beacon SET name=?, advertisingInterval=?, broadcastPower=?, minor=?, major=?, uuid=? WHERE beaconId=?'
		
		mysqlConnection.query(findQuery, [beacon.beaconName, beacon.beaconId], function (err, rows) {
			if (err || rows.length > 0) {
				return cb("Beacon name already exists.", null)
			}
			else {
				mysqlConnection.query(editQuery, [beacon.beaconName, beacon.advertisingInterval, beacon.broadcastPower, beacon.beaconMinor, beacon.beaconMajor, beacon.beaconUuid, beacon.beaconId], function (err, res) {
					if (err) throw err;

					console.log('Beacon edited!')
					return cb('Edited beacon ID: ' + beacon.beaconId, beacon.beaconId)
				})
			}
		})
	}, 
	searchBeacons : function (name, cb) {
		var searchQuery = 'SELECT * FROM beacon WHERE name LIKE ?'
		mysqlConnection.query(searchQuery, ['%'+name+'%'], function (err, rows) {
			return cb(null, rows)
		})
	}
}