
var config = require('./DBConfig');

var options = {
    'host': config.db_host,
    'port': config.db_port,
    'database': config.db_name,
    'user': config.db_user,
    'password': config.db_passwd,
    'charset': config.db_charset,
    'connectionLimit': config.db_conn_limit,
    'supportBigNumbers': true,
    'bigNumberStrings': true
}
var mysql = require("mysql");
var pool = mysql.createPool(options);

function execQuery(sql) {
    var errinfo;
    var result = "";
    pool.getConnection(function(err, connection) {
        if (err) {
            errinfo = 'DB-get connection error !';
            console.log(errinfo);
            throw errinfo;
        } else {
            var querys = connection.query(sql, function(err, res) {
                release(connection);
                if (err) {
                    errinfo = 'DB-SQL error:' + err;
                    console.log(errinfo);
                } else {
                	console.log('res : ',res);
                	return res;
                	// console.log('result : ',result);
                }
            });
            //console.log('query',querys.sql);
        }
    });
}

function release(connection) {
    try {
        connection.release(function(error) {
            if (error) {
                console.log('DB-close connection error ! ');
            }
        });
    } catch (err) {}
}

exports.query = function(sql, callback) {
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
    connection.query(sql, function(err, results) {
      release(connection);
      if(err) { 
      	console.log(err); 
      	callback(true); 
      	return; 
      }
      console.log(results);
      callback(false, results);
    });
  });
};