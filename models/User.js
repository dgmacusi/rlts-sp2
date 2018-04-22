var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();
const bcrypt = require('bcrypt');

module.exports = {

	authenticateUser : function(user, cb) {
		var query = 'SELECT * FROM user WHERE username=?';

		mysqlConnection.query(query, [user.username], function (err, rows) {
			if (err) throw err

			if (rows.length) {
				bcrypt.compare(user.password, rows[0].password, function(err, res) {
					if (err) throw err

					if (res) {
						console.log(rows[0])
						return cb(null, rows[0])
					} else {
						return cb('Username and password do not match.', null)
					} 
				});
			} else {
				return cb('No username found.', null)
			}
		})
	}, 
	getAllStaff : function (cb) {
		var getQuery = 'SELECT * FROM user WHERE type="administrator" OR type="teacher" OR type="nonteachingstaff"'
		
		mysqlConnection.query(getQuery, function (err, rows) {
			return cb(null, rows)
		})
	}, 
	getAdministrators : function (cb) {
		var getQuery = 'SELECT * FROM user WHERE type="administrator"'
		var getAdministratorQuery = 'SELECT * FROM administrator WHERE userId=?'

		mysqlConnection.query(getQuery, function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getAdministratorQuery, [user.userId], function (err, admin_row) {
						user.employeeNumber = admin_row[0].employeeNumber
						user.administratorId = admin_row[0].administratorId
						user.position = admin_row[0].position
						user.isAdmin = admin_row[0].isAdmin
						if (index == users.length-1) {
							return cb(null, users)
						}
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no administrators.', null)
			}
		})
	}, 
	searchAdministrators : function (term, cb) {
		var getQuery = 'SELECT * FROM user WHERE type="administrator" AND (lastName LIKE ? OR firstName LIKE ? OR username LIKE ?)'
		var getAdministratorQuery = 'SELECT * FROM administrator WHERE userId=?'

		mysqlConnection.query(getQuery, ['%'+term+'%', '%'+term+'%', '%'+term+'%'], function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getAdministratorQuery, [user.userId], function (err, admin_row) {
						user.employeeNumber = admin_row[0].employeeNumber
						user.administratorId = admin_row[0].administratorId
						user.position = admin_row[0].position
						user.isAdmin = admin_row[0].isAdmin
						if (index == users.length-1) {
							return cb(null, users)
						}
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no students.', null)
			}
		})
	}, 
	addAdministrator : function (administrator, cb) {
		var getQuery = 'SELECT * FROM user WHERE username=?'
		var addUserQuery = 'INSERT INTO user(firstName, lastName, username, password, type) VALUES(?, ?, ?, ?, ?)'
		var findQuery = 'SELECT * FROM user WHERE username=?'
		var addAdministratorQuery = 'INSERT INTO administrator(employeeNumber, position, isAdmin, userId) VALUES(?, ?, ?, ?)'
		var isAdmin = 0
		if (administrator.isAdmin) {
			isAdmin = 1
		}

		mysqlConnection.query(getQuery, [administrator.username], function (err, rows) {
			if (rows.length > 0) {
				return cb("Administrator username already exists.", null)
			} else {
				bcrypt.hash(administrator.password, 10, function(err, hash) {
					mysqlConnection.query(addUserQuery, [administrator.firstName, administrator.lastName, administrator.username, hash, 'administrator'], function (err, user) {
						mysqlConnection.query(findQuery, [administrator.username], function (err, user) {
							mysqlConnection.query(addAdministratorQuery, [administrator.employeeNumber, administrator.position, isAdmin, user[0].userId], function (err, admin) {
								return cb(null, admin.administratorId)
							})
						})
					})
				});
			}
		})
	}, 
	deleteAdministrator : function (userId, cb) {
		var deleteAdministratorQuery = 'DELETE FROM administrator WHERE userId=?'
		var deleteUserQuery = 'DELETE FROM user WHERE userId=?'

		mysqlConnection.query(deleteAdministratorQuery, [userId], function (err, res) {
			if (err) {
				return cb('Error on deleting administrator', null)
			} else {
				mysqlConnection.query(deleteUserQuery, [userId], function (err, res) {
					cb(null, userId)
				})
			}
		})
	}, 
	editAdministrator : function (administrator, cb) {
		var checkUsernameQuery = 'SELECT * FROM user WHERE username=? AND userId<>?'
		var editUserQuery = 'UPDATE user SET lastName=?, firstName=?, username=?, password=? WHERE userId=?'
		var editAdministratorQuery = 'UPDATE administrator SET employeeNumber=?, position=?, isAdmin=? WHERE userId=?'
		var isAdmin = 0
		if (administrator.isAdmin) {
			isAdmin = 1
		}

		mysqlConnection.query(checkUsernameQuery, [administrator.username, administrator.userId], function (err, rows) {
			if (err || rows.length > 0) {
				return cb('Username already exists. Failed to edit administrator.', administrator.userId)
			} else {

				bcrypt.hash(administrator.password, 10, function(err, hash) {
					mysqlConnection.query(editUserQuery, [administrator.lastName, administrator.firstName, administrator.username, hash, administrator.userId], function (err, res) {
						mysqlConnection.query(editAdministratorQuery, [administrator.employeeNumber, administrator.position, isAdmin, administrator.userId], function (err, res2) {
							return cb(null, administrator.userId)
						})
					})
				})
			}
		})

	}, 
	getStudents : function (cb) {
		var getQuery = 'SELECT * FROM user WHERE type="student"'
		var getStudentsQuery = 'SELECT * FROM student WHERE userId=?'

		mysqlConnection.query(getQuery, function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getStudentsQuery, [user.userId], function (err, student_row) {
						user.studentId = student_row[0].studentId
						user.studentNumber = student_row[0].studentNumber
						user.gradeLevel = student_row[0].gradeLevel
						user.section = student_row[0].section
						if (index == users.length-1) {
							return cb(null, users)
						}
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no students.', null)
			}
		})
	}, 
	searchStudents : function (term, cb) {
		var getQuery = 'SELECT * FROM user WHERE type="student" AND (lastName LIKE ? OR firstName LIKE ? OR username LIKE ?)'
		var getStudentsQuery = 'SELECT * FROM student WHERE userId=?'

		mysqlConnection.query(getQuery, ['%'+term+'%', '%'+term+'%', '%'+term+'%'], function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getStudentsQuery, [user.userId], function (err, student_row) {
						user.studentId = student_row[0].studentId
						user.studentNumber = student_row[0].studentNumber
						user.gradeLevel = student_row[0].gradeLevel
						user.section = student_row[0].section
						if (index == users.length-1) {
							return cb(null, users)
						}
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no students.', null)
			}
		})
	}, 
	addStudent : function (student, cb) {
		var getQuery = 'SELECT * FROM user WHERE username=?'
		var addUserQuery = 'INSERT INTO user(firstName, lastName, username, password, type) VALUES(?, ?, ?, ?, ?)'
		var findQuery = 'SELECT * FROM user WHERE username=?'
		var addStudentQuery = 'INSERT INTO student(studentNumber, gradeLevel, section, userId) VALUES(?, ?, ?, ?)'
		var classroomQuery = 'SELECT * FROM classroom WHERE classroomId=?'

		mysqlConnection.query(getQuery, [student.username], function (err, rows) {
			if (rows.length > 0) {
				return cb("Student username already exists.", null)
			} else {
				bcrypt.hash(student.password, 10, function(err, hash) {
					mysqlConnection.query(addUserQuery, [student.firstName, student.lastName, student.username, hash, 'student'], function (err, user) {
						mysqlConnection.query(findQuery, [student.username], function (err, s) {
							mysqlConnection.query(classroomQuery, [student.classroomId], function (err, classroom) {
								mysqlConnection.query(addStudentQuery, [student.studentNumber, classroom[0].gradeLevel, classroom[0].section, s[0].userId], function (err, stud) {
									return cb(null, stud.userId)
								})
							})
						})
					})
				});
			}
		})
	}, 
	deleteStudent : function (userId, cb) {
		var deleteStudentQuery = 'DELETE FROM student WHERE userId=?'
		var deleteUserQuery = 'DELETE FROM user WHERE userId=?'

		mysqlConnection.query(deleteStudentQuery, [userId], function (err, res) {
			if (err) {
				return cb('Error on deleting student', null)
			} else {
				mysqlConnection.query(deleteUserQuery, [userId], function (err, res) {
					cb(null, userId)
				})
			}
		})
	}, 
	editStudent : function (student, cb) {
		var checkUsernameQuery = 'SELECT * FROM user WHERE username=? AND userId<>?'
		var editUserQuery = 'UPDATE user SET lastName=?, firstName=?, username=?, password=? WHERE userId=?'
		var editStudentQuery = 'UPDATE student SET studentNumber=?, gradeLevel=?, section=? WHERE userId=?'
		var classroomQuery = 'SELECT * FROM classroom WHERE classroomId=?'


		mysqlConnection.query(checkUsernameQuery, [student.username, student.userId], function (err, rows) {
			if (err || rows.length > 0) {
				return cb('Username already exists. Failed to edit student.', student.userId)
			} else {

				bcrypt.hash(student.password, 10, function(err, hash) {
					mysqlConnection.query(editUserQuery, [student.lastName, student.firstName, student.username, hash, student.userId], function (err, res) {
						mysqlConnection.query(classroomQuery, [student.classroomId], function (err, classroom) {
							mysqlConnection.query(editStudentQuery, [student.studentNumber, classroom[0].gradeLevel, classroom[0].section, student.userId], function (err, res2) {
								return cb(null, student.userId)
							})


						})
					})
				})
			}
		})
	}, 
	getTeachers : function (cb) {
		var getQuery = 'SELECT * FROM user WHERE type="teacher"'
		var getTeachersQuery = 'SELECT * FROM teacher WHERE userId=?'
		var getClassroomQuery = 'SELECT * FROM classroom WHERE userId=?'


		mysqlConnection.query(getQuery, function (err, users) {
			if (users.length > 0) {
				console.log(users)
				users.forEach(function (user, index) {
					mysqlConnection.query(getTeachersQuery, [user.userId], function (err, teacher_row) {
						mysqlConnection.query(getClassroomQuery, [user.userId], function (err, room_row) {
							user.teacherId = teacher_row[0].teacherId
							user.employeeNumber = teacher_row[0].employeeNumber
							user.isAdmin = teacher_row[0].isAdmin
							if (room_row[0] != undefined && room_row[0] != null) {
								user.section = room_row[0].gradeLevel+ ' - ' +room_row[0].section
							} else {
								user.section = "N/A"
							}
   
							
							if (index == users.length-1) {
								return cb(null, users)
							}
						})
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no teachers.', null)
			}
		})
	}, 
	searchTeachers : function (term, cb) {
		var getQuery = 'SELECT * FROM user WHERE type="teacher" AND (lastName LIKE ? OR firstName LIKE ? OR username LIKE ?)'
		var getTeachersQuery = 'SELECT * FROM teacher WHERE userId=?'
		var getClassroomQuery = 'SELECT * FROM classroom WHERE userId=?'

		mysqlConnection.query(getQuery, ['%'+term+'%', '%'+term+'%', '%'+term+'%'], function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getTeachersQuery, [user.userId], function (err, teacher_row) {
						mysqlConnection.query(getClassroomQuery, [user.userId], function (err, room_row) {
							user.teacherId = teacher_row[0].teacherId
							user.employeeNumber = teacher_row[0].employeeNumber
							user.isAdmin = teacher_row[0].isAdmin
							if (room_row[0] != undefined && room_row[0] != null) {
								user.section = room_row[0].gradeLevel+ ' - ' +room_row[0].section
							} else {
								user.section = "N/A"
							}
   
							
							if (index == users.length-1) {
								return cb(null, users)
							}
						})
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no teachers.', null)
			}
		})
	}, 
	addTeacher : function (teacher, cb) {
		var addUserQuery = 'INSERT INTO user(firstName, lastName, username, password, type) VALUES(?, ?, ?, ?, ?)'
		var findQuery = 'SELECT * FROM user WHERE username=?'
		var addTeacherQuery = 'INSERT INTO teacher(employeeNumber, hasClassroom, isAdmin, userId) VALUES(?, ?, ?, ?)'
		var isAdmin = 0
		if (teacher.isAdmin) {
			isAdmin = 1
		}

		mysqlConnection.query(findQuery, [teacher.username], function (err, rows) {
			if (rows.length > 0) {
				return cb("Teacher username already exists.", null)
			} else {
				bcrypt.hash(teacher.password, 10, function(err, hash) {
					mysqlConnection.query(addUserQuery, [teacher.firstName, teacher.lastName, teacher.username, hash, 'teacher'], function (err, user) {
						if (err) console.log(err)
						mysqlConnection.query(findQuery, [teacher.username], function (err, row) {
							mysqlConnection.query(addTeacherQuery, [teacher.employeeNumber, 0, isAdmin, row[0].userId], function (err, tea) {
								return cb(null, tea.teacherId)
							})
						})
					})
				});
			}
		})
	}, 
	deleteTeacher : function (userId, cb) {
		var deleteTeacherQuery = 'DELETE FROM teacher WHERE userId=?'
		var deleteUserQuery = 'DELETE FROM user WHERE userId=?'

		mysqlConnection.query(deleteTeacherQuery, [userId], function (err, res) {
			if (err) {
				return cb('Error on deleting teacher', null)
			} else {
				mysqlConnection.query(deleteUserQuery, [userId], function (err, res) {
					cb(null, userId)
				})
			}
		})
	}, 
	editTeacher : function (teacher, cb) {
		var checkUsernameQuery = 'SELECT * FROM user WHERE username=? AND userId<>?'
		var editUserQuery = 'UPDATE user SET lastName=?, firstName=?, username=?, password=? WHERE userId=?'
		var editTeacherQuery = 'UPDATE teacher SET employeeNumber=?, hasClassroom=?, isAdmin=? WHERE userId=?'
		var isAdmin = 0
		if (teacher.isAdmin) {
			isAdmin = 1
		}

		mysqlConnection.query(checkUsernameQuery, [teacher.username, teacher.userId], function (err, rows) {
			if (err || rows.length > 0) {
				return cb('Username already exists. Failed to edit teacher.', teacher.userId)
			} else {

				bcrypt.hash(teacher.password, 10, function(err, hash) {
					mysqlConnection.query(editUserQuery, [teacher.lastName, teacher.firstName, teacher.username, hash, teacher.userId], function (err, res) {
						mysqlConnection.query(editTeacherQuery, [teacher.employeeNumber, 0, isAdmin, teacher.userId], function (err, res2) {
							return cb(null, teacher.userId)
						})
					})
				})
			}
		})
	}, 
	getStaff : function (cb) {
		var getQuery = 'SELECT * FROM user WHERE type="nonteachingstaff"'
		var getStaffQuery = 'SELECT * FROM nonteachingstaff WHERE userId=?'
		var getFacilityQuery = 'SELECT * FROM facility WHERE userId=?'
		var getLocationQuery = 'SELECT * FROM location WHERE locationId=?'

		mysqlConnection.query(getQuery, function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getStaffQuery, [user.userId], function (err, staff_row) {
						mysqlConnection.query(getFacilityQuery, [user.userId], function (err, facility_row) {
							var locationId = ''
							user.nonteachingstaffId = staff_row[0].nonteachingstaffId
							user.employeeNumber = staff_row[0].employeeNumber
							user.jobDescription = staff_row[0].jobDescription
							user.isAdmin = staff_row[0].isAdmin


							if (facility_row[0] != null && facility_row[0] != undefined) {
								console.log(1)
								locationId = facility_row[0].locationId

								facility_row.forEach(function (facility, ind) {
									mysqlConnection.query(getLocationQuery, [facility.locationId], function (err, location_row) {		
										if (location_row[0] != undefined && location_row[0] != null) {
											console.log("YOW")
											if (ind == 0) {
												user.facility = location_row[0].name
											} else {
												user.facility = user.facility + ', ' + location_row[0].name
											}

										} else {
											user.facility = "N/A"
										}

										if (ind == facility_row.length-1) {
											if (index == users.length-1) {
												return cb(null, users)
											}
										}
									})
								})



							} else {
								console.log(2)
								locationId = null
								mysqlConnection.query(getLocationQuery, [locationId], function (err, location_row) {		
									if (location_row[0] != undefined && location_row[0] != null) {
										user.facility = location_row[0].name
									} else {
										user.facility = "N/A"
									}

									
									if (index == users.length-1) {
										return cb(null, users)
									}
								})
							}

							
						})
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no staff.', null)
			}
		})
	},
	searchStaff : function (term, cb) {
		var getQuery = 'SELECT * FROM user WHERE type="nonteachingstaff" AND (lastName LIKE ? OR firstName LIKE ? OR username LIKE ?)'
		var getStaffQuery = 'SELECT * FROM nonteachingstaff WHERE userId=?'
		var getFacilityQuery = 'SELECT * FROM facility WHERE userId=?'
		var getLocationQuery = 'SELECT * FROM location WHERE locationId=?'

		mysqlConnection.query(getQuery, ['%'+term+'%', '%'+term+'%', '%'+term+'%'], function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getStaffQuery, [user.userId], function (err, staff_row) {
						mysqlConnection.query(getFacilityQuery, [user.userId], function (err, facility_row) {
							var locationId = ''
							user.nonteachingstaffId = staff_row[0].nonteachingstaffId
							user.employeeNumber = staff_row[0].employeeNumber
							user.jobDescription = staff_row[0].jobDescription
							user.isAdmin = staff_row[0].isAdmin
							
							if (facility_row[0] != null && facility_row[0] != undefined) {
								locationId = facility_row[0].locationId
							} else {
								locationId = null
							}

							mysqlConnection.query(getLocationQuery, [locationId], function (err, location_row) {

								
								
								if (location_row[0] != undefined && location_row[0] != null) {
									user.facility = location_row[0].name
								} else {
									user.facility = "N/A"
								}

								
								if (index == users.length-1) {
									return cb(null, users)
								}
							})
						})
					})
				})
			//return cb(null, rows)
			} else {
				return cb('There are no staff.', null)
			}
		})
	}, 
	addStaff : function (staff, cb) {
		var addUserQuery = 'INSERT INTO user(firstName, lastName, username, password, type) VALUES(?, ?, ?, ?, ?)'
		var findQuery = 'SELECT * FROM user WHERE username=?'
		var addStaffQuery = 'INSERT INTO nonteachingstaff(employeeNumber, jobDescription, isAdmin, userId) VALUES(?, ?, ?, ?)'
		var isAdmin
		if (staff.isAdmin) {
			isAdmin = 1
		}
		mysqlConnection.query(findQuery, [staff.username], function (err, rows) {
			if (rows.length > 0) {
				return cb("Staff username already exists.", null)
			} else {
				bcrypt.hash(staff.password, 10, function(err, hash) {
					mysqlConnection.query(addUserQuery, [staff.firstName, staff.lastName, staff.username, hash, 'nonteachingstaff'], function (err, user) {
						mysqlConnection.query(findQuery, [staff.username], function (err, row) {
							mysqlConnection.query(addStaffQuery, [staff.employeeNumber, staff.jobDescription, isAdmin, row[0].userId], function (err, staff) {
								return cb(null, staff.nonteachingstaffId)
							})
						})
					})
				});
			}
		})
	},
	deleteStaff : function (userId, cb) {
		var deleteStaffQuery = 'DELETE FROM nonteachingstaff WHERE userId=?'
		var deleteUserQuery = 'DELETE FROM user WHERE userId=?'

		mysqlConnection.query(deleteStaffQuery, [userId], function (err, res) {
			if (err) {
				return cb('Error on deleting staff', null)
			} else {
				mysqlConnection.query(deleteUserQuery, [userId], function (err, res) {
					cb(null, userId)
				})
			}
		})
	}, 
	editStaff : function (staff, cb) {
		var checkUsernameQuery = 'SELECT * FROM user WHERE username=? AND userId<>?'
		var editUserQuery = 'UPDATE user SET lastName=?, firstName=?, username=?, password=? WHERE userId=?'
		var editStaffQuery = 'UPDATE nonteachingstaff SET employeeNumber=?, jobDescription=?, isAdmin=? WHERE userId=?'
		var isAdmin
		if (staff.isAdmin) {
			isAdmin = 1
		}

		mysqlConnection.query(checkUsernameQuery, [staff.username, staff.userId], function (err, rows) {
			if (err || rows.length > 0) {
				return cb('Username already exists. Failed to edit staff.', staff.userId)
			} else {

				bcrypt.hash(staff.password, 10, function(err, hash) {
					mysqlConnection.query(editUserQuery, [staff.lastName, staff.firstName, staff.username, hash, staff.userId], function (err, res) {
						mysqlConnection.query(editStaffQuery, [staff.employeeNumber, staff.jobDescription, isAdmin, staff.userId], function (err, res2) {
							return cb(null, staff.userId)
						})
					})
				})
			}
		})
	}
}





