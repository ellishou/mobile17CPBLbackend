
var myDB = require('../DBHelper');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var sql = " select * from dposition ";
	console.log(req.query);
	if(req.query.Type){
		sql += "where Type = '" + req.query.Type + "'"
	}
	console.log(sql);
	myDB.query(sql,function(err, results) {
	    if(err) 
		{ 
			res.send({
	    		"api_result" : 1,
	    		"data" : err
	    	});
			return;
	    	// Respond with results as JSON
		}else{
	    	res.send({
	    		"api_result" : 0,
	    		"data" : results
	    	});
		}
	});
});
module.exports = router;


