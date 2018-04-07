var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'spdb'
});

module.exports = {
	getDbConnection : function () {
		return connection
	}
}