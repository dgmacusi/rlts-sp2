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
	}, 

	addOneTimelog : function (timelog, cb) {
		var addQuery = 'INSERT INTO timelog (time, date, entryType, locationId, userId, locationName, username) VALUES (?, ?, ?, ?, ?, ?, ?)'
	
		console.log(timelog.userId)
		console.log(timelog.locationId)


		var user = JSON.parse(timelog.userId)
		var location = JSON.parse(timelog.locationId)



		mysqlConnection.query(addQuery, [timelog.time, timelog.date, timelog.entryType, location.locationId, user.userId, location.locationName, user.username], function (err, res) {
			if (err) throw err
			
			console.log('Timelog added!')
			return cb(null, timelog)
		})
	},

	getTimelogs : function (cb) {
		var getQuery = 'SELECT * FROM timelog ORDER BY date DESC'
		var getUserQuery = 'SELECT * FROM user WHERE username=?'

		mysqlConnection.query(getQuery, function (err, rows) {
			if (rows.length > 0) {
				rows.forEach(function (row, index) {
					var dateString = row.date
					dateString = new Date(dateString).toUTCString();
					dateString = dateString.split(' ').slice(0, 4).join(' ')
					row.date = dateString

					mysqlConnection.query(getUserQuery, [row.username], function (err, user_row) {
						if (user_row[0] != null && user_row[0] != undefined) {
							row.fullName = user_row[0].lastName + ", " + user_row[0].firstName
						} else {
							row.fullName = "NA"
						}

						if (index == rows.length-1) {
							return cb(null, rows)
						}
					})
				})
			} else {
				return cb('No timelogs', null)
			}
		})
	}, 
	deleteTimelog : function (timelogId, cb) {
		var deleteTimelogQuery = 'DELETE FROM timelog WHERE timelogId=?'
		mysqlConnection.query(deleteTimelogQuery, [timelogId], function (err, res) {
			if (err) throw err;

			return cb(null, timelogId)
		})
	}, 
	searchTimelog : function (search, cb) {
		var searchQuery = 'SELECT * FROM timelog WHERE date BETWEEN ? AND ? ORDER BY date DESC'
		var userQuery = 'SELECT * FROM user WHERE userId=?'
		var locationQuery = 'SELECT * FROM location WHERE locationId=?'
		var jsonArray = []

		console.log(search.fromDate + search.toDate+search.search)

		mysqlConnection.query(searchQuery, [search.fromDate, search.toDate], function (err, rows) {
			if (rows.length) {
				console.log(rows.length+ " LENGTH")
				rows.forEach(function (row, index) {
					mysqlConnection.query(userQuery, [row.userId], function (err, user_row) {
						if (user_row[0] != null && user_row[0] != undefined) {
							if (user_row[0].firstName.toLowerCase().indexOf(search.search.toLowerCase()) != -1 || user_row[0].lastName.toLowerCase().indexOf(search.search.toLowerCase()) != -1 || user_row[0].username.toLowerCase().indexOf(search.search.toLowerCase()) != -1) {
								var dateString = row.date
								dateString = new Date(dateString).toUTCString();
								dateString = dateString.split(' ').slice(0, 4).join(' ')
								row.date = dateString
								row.fullName = user_row[0].lastName + ', ' + user_row[0].firstName

								jsonArray.push(row)
							} else if (row.locationName.toLowerCase().indexOf(search.search.toLowerCase()) != -1) {
								var dateString = row.date
								dateString = new Date(dateString).toUTCString();
								dateString = dateString.split(' ').slice(0, 4).join(' ')
								row.date = dateString
								row.fullName = user_row[0].lastName + ', ' + user_row[0].firstName

								jsonArray.push(row)
							}
						}

						if (index == rows.length-1) {
							return cb(null, jsonArray)
						}
					})
				})
			} else {
				return cb('No timelogs found', null)
			}
		})
	}, 
	getStudentTeacherTimelog : function (search, cb) {
		var searchQuery = 'SELECT * FROM timelog WHERE DATE(date)=? ORDER BY time DESC'
		var studentQuery = 'SELECT * FROM student WHERE userId=? AND studentNumber=?'
		var teacherQuery = 'SELECT * FROM teacher WHERE userId=? AND employeeNumber=?'
		var staffQuery = 'SELECT * FROM nonteachingstaff WHERE userId=? AND employeeNumber=?'
		var adminQuery = 'SELECT * FROM administrator WHERE userId=? AND employeeNumber=?'
		var userQuery = 'SELECT * FROM user WHERE userId=?'
		var jsonArray = []

		console.log(search)


		mysqlConnection.query(searchQuery, [search.date], function (err, rows) {
			if (rows.length) {
				rows.forEach(function (row, index) {

					mysqlConnection.query(userQuery, [row.userId], function (err, user_row) {
						if (user_row[0] != null && user_row[0] != undefined) {
							row.fullName = user_row[0].lastName + ', ' + user_row[0].firstName
						}
						mysqlConnection.query(studentQuery, [row.userId, search.studentTeacherNo], function (err, student_row) {
							if (student_row[0] != null && student_row[0] != undefined) {
								var dateString = row.date
								dateString = new Date(dateString).toString();
								dateString = dateString.split(' ').slice(0, 4).join(' ')
								row.date = dateString

								jsonArray.push(row)
							}

							mysqlConnection.query(teacherQuery, [row.userId, search.studentTeacherNo], function (err, teacher_row) {
								if (teacher_row[0] != null && teacher_row[0] != undefined) {
									var dateString = row.date
									dateString = new Date(dateString).toString();
									dateString = dateString.split(' ').slice(0, 4).join(' ')
									row.date = dateString

									jsonArray.push(row)
								}
								mysqlConnection.query(staffQuery, [row.userId, search.studentTeacherNo], function (err, staff_row) {
									if (staff_row[0] != null && staff_row[0] != undefined) {
										var dateString = row.date
										dateString = new Date(dateString).toString();
										dateString = dateString.split(' ').slice(0, 4).join(' ')
										row.date = dateString

										jsonArray.push(row)
									}
									mysqlConnection.query(adminQuery, [row.userId, search.studentTeacherNo], function (err, admin_row) {
										if (admin_row[0] != null && admin_row[0] != undefined) {
											var dateString = row.date
											dateString = new Date(dateString).toString();
											dateString = dateString.split(' ').slice(0, 4).join(' ')
											row.date = dateString
											jsonArray.push(row)

										}

										if (index == rows.length-1) {
											console.log(jsonArray)
											return cb(null, jsonArray)
										}
									})
								})
							})
						})
					})
				})
			} else {
				return cb('No timelogs found', null)
			}
		})
	}, 
	getClassroomTimelog : function (search, cb) {
		var searchQuery = 'SELECT * FROM timelog WHERE DATE(date)=? ORDER BY time DESC'
		var classroomQuery = 'SELECT * FROM classroom WHERE locationId=?'
		var userQuery = 'SELECT * FROM user WHERE userId=?'
		var jsonArray = []

		mysqlConnection.query(searchQuery, [search.date], function (err, rows) {
			if (rows.length) {
				rows.forEach(function (row, index) {
					mysqlConnection.query(classroomQuery, [row.locationId], function (err, classroom_row) {
						console.log(classroom_row.length)
						
						if (classroom_row[0] != null && classroom_row[0] != undefined && classroom_row[0].gradeLevel == parseInt(search.gradeLevel) && classroom_row[0].section == search.section) {
							var dateString = row.date
							dateString = new Date(dateString).toString();
							dateString = dateString.split(' ').slice(0, 4).join(' ')
							row.date = dateString
							
							mysqlConnection.query(userQuery, [row.userId], function (err, user_row) {
								if (user_row[0] != null && user_row[0] != undefined) {
									row.fullName = user_row[0].lastName + ", " + user_row[0].firstName 
								} else {
									row.fullName = 'NA'
								}

								jsonArray.push(row)

								if (index == rows.length-1) {
									console.log(jsonArray)
									console.log(rows.length)
									console.log(rows)
									return cb(null, jsonArray)
								}
							})
						} else if (index == rows.length-1) {
							console.log(jsonArray)
							console.log(rows.length)
							console.log(rows)
							return cb(null, jsonArray)
						}
					})
				})
			} else {
				return cb('No timelogs found', null)
			}
		})
	}, 
	getFacilityTimelog : function (search, cb) {
		var searchQuery = 'SELECT * FROM timelog WHERE date=? ORDER BY time DESC'
		var facilityQuery = 'SELECT * FROM location WHERE locationId=?'
		var userQuery = 'SELECT * FROM user WHERE userId=?'
		var jsonArray = []

		mysqlConnection.query(searchQuery, [search.date], function (err, rows) {
			if (rows.length) {
				rows.forEach(function (row, index) {
					mysqlConnection.query(facilityQuery, [row.locationId], function (err, facility_row) {
						if (facility_row[0] != null && facility_row[0] != undefined && facility_row[0].name == search.roomName && facility_row[0].type == 'facility') {
							var dateString = row.date
							dateString = new Date(dateString).toString();
							dateString = dateString.split(' ').slice(0, 4).join(' ')
							row.date = dateString
							
							mysqlConnection.query(userQuery, [row.userId], function (err, user_row) {
								if (user_row[0] != null && user_row[0] != undefined) {
									row.fullName = user_row[0].lastName + ", " + user_row[0].firstName 
								} else {
									row.fullName = 'NA'
								}

								jsonArray.push(row)

								if (index == rows.length-1) {
									return cb(null, jsonArray)
								}
							})
						} else if (index == rows.length-1) {
							return cb(null, jsonArray)
						}
					})
				})
			} else {
				return cb('No timelogs found', null)
			}
		})
	}
}
