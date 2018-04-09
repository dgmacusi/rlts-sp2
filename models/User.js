var mysqlConnection = require(`${__dirname}/../controllers/ConfigurationController`).getDbConnection();
const bcrypt = require('bcrypt');

module.exports = {

	authenticateUser : function(user, cb) {
		var query = 'SELECT username, password FROM user WHERE username=?';

		mysqlConnection.query(query, [user.username], function (err, rows) {
			if (err) throw err

			if (rows.length) {
				bcrypt.compare(user.password, rows[0].password, function(err, res) {
					if (err) throw err

					if (res) {
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
		var getQuery = 'SELECT * FROM user WHERE type="administrator" OR type="teacher" OR type="nonteaching"'
		
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
		var getQuery = 'SELECT * FROM user WHERE type="administrator" AND (lastName LIKE ? OR firstName LIKE ?)'
		var getAdministratorQuery = 'SELECT * FROM administrator WHERE userId=?'

		mysqlConnection.query(getQuery, ['%'+term+'%', '%'+term+'%'], function (err, users) {
			if (users.length > 0) {
				users.forEach(function (user, index) {
					mysqlConnection.query(getAdministratorQuery, [user.userId], function (err, admin_row) {
						user.employeeNumber = admin_row[0].employeeNumber
						user.administratorId = admin_row[0].administratorId
						user.position = admin_row[0].position

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
		var addAdministratorQuery = 'INSERT INTO administrator(employeeNumber, position, userId) VALUES(?, ?, ?)'

		mysqlConnection.query(getQuery, [administrator.username], function (err, rows) {
			if (rows.length > 0) {
				return cb("Administrator username already exists.", null)
			} else {
				bcrypt.hash(administrator.password, 10, function(err, hash) {
					mysqlConnection.query(addUserQuery, [administrator.firstName, administrator.lastName, administrator.username, hash, 'administrator'], function (err, user) {
						mysqlConnection.query(findQuery, [administrator.username], function (err, user) {
							mysqlConnection.query(addAdministratorQuery, [administrator.employeeNumber, administrator.position, user[0].userId], function (err, admin) {
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
		var editAdministratorQuery = 'UPDATE administrator SET employeeNumber=?, position=? WHERE userId=?'


		mysqlConnection.query(checkUsernameQuery, [administrator.username, administrator.userId], function (err, rows) {
			if (err || rows.length > 0) {
				return cb('Username already exists. Failed to edit administrator.', administrator.userId)
			} else {

				bcrypt.hash(administrator.password, 10, function(err, hash) {
					mysqlConnection.query(editUserQuery, [administrator.lastName, administrator.firstName, administrator.username, hash, administrator.userId], function (err, res) {
						mysqlConnection.query(editAdministratorQuery, [administrator.employeeNumber, administrator.position, administrator.userId], function (err, res2) {
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
		var getQuery = 'SELECT * FROM user WHERE type="student" AND (lastName LIKE ? OR firstName LIKE ?)'
		var getStudentsQuery = 'SELECT * FROM student WHERE userId=?'

		mysqlConnection.query(getQuery, ['%'+term+'%', '%'+term+'%'], function (err, users) {
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
	}
}





