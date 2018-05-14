var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	getTopStatistics : function (cb) {

		var studentQuery = 'SELECT COUNT(userId) AS count FROM user WHERE type="student";'
		var teacherQuery = 'SELECT COUNT(userId) AS count FROM user WHERE type="teacher";'
		var administratorQuery = 'SELECT COUNT(userId) AS count FROM user WHERE type="administrator";'
		var nonteachingstaffQuery = 'SELECT COUNT(userId) AS count FROM user WHERE type="nonteachingstaff";'
		var classroomQuery = 'SELECT COUNT(locationId) AS count FROM location WHERE type="classroom";'
		var facilityQuery = 'SELECT COUNT(locationId) AS count FROM location WHERE type="facility";'

		var studentSize = 0
		var adminSize = 0
		var teacherSize = 0
		var nonSize = 0
		var facilitySize = 0
		var classroomSize = 0

		mysqlConnection.query(studentQuery, function (err, students) {
			if (students[0] != null && students[0] != undefined) {
				studentSize = students[0].count;
			}

			mysqlConnection.query(teacherQuery, function (err, teachers) {
				if (teachers[0] != null && teachers[0] != undefined) {
					teacherSize = teachers[0].count;
				}

				mysqlConnection.query(administratorQuery, function (err, admins) {
					if (admins[0] != null && admins[0] != undefined) {
						adminSize = admins[0].count;
					}

					mysqlConnection.query(nonteachingstaffQuery, function (err, nons) {
						if (nons[0] != null && nons[0] != undefined) {
							nonSize = nons[0].count;
						}

						mysqlConnection.query(classroomQuery, function (err, classrooms) {
							if (classrooms[0] != null && classrooms[0] != undefined) {
								classroomSize = classrooms[0].count;
							}

							mysqlConnection.query(facilityQuery, function (err, facilities) {
								if (facilities[0] != null && facilities[0] != undefined) {
									facilitySize = facilities[0].count;
								}

								var statistics = {
									studentSize : studentSize, 
									teacherSize : teacherSize, 
									adminSize : adminSize, 
									nonSize : nonSize, 
									classroomSize : classroomSize, 
									facilitySize : facilitySize, 
									locationSize : classroomSize + facilitySize, 
									userSize : studentSize + teacherSize + adminSize + nonSize
								}

								return cb(null, statistics)


							})
						})
					})
				})
			})
		})
	}, 
	getSystemActivity : function (fromDate, toDate, cb) {
		var query = 'SELECT COUNT(*) AS count FROM timelog WHERE DATE(date)=?' 
		var categories = []
		var values = []

		var from = new Date(fromDate.split('-')[0], parseInt(fromDate.split('-')[1]) - 1, fromDate.split('-')[2])
		var to = new Date(toDate.split('-')[0], parseInt(toDate.split('-')[1]) - 1, toDate.split('-')[2])
		var now = new Date();
		var daysOfYear = [];


		for (var d = from; d <= to; d.setDate(d.getDate() + 1)) {
		    categories.push(new Date(d).getFullYear() + '-' + (new Date(d).getMonth() + 1) + '-' + new Date(d).getDate());
		}

		categories.forEach(function (row, index) {
			mysqlConnection.query(query, [row], function (err, logs) {
				if (logs[0] != null && logs[0] != undefined) {
					values.push(logs[0].count)
				}

				if (index == categories.length-1) {
					return cb(null, { categories : categories , values : values })
				}
			})
		})

	}, 
	getLocationActivity : function (fromDate, toDate, cb) {
		var facilityQuery = 'SELECT * FROM location WHERE type="facility"'
		var selectQuery = 'SELECT COUNT(*) AS count FROM timelog WHERE locationId=? AND date BETWEEN ? AND ?'

		var from = new Date(fromDate.split('-')[0], parseInt(fromDate.split('-')[1]) - 1, fromDate.split('-')[2])
		var to = new Date(toDate.split('-')[0], parseInt(toDate.split('-')[1]) - 1, toDate.split('-')[2])
		var data = []

		mysqlConnection.query(facilityQuery, function (err, rows) {
			if (rows.length > 0) {
				rows.forEach(function (row, index) {
					mysqlConnection.query(selectQuery, [row.locationId, from, to], function (err, count) {
						if (count[0] != null && count[0] != undefined) {
							data.push({y : count[0].count, name : row.name})
						}
						else {
							data.push({y : 0, name : row.name})
						}

						if (index == rows.length-1) {
							return cb(null, { data : data })
						}
					})
				})
			} else {
				return cb("No data.", null)
			}
		})
	}
	
}