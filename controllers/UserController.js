var User = require(`${__dirname}/../models/User`);
var Location = require(`${__dirname}/../models/Location`) 

module.exports = {
	getAdministratorPage : function (req, res, next) {
		User.getAdministrators(function (err, admins) {
			res.render('administrator', { title : "RLTS", administrators : admins })
		})
	}, 
	searchAdministrators : function (req, res, next) {
		User.searchAdministrators(req.body.search, function (err, admins) {
			res.render('administrator', { title : "RLTS", administrators : admins })	
		})
	}, 
	getAddAdministratorPage : function (req, res, next) {
		res.render('administrator-add', { title : "RLTS" })
	}, 
	addAdministrator : function (req, res, next) {
		User.addAdministrator(req.body, function (err, administrator) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully added administrator ID: ' + administrator)
			}
			res.redirect('/users/administrator')
		})
	}, 
	deleteAdministrator : function (req, res, next) {
		User.deleteAdministrator(req.params.id, function (err, administrator) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully deleted administrator ID: ' + administrator)	
			}
			res.redirect('/users/administrator')
		})
	}, 
	getEditAdministratorPage : function (req, res, next) {
		res.render('administrator-edit', { title : "RLTS", administrator : req.body })
	}, 
	editAdministrator : function (req, res, next) {
		User.editAdministrator(req.body, function (err, administrator) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully edited administrator ID: ' + administrator)
			}

			res.redirect('/users/administrator')
		})
	},

	getStudentPage : function (req, res, next) {
		User.getStudents(function (err, students) {
			res.render('student', { title : "RLTS", students : students })
		})
	}, 

	searchStudents : function (req, res, next) {
		User.searchStudents(req.body.search, function (err, students) {
			res.render('student', { title : "RLTS", students : students })	
		})
	},
	getAddStudentPage : function (req, res, next) {
		Location.getClassrooms(function (err, classrooms) {
			res.render('student-add', { title : "RLTS" , classrooms : classrooms })
		})
	}, 
	addStudent : function (req, res, next) {
		User.addStudent(req.body, function (err, student) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully added Student ID: ' + student)
			}
			res.redirect('/users/student')
		})
	}, 
	deleteStudent : function (req, res, next) {
		User.deleteStudent(req.params.id, function (err, student) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully deleted student ID: ' + student)	
			}
			res.redirect('/users/student')
		})
	}, 
	getEditStudentPage : function (req, res, next) {
		Location.getClassrooms(function (err, classrooms) {
			res.render('student-edit', { title : "RLTS", student : req.body , classrooms : classrooms})
		})
	}, 
	editStudent : function (req, res, next) {
		User.editStudent(req.body, function (err, student) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully edited student ID: ' + student)
			}
			res.redirect('/users/student')
		})
	},
	getTeacherPage : function (req, res, next) {
		User.getTeachers(function (err, teachers) {
			res.render('teacher', { title : "RLTS", teachers : teachers })
		})
	}, 
	searchTeachers : function (req, res, next) {
		User.searchTeachers(req.body.search, function (err, teachers) {
			res.render('teacher', { title : "RLTS", teachers : teachers })	
		})
	}, 
	getAddTeacherPage : function (req, res, next) {
		res.render('teacher-add', { title : "RLTS" })
	}, 
	addTeacher : function (req, res, next) {
		User.addTeacher(req.body, function (err, teacher) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully added Teacher ID: ' + teacher)
			}
			res.redirect('/users/teacher')
		})
	}, 
	deleteTeacher : function (req, res, next) {
		User.deleteTeacher(req.params.id, function (err, teacher) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully deleted teacher ID: ' + teacher)	
			}
			res.redirect('/users/teacher')
		})
	}, 
	getEditTeacherPage : function (req, res, next) {
		res.render('teacher-edit', { title : "RLTS", teacher : req.body })
	}, 
	editTeacher : function (req, res, next) {
		User.editTeacher(req.body, function (err, teacher) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully edited teacher ID: ' + teacher)
			}
			res.redirect('/users/teacher')
		})
	}, 
	getStaffPage : function (req, res, next) {
		User.getStaff(function (err, staff) {
			res.render('nonteachingstaff', { title : "RLTS", staff : staff })
		})
	}, 


	searchStaff : function (req, res, next) {
		User.searchStaff(req.body.search, function (err, staff) {
			res.render('nonteachingstaff', { title : "RLTS", staff : staff })	
		})
	}, 

	getAddStaffPage : function (req, res, next) {
		res.render('nonteachingstaff-add', { title : "RLTS" })
	},
	addStaff : function (req, res, next) {
		User.addStaff(req.body, function (err, staff) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully added staff ID: ' + staff)
			}
			res.redirect('/users/nonteaching')
		})
	}, 
	deleteStaff : function (req, res, next) {
		User.deleteStaff(req.params.id, function (err, staff) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully deleted staff ID: ' + staff)	
			}
			res.redirect('/users/nonteaching')
		})
	}, 
	getEditStaffPage : function (req, res, next) {
		res.render('nonteachingstaff-edit', { title : "RLTS", staff : req.body })
	}, 
	editStaff : function (req, res, next) {
		User.editStaff(req.body, function (err, staff) {
			if (err) {
				console.log(err)
			} else {
				console.log('Successfully edited staff ID: ' + staff)
			}
			res.redirect('/users/nonteaching')
		})
	}, 
}