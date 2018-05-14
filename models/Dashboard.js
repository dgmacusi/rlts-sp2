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
	}
}