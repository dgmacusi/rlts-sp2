var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	getClassrooms : function (cb) {
		var getQuery = 'SELECT * FROM classroom'
		var locationQuery = 'SELECT * FROM location WHERE locationId=?'
		var userQuery = 'SELECT * FROM user WHERE userId=?' 
		var beaconQuery = 'SELECT * FROM beacon WHERE beaconId=?'

		mysqlConnection.query(getQuery, function (err, rows) {
			if (rows.length > 0) {
				rows.forEach(function (row, index) {
					mysqlConnection.query(locationQuery, [row.locationId], function (err, location_row) {
						row.name = location_row[0].name
						mysqlConnection.query(userQuery, [row.userId], function (err, user_row) {
							row.user = user_row[0].lastName + ', ' + user_row[0].firstName
							mysqlConnection.query(beaconQuery, [location_row[0].beaconId], function (err, beacon_row) {
								row.beacon = beacon_row[0].name
								row.beaconId = beacon_row[0].beaconId
								if (index == rows.length-1) {
									return cb(null, rows)
								}

							})
						})
					})		
				})
			} else {
				return cb('There are no classrooms.', null)
			}
		})
	}, 
	getFacilities : function (cb) {
		var getQuery = 'SELECT * FROM facility'
		var locationQuery = 'SELECT * FROM location WHERE locationId=?'
		var userQuery = 'SELECT * FROM user WHERE userId=?' 
		var beaconQuery = 'SELECT * FROM beacon WHERE beaconId=?'

		mysqlConnection.query(getQuery, function (err, rows) {
			if (rows.length > 0) {
				rows.forEach(function (row, index) {
					mysqlConnection.query(locationQuery, [row.locationId], function (err, location_row) {
						row.name = location_row[0].name
						mysqlConnection.query(userQuery, [row.userId], function (err, user_row) {
							row.user = user_row[0].lastName + ', ' + user_row[0].firstName
							mysqlConnection.query(beaconQuery, [location_row[0].beaconId], function (err, beacon_row) {
								row.beacon = beacon_row[0].name
								row.beaconId = beacon_row[0].beaconId
								if (index == rows.length-1) {
									return cb(null, rows)
								}

							})
						})
					})		
				})
			} else {
				return cb('There are no facilities.', null)
			}
		})
	}, 
	addLocation : function (location, cb) {
		var findQuery = 'SELECT * FROM location WHERE name=?'
		var addLocationQuery = 'INSERT INTO location(name, type, beaconId) VALUES(?, ?, ?)'

		mysqlConnection.query(findQuery, [location.name], function (err, rows) {
			if (err) throw err;

			if (err == null && rows.length <= 0) {
				mysqlConnection.query(addLocationQuery, [location.name, location.type, location.beaconId], function (err, res) {
					if (err) throw err;

					if (err) {
						return cb(err, location.name)						
					} else {
						mysqlConnection.query(findQuery, [location.name], function (err, row) {
							if (location.type == 'classroom') {
								var addClassroomQuery = 'INSERT INTO classroom(noOfStudents, gradeLevel, section, userId, locationId) VALUES(?, ?, ?, ?, ?)'
								mysqlConnection.query(addClassroomQuery, [location.noOfStudents, location.gradeLevel, location.section, location.userId, row[0].locationId], function (err, res) {
									if (err) throw err;

									if (err) {
										return cb('Error on adding location', location.name)
									} else {
										return cb(null, location.name)
									}
								})
							} else if (location.type == 'facility') {
								var addFacilityQuery = 'INSERT INTO facility(userId, locationId) VALUES(?, ?)'
								mysqlConnection.query(addFacilityQuery, [location.userId, row[0].locationId], function (err, res) {
									if (err) throw err;

									if (err) {
										return cb('Error on adding location', location.name)
									} else {
										return cb(null, location.name)
									}
								})
							}
						})
					}
				})
			} else {
				return cb('Location name already exists.', location.name)
			}
		})
	}, 
	deleteClassroom : function (locationId, classroomId, cb) {
		var deleteQuery = 'DELETE FROM classroom WHERE classroomId=?'
		var deleteLocationQuery = 'DELETE FROM location WHERE locationId=?'

		mysqlConnection.query(deleteQuery, [classroomId], function (err, res) {
			if (err) throw err;
			mysqlConnection.query(deleteLocationQuery, [locationId], function (err, res) {
				return cb('Deleted classroom ID: ' + classroomId, classroomId)
			})
		})
	}, 
	deleteFacility : function (locationId, facilityId, cb) {
		var deleteQuery = 'DELETE FROM facility WHERE facilityId=?'
		var deleteLocationQuery = 'DELETE FROM location WHERE locationId=?'

		mysqlConnection.query(deleteQuery, [facilityId], function (err, res) {
			if (err) throw err;
			mysqlConnection.query(deleteLocationQuery, [locationId], function (err, res) {
				return cb('Deleted facility ID: ' + facilityId, facilityId)
			})
		})
	}, 
	editClassroom : function (classroomId, classroom, cb) {
		var findQuery = 'SELECT * FROM location WHERE name=? AND locationId<>?'
		var editLocationQuery = 'UPDATE location SET name=?, beaconId=? WHERE locationId=?'

		mysqlConnection.query(findQuery, [classroom.name, classroom.locationId], function (err, rows) {
			if (err) throw err;

			if (err == null && rows.length <= 0) {
				mysqlConnection.query(editLocationQuery, [classroom.name, classroom.beaconId, classroom.locationId], function (err, res) {
					if (err) throw err;
					var editClassroomQuery = 'UPDATE classroom SET noOfStudents=?, gradeLevel=?, section=?, userId=? WHERE classroomId=?'
					mysqlConnection.query(editClassroomQuery, [classroom.noOfStudents, classroom.gradeLevel, classroom.section, classroom.userId, classroomId], function (err, res) {
						return cb(null, classroom.name)
					})
				})
			} else {
				return cb('Location name already exists.', classroom.name)
			}
		})
	}, 
	editFacility : function (facilityId, facility, cb) {
		var findQuery = 'SELECT * FROM location WHERE name=? AND locationId<>?'
		var editLocationQuery = 'UPDATE location SET name=?, beaconId=? WHERE locationId=?'

		mysqlConnection.query(findQuery, [facility.name, facility.locationId], function (err, rows) {
			if (err) throw err;

			if (err == null && rows.length <= 0) {
				mysqlConnection.query(editLocationQuery, [facility.name, facility.beaconId, facility.locationId], function (err, res) {
					if (err) throw err;
					var editFacilityQuery = 'UPDATE facility SET userId=? WHERE facilityId=?'
					mysqlConnection.query(editFacilityQuery, [facility.userId, facilityId], function (err, res) {
						return cb(null, facility.name)
					})
				})
			} else {
				return cb('Location name already exists.', facility.name)
			}
		})
	}
}