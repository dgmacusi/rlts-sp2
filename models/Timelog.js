var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	addTimelog : function (timelog, cb) {
		var addQuery = 'INSERT INTO timelog (time, date, entryType, locationId, userId, locationName, username) VALUES (?, ?, ?, ?, ?, ?, ?)'
		var searchLocation = 'SELECT * FROM location WHERE name=?' 
		var searchUser = 'SELECT * FROM user WHERE username=?'

		var locationId = null 
		var userId = null

		mysqlConnection.query(searchLocation, [timelog.locationName], function (err, location_row) {
			if (location_row[0] != null && location_row[0] != undefined) {
				locationId = location_row[0].locationId
			} else {
				locationId = null
			}

			mysqlConnection.query(searchUser, [timelog.username], function (err, user_row) {
				if (user_row[0] != null && user_row[0] != undefined) {
					userId = user_row[0].userId
				} else {
					userId = null
				}

				console.log(timelog)

				mysqlConnection.query(addQuery, [timelog.time, timelog.date, timelog.entryType, locationId, userId, timelog.locationName, timelog.username], function (err, res) {
					if (err) throw err
					
					console.log('Timelog added!')
					return cb(null, userId)
				})
			})
		})
	}
}