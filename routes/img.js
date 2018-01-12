
var myDB = require('../DBHelper');
var express = require('express');
var router = express();

/* GET home page. */
router.get('/:imgName', function(req, res) {
	var fileName = req.headers.host+"/images/"+req.params.imgName+".png";
	res.set('Content-Type', 'image/png');
	console.log(fileName);
	res.sendFile(fileName, function (err) {
	    if (err) {
	        console.log(err);
	        res.status(err.status).end();
	    }
	    else {
	       console.log('Sent:', fileName);
	   	}
	});
});

module.exports = router;


