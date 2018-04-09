var User = require(`${__dirname}/../models/User`);


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
	}
}