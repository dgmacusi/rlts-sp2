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
							return cb(null, { data : data , date : fromDate.split('-')[0] +'-'+ (parseInt(fromDate.split('-')[1]))+'-'+ fromDate.split('-')[2] + ' to ' + toDate.split('-')[0] +'-'+ (parseInt(toDate.split('-')[1]))+'-'+ toDate.split('-')[2]})
						}
					})
				})
			} else {
				return cb("No data.", null)
			}
		})
	}, 
	getTopLocations : function (fromDate, toDate, cb) {
		var locationQuery = 'SELECT * FROM location'
		var timelogQuery = 'SELECT COUNT(*) AS count FROM timelog WHERE date BETWEEN ? AND ? AND locationId=?'
		var enterQuery = 'SELECT * FROM timelog WHERE date BETWEEN ? AND ? AND locationId=? AND entryType="enter" ORDER BY time DESC'
		var exitQuery = 'SELECT * FROM timelog WHERE date BETWEEN ? AND ? AND locationId=? AND entryType="exit" ORDER BY time DESC'


		var from = new Date(fromDate.split('-')[0], parseInt(fromDate.split('-')[1]) - 1, fromDate.split('-')[2])
		var to = new Date(toDate.split('-')[0], parseInt(toDate.split('-')[1]) - 1, toDate.split('-')[2])

		var dataHolder = []

		mysqlConnection.query(locationQuery, function (err, rows) {
			if (rows.length > 0) {
				rows.forEach(function (row, index) {
					mysqlConnection.query(timelogQuery, [from, to, row.locationId], function (err, logs) {
						var count = 0
						if (logs) {
							count = logs[0].count
						}

						mysqlConnection.query(enterQuery, [from, to, row.locationId], function (err, enter_row) {
							mysqlConnection.query(exitQuery, [from, to, row.locationId], function (err, exit_row) {
								var average = 0
								var value = []

								var less = 0
								

								if (enter_row && exit_row) {
									less = exit_row.length 
									if (exit_row.length > enter_row.length) {
										less = enter_row.length
									}

									for (var i = 0; i < less; i++) {
										var time1 = new Date(2000, 0, 1, enter_row[i].time.split(':')[0], enter_row[i].time.split(':')[1], enter_row[i].time.split(':')[2]); // 9:00 AM
										var time2 = new Date(2000, 0, 1, exit_row[i].time.split(':')[0], exit_row[i].time.split(':')[1], exit_row[i].time.split(':')[2]);

										var diff = new Date(time2 - time1)


										value.push(Math.floor(diff / 1000 / 60 / 60))
									}

									var sum = 0
									for (var j = 0; j < value.length; j++) {
										sum = sum + value[j]
									}

									average = Math.abs(sum/value.length)

								}

								var yeah = {
									count : count, 
									name : row.name, 
									average : average
								}

								dataHolder.push(yeah)


								if (index == rows.length-1) {
									dataHolder.sort(function(a, b){
									    return b.count - a.count;
									});

									var counts = []
									var name = []
									var average = []

									for (var i = 0; i < dataHolder.length; i++) {
										counts.push(dataHolder[i].count)
										name.push(dataHolder[i].name)
										average.push(dataHolder[i].average)
									}
																	
									console.log(dataHolder)
									
									return cb(null, { count : counts.slice(0, 5) , name : name.slice(0, 5) , average : average.slice(0, 5) }) 
								}
							})						
						})
					})
				})
			} else {
				return cb("No data.", null)
			}
		})
	}, 
	getHeatmap : function (cb) {
		var locationQuery = 'SELECT * FROM location'
		var timelogQuery = 'SELECT COUNT(*) AS count FROM timelog WHERE entryType="enter" AND locationId=? AND DATE(date)=?'
		var timelog2Query = 'SELECT COUNT(*) AS count FROM timelog WHERE entryType="exit" AND locationId=? AND DATE(date)=?'
		var data = []

		var today = new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate() 
		console.log(today)

		mysqlConnection.query(locationQuery, function (err, location_row) {

			if (location_row.length > 0) {
//				var a = 0
//				var b = 0
				location_row.forEach(function (row, index) {
					mysqlConnection.query(timelogQuery, [location_row[index].locationId, today], function (err, logs) {
						var enter = 0
						if (logs) {
							enter = logs[0].count
						}

						mysqlConnection.query(timelog2Query, [location_row[index].locationId, today], function (err, logs2) {
							var exit = 0
							if (logs2) {
								exit = logs2[0].count
							}
/*
							location_row[index].array = []
							location_row[index].array.push(a)
							location_row[index].array.push(b)
							location_row[index].array.push(location_row[index].name)	
							location_row[index].array.push('Current number of people in the area: '+ '<b>' +(enter - exit) + '</b>')

*/
							data.push({
								name : location_row[index].name, 
								value : (enter - exit), 
								colorValue : (enter - exit)
							})


/*							data.push(location_row[index].array)

							b++;
							if (!(b < 3)) {
								a++;
								b = 0;
							}
*/
							if (index == location_row.length-1) {
								//return cb(null, jsonArray)
								console.log(data)
								return cb(null, { data : data })
							}

						})							
					})
				})
			} else {
				return cb("No data.", null)
			}
		})
	}
	
}


