
var myDB = require('../DBHelper');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	console.log('req.query',req.query);
	console.log('req.query.sort',req.query.sort);
	// var sql = " SELECT "+
	// 		" f.YearMonth as '年度月份', "+
	// 		" f.PlayerName as'球員名稱', "+
	// 		" f.HitL AS '打擊L' , "+
	// 		" f.HitR as '打擊R' , "+
	// 		" f.Pow as '力量' , "+
	// 		" f.Eye as '選球' , "+
	// 		" f.Agi as '跑壘' , "+
	// 		" f.Def as '守備' , "+
	// 		" f.Pass as '傳球' , "+
	// 		" pl.LevelName as '卡片等級' , "+
	// 		" t.TeamNameEN as '隊伍' , "+
	// 		" p.PositionName as '守位' ,"+
	// 		" fp.Value as '守備適性' "+
	// 		" FROM "+
	// 		" team t , "+
	// 		" fielderteam ft , "+
	// 		" playerlevel pl , "+
	// 		" fielder f "+
	// 		" left join fielderposition fp on fp.FielderID = f.ID "+
	// 		" left join dposition p on fp.PositionID = p.ID "+
	// 		" WHERE "+
	// 		" f.ID = ft.fielderID AND t.ID = ft.teamID "+
	// 		" AND f.PlayerLevel = pl.ID ";
	// var sql = " SELECT "+
 //    " f.YearMonth AS '年度月份', "+
 //    " f.PlayerName AS '球員名稱', "+
 //    " f.HitL AS '打擊L', "+
 //    " f.HitR AS '打擊R', "+
 //    " f.Pow AS '力量', "+
 //    " f.Eye AS '選球', "+
 //    " f.Agi AS '跑壘', "+
 //    " f.Def AS '守備', "+
 //    " f.Pass AS '傳球', "+
 //    " FLOOR((f.HitL+f.HitR+f.Pow+f.Eye+f.Agi+f.Def+f.Pass)/7) as '評價', "+
 //    " pl.LevelName AS '卡片等級', "+
 //    " GROUP_CONCAT(DISTINCT t.TeamNameAlias) AS '隊伍', "+
 //    " GROUP_CONCAT(p.PositionName, '-', fp.Value) AS '守備適性' "+
	// " FROM "+
	//     " playerlevel pl, "+
	//     " fielder f "+
	//     "    LEFT JOIN "+
	//     " fielderposition fp ON f.ID = fp.FielderID "+
	//     "    LEFT JOIN "+
	//     " fielderteam ft ON f.ID = ft.FielderID "+
	//     "    LEFT JOIN "+
	//     " dposition p ON fp.PositionID = p.ID "+
	//     "    LEFT JOIN "+
	//     " team t ON ft.TeamID = t.ID "+
	// " WHERE "+	
	//     "f.PlayerLevel = pl.ID "+
	// " GROUP BY f.ID , pl.ID; ";
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

	//console.log(sql);
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


