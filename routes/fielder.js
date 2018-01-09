
var myDB = require('../DBHelper');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
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
			"  f.PlayerLevel = pl.ID  "+
			" GROUP BY f.ID , pl.ID) as res  ";
	if(req.query.sort){
		var sort = req.query.sort.split("|");
		sql += " Order BY "+sort[0]+" "+sort[1];
	}

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


