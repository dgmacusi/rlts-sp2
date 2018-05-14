var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();

module.exports = {
	getTopStatistics : function (cb) {

		var studentQuery = 'SELECT COUNT(userId) FROM user WHERE type="student";'
		var teacherQuery = 'SELECT COUNT(userId) FROM user WHERE type="teacher";'
		var administratorQuery = 'SELECT COUNT(userId) FROM user WHERE type="administrator";'
		var nonteachingstaffQuery = 'SELECT COUNT(userId) FROM user WHERE type="nonteachingstaff";'
		var classroomQuery = 'SELECT COUNT(locationId) FROM user WHERE type="classroom";'
		var facilityQuery = 'SELECT COUNT(locationId) FROM user WHERE type="facility";'

		var studentSize = ''
		var adminSize = ''
		var teacherSize = ''
		var nonSize = ''
		var facilitySize = ''
		var classroomSize = ''

		mysqlConnection.query(studentQuery, function (err, students) {
			if (students) {
				studentSize = students.length;
			} else {
				studentSize = 0;
			}
			console.log('Students: ' + studentSize)

			mysqlConnection.query(teacherQuery, function (err, teachers) {
				if (teachers) {
					teacherSize = teachers.length;
				} else {
					teacherSize = 0;
				}
				console.log('Teachers: ' + teacherSize)

				mysqlConnection.query(administratorQuery, function (err, admins) {
					if (admins) {
						adminSize = admins.length;
					} else {
						adminSize = 0;
					}
					console.log('Admins: ' + adminSize)

					mysqlConnection.query(nonteachingstaffQuery, function (err, nons) {
						if (nons) {
							nonSize = nons.length;
						} else {
							nonSize = 0;
						}
						console.log('Non: ' + nonSize)

						mysqlConnection.query(classroomQuery, function (err, classrooms) {
							if (classrooms) {
								classroomSize = classrooms.length;
							} else {
								classroomSize = 0;
							}
							console.log('Classrooms: ' + classroomSize)

							mysqlConnection.query(facilityQuery, function (err, facilities) {
								if (facilities) {
									facilitySize = facilities.length;
								} else {
									facilitySize = 0;
								}
								console.log('Facilities: ' + facilitySize)

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
								console.log(statistics)

								return cb(null, statistics)


							})
						})
					})
				})
			})
		})
	}
}