var Timelog = require(`${__dirname}/../models/Timelog`);
var Location = require(`${__dirname}/../models/Location`)
var User = require(`${__dirname}/../models/User`);

module.exports = {
	getTimelogPage : function (req, res, next) {
		Timelog.getTimelogs(function (err, timelogs) {
			res.render('timelogs', { title : "MyApp" , timelogs : timelogs})
		})
	}, 
	getAddTimelogPage : function (req, res, next) {
		Location.getLocations(function (err, locations) {
			User.getUsers(function (err, users) {
				res.render('timelog-add', { title : "My App" , users : users, locations : locations })
			})
		})
	}, 
	addTimelog : function (req, res, next) {
		Timelog.addOneTimelog(req.body, function (err, timelog) {
			if (err) throw err;
			res.redirect('/timelogs')
		})
	}, 
	deleteTimelog : function (req, res, next) {
		Timelog.deleteTimelog(req.params.id, function (err, timelog) {
			if (err) throw err;
			console.log('Deleted Timelog ID: ' + timelog)
			res.redirect('/timelogs')
		})
	}, 

	searchTimelog : function (req, res, next) {
		Timelog.searchTimelog(req.body, function (err, timelogs) {
			if (err) console.log(err);	 
			res.render('timelogs', { title : "MyApp" , timelogs : timelogs})
		})
	}	
}