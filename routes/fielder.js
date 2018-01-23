
var myDB = require('../DBHelper');
var express = require('express');
var common = require('../common');
var router = express.Router();

/* GET home page. */

// "total": 200,
// "per_page": 15,
// "current_page": 1,
// "last_page": 14,
// "next_page_url": "http://vuetable.ratiw.net/api/users?page=2",
// "prev_page_url": null,
// "from": 1,
// "to": 15,
//http://vuetable.ratiw.net/api/users?page=2&per_page=30

router.get('/', function(req, res) {
	var sort = "";
	var per_page = "";
	var current_page = "";
	var last_page = "";
	var next_page_url = "";
	var prev_page_url = "";
	var from = "";
	var to = "";
	var total = "";
	var next_page_url = "";
	var prev_page_url = "";

	var sql_count = " select "+
			"  count(res.ID) as count  "+
			" from  "+
			" (SELECT  "+
			"  f.ID ,  "+
			"  f.YearMonth ,  "+
			"  f.PlayerName ,  "+
			"  f.HitL ,  "+
			"  f.HitR ,  "+
			"  f.Pow ,  "+
			"  f.Eye ,  "+
			"  f.Agi ,  "+
			"  f.Def ,  "+
			"  f.Pass ,  "+
			"  f.Style ,  "+
			"  FLOOR((f.HitL+f.HitR+f.Pow+f.Eye+f.Agi+f.Def+f.Pass)/7) as 'Ev',  "+
			"  pl.LevelName ,  "+
			"  GROUP_CONCAT(DISTINCT t.TeamNameAlias) AS 'Team',  "+
			"  GROUP_CONCAT(p.PositionName, '-', fp.Value) AS 'Dpv'  "+
			" FROM  "+
			"  playerlevel pl,  "+
			"  fielder f  "+
			"      LEFT JOIN  "+
			"  fielderposition fp ON f.ID = fp.FielderID  "+
			"      LEFT JOIN  "+
			"  fielderteam ft ON f.ID = ft.FielderID  "+
			"      LEFT JOIN  "+
			"  dposition p ON fp.PositionID = p.ID  "+
			"      LEFT JOIN  "+
			"  team t ON ft.TeamID = t.ID  "+
			" WHERE  "+
			"  f.PlayerLevel = pl.ID  ";



	var sql = " select "+
			"  res.ID as id,  "+
			"  res.YearMonth AS '年度月份',  "+
			"  res.PlayerName AS '球員名稱',  "+
			"  res.HitL AS '打擊L',  "+
			"  res.HitR AS '打擊R',  "+
			"  res.Pow AS '力量',  "+
			"  res.Eye AS '選球',  "+
			"  res.Agi AS '跑壘',  "+
			"  res.Def AS '守備',  "+
			"  res.Pass AS '傳球',  "+
			"  res.Ev AS '評價',  "+
			"  res.LevelName AS '卡片等級',  "+
			"  res.Team AS '隊伍',  "+
			"  res.Dpv AS '守備適性', "+
			"  res.ImgUrl , "+
			"  res.Style AS '姿勢' "+
			" from  "+
			" (SELECT  "+
			"  f.ID ,  "+
			"  f.YearMonth ,  "+
			"  f.PlayerName ,  "+
			"  f.HitL ,  "+
			"  f.HitR ,  "+
			"  f.Pow ,  "+
			"  f.Eye ,  "+
			"  f.Agi ,  "+
			"  f.Def ,  "+
			"  f.Pass ,  "+
			"  f.Style ,  "+
			"  f.ImgUrl ,  "+
			"  FLOOR((f.HitL+f.HitR+f.Pow+f.Eye+f.Agi+f.Def+f.Pass)/7) as 'Ev',  "+
			"  pl.LevelName ,  "+
			"  GROUP_CONCAT(DISTINCT t.TeamNameAlias) AS 'Team',  "+
			"  GROUP_CONCAT(p.PositionName, '-', fp.Value) AS 'Dpv'  "+
			" FROM  "+
			"  playerlevel pl,  "+
			"  fielder f  "+
			"      LEFT JOIN  "+
			"  fielderposition fp ON f.ID = fp.FielderID  "+
			"      LEFT JOIN  "+
			"  fielderteam ft ON f.ID = ft.FielderID  "+
			"      LEFT JOIN  "+
			"  dposition p ON fp.PositionID = p.ID  "+
			"      LEFT JOIN  "+
			"  team t ON ft.TeamID = t.ID  "+
			" WHERE  "+
			"  f.PlayerLevel = pl.ID  ";
	console.log(req.query);
	if(req.query.player && req.query.player != 'all'){
		sql += " and f.PlayerName like '%" + req.query.player + "%' ";
		sql_count += " and f.PlayerName like '		%" + req.query.player + "%' ";
	}
	
	if(req.query.team && req.query.team != 'all'){
		sql += " and t.ID in (" + req.query.team + ") ";
		sql_count += " and t.ID in (" + req.query.team + ") ";
	}

	if(req.query.position && req.query.position != 'all'){
		sql += " and p.ID in (" + req.query.position + ") ";
		sql_count += " and p.ID in (" + req.query.position + ") ";
	}

	if(req.query.playerlevel && req.query.playerlevel != 'all'){
		sql += " and pl.ID in (" + req.query.playerlevel + ") ";
		sql_count += " and pl.ID in (" + req.query.playerlevel + ") ";
	}

	if(req.query.style && req.query.style != 'false'){
		sql += " and f.Style = 'Y' ";
		sql_count += " and f.Style = 'Y' ";
	}

	if(req.query.year && req.query.year != 'all'){
		var yearList = req.query.year.split(",");
			sql += " and ( ";
			sql_count += " and ( ";

			var yearit = common.makeIterator(yearList);
			while(!yearit.next().done){
				var year = yearit.next().value;
				sql += " f.YearMonth like '"+year+"%' ";
				sql_count += " f.YearMonth like '"+year+"%' ";
				if(!yearit.next().done){
					sql += " or ";
					sql_count += " or ";
				}
			}
		// for (year of yearList){
		// 	sql += " f.YearMonth like '"+year+"%' ";
		// 	sql_count += " f.YearMonth like '"+year+"%' ";
		// }
			sql += " ) ";
			sql_count += " ) ";
	}

	if(req.query.month && req.query.month != 'all'){
		var monthList = req.query.month.split(",");
			sql += " and ( ";
			sql_count += " and ( ";
		for (month of monthList){
			sql += " f.YearMonth like '%"+month+"' ";
			sql_count += " f.YearMonth like '%"+month+"' ";
		}
			sql += " ) ";
			sql_count += " ) ";
	}

	// " GROUP BY f.ID , pl.ID) as res  ";
	sql += " GROUP BY f.ID , pl.ID ) as res  ";
	sql_count += " GROUP BY f.ID , pl.ID) as res  ";

	if(req.query.sort){
		sort = req.query.sort.split("|");
		sql += " Order BY " + sort[0] + " " + sort[1] ;
	}

	if(req.query.per_page){
		per_page = req.query.per_page;
	}

	if(req.query.page){
		current_page = req.query.page;
	}

	//limit calculate
	var from = per_page * (current_page -1) ;
	var to = per_page * (current_page);
	sql += " limit " + (current_page-1) * per_page + " , " + per_page



	myDB.query(sql_count,function(err, results) {
	    if(err) 
		{ 
			res.send({
	    		"api_result" : 1,
	    		"data" : err
	    	});
			return;
	    	// Respond with results as JSON
		}else{
			total = results[0].count;
		}
	});

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
			//page calculate
			last_page = Math.ceil(total / per_page) ;
			if(parseInt(current_page,10) != 1){
				prev_page_url = req.headers.host+"/api/filder/?per_page="+per_page+"&page="+(parseInt(current_page,10)-1);
			}else{
				prev_page_url = null
			}

			if((parseInt(current_page,10)+1) <= last_page){
				next_page_url = req.headers.host+"/api/filder/?per_page="+per_page+"&page="+(parseInt(current_page,10)+1);
			}else{
				next_page_url = null;
			}

	    	res.send({
	    		"api_result" : 0,
	    		"total": total,
	    		"current_page":current_page,
	    		"per_page":per_page,
				"last_page": last_page,
				"from": from+1,
				"to": to,
				"prev_page_url":prev_page_url,
				"next_page_url":next_page_url,
	    		"data" : results
	    	});
		}
	});
});

router.post('/', function(req, res) {
	console.log(req.body);
	var insertId = "";
	var insertPlayer = "INSERT "+
						" INTO fielder "+
						" (`PlayerName`, "+
						" `HitL`, "+
						" `HitR`, "+
						" `Pow`, "+
						" `Eye`, "+
						" `Agi`, "+
						" `Def`, "+
						" `Pass`, "+
						" `YearMonth`, "+
						" `PlayerLevel`, "+
						" `Style`, "+
						" `ImgUrl`) "+
						" VALUES "+
						" ( "+
						" '"+req.body.PlayerName+"', "+
						" "+req.body.HitL+", "+
						" "+req.body.HitR+", "+
						" "+req.body.Pow+", "+
						" "+req.body.Eye+", "+
						" "+req.body.Agi+", "+
						" "+req.body.Def+", "+
						" "+req.body.Pass+", "+
						" '"+req.body.Year+"', "+
						" "+req.body.PlayerLevel+", "+
						" '"+req.body.Style+"', "+
						" '"+req.body.Img+"')";
	// console.log(insertPlayer);

	myDB.query(insertPlayer,function(err, results) {
	    if(err) 
		{ 
			res.send({
	    		"api_result" : 1,
	    		"data" : err
	    	});
			return;
	    	// Respond with results as JSON
		}else{
	    	insertId = results.insertId;
    		//insert Position
			var PositionSql = [];
			for(pos of req.body.Position){
				var sql = " INSERT INTO fielderposition "+
							" (`FielderID`, "+
							" `PositionID`, "+
							" `Value`) "+
							" VALUES "+
							" ( "+
							" "+insertId+", "+
							" "+pos.PID+", "+
							" '"+pos.Value+"')";
				PositionSql.push(sql);
			}
			console.log(PositionSql);

    		//insert Team
			var TeamSql = [];
			for(team of req.body.Teams){
				var sql = " INSERT INTO fielderteam "+
							" (`FielderID`, "+
							" `TeamID`) "+
							" VALUES "+
							" ( "+
							" "+insertId+", "+
							" "+team.TID+")";
				TeamSql.push(sql);
			}
			console.log(TeamSql);

				for(psql of PositionSql){
					myDB.query(psql,function(err, results) {
						console.log('im Position');
						 if(err) 
						{
							res.send({
					    		"api_result" : 1,
					    		"data" : err
					    	});
							return;
						}
					});
				}

				for(tsql of TeamSql){
					myDB.query(tsql,function(err, results) {
						console.log('im Team');
						 if(err) 
						{
							res.send({
					    		"api_result" : 1,
					    		"data" : err
					    	});
							return;
						}else{
							res.send({
					    		"api_result" : 0,
					    		"data" : {
					    			"Player":1,
					    			"Position":PositionSql.length,
					    			"Tems":TeamSql.length
					    		}
					    	});
						}
					});
				}
			}
		});
	
});

module.exports = router;


