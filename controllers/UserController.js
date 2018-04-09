var User = require(`${__dirname}/../models/User`);
var Location = require(`${__dirname}/../models/Location`) 

module.exports = {
	getAdministratorPage : function (req, res, next) {
		User.getAdministrators(function (err, admins) {
			res.render('administrator', { title : "My App", administrators : admins })
		})
	}, 
	searchAdministrators : function (req, res, next) {
		User.searchAdministrators(req.body.search, function (err, admins) {
			res.render('administrator', { title : "My App", administrators : admins })	
		})
	}, 
	getAddAdministratorPage : function (req, res, next) {
		res.render('administrator-add', { title : "My App" })
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
		res.render('administrator-edit', { title : "MyApp", administrator : req.body })
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
			res.render('student', { title : "My App", students : students })
		})
	}, 

	searchStudents : function (req, res, next) {
		User.searchStudents(req.body.search, function (err, students) {
			res.render('student', { title : "My App", students : students })	
		})
	},
	getAddStudentPage : function (req, res, next) {
		Location.getClassrooms(function (err, classrooms) {
			res.render('student-add', { title : "My App" , classrooms : classrooms })
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
			res.render('student-edit', { title : "MyApp", student : req.body , classrooms : classrooms})
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
	}

}