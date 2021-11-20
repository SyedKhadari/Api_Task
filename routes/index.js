var express = require('express');
var router = express.Router();
var monk = require('monk');
var db =  monk('localhost:27017/Sample_Sales', function(err,data){
	if(data){
		console.log('connected')
	}
	else{
		console.log('err')
	}
})
var collection = db.get('Sales');

var moment = require('moment');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function gettimestamp(currentdate,temp)
 {
   var timestamp=currentdate+" "+temp;
       dateTimeParts=timestamp.split(' '),
       timeParts=dateTimeParts[1].split(':'),
       dateParts=dateTimeParts[0].split('-');
 var date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
 return date.getTime();
 }


router.post('/:id/:name/:amount/:date', function(req,res){

	var date = req.params.date;
	var testtime = moment().format('hh:mm');
	var timestamp = gettimestamp(date,testtime);

	var data = {
		id:req.params.id,
		name:req.params.name,
		amount:parseInt(req.params.amount),
		date:req.params.date,
		weekofyear:moment(timestamp).format('w'),
		year:moment(timestamp).format('YYYY'),
		month:moment(timestamp).format('MMM'),
		time:moment().format('hh:mm:ss'),
		hourtime:moment().format('hh')
	}
	collection.insert(data,function(err,docs){
		if(err){
			res.send(err)
		}
		else{
			res.send(docs)
		}
	})
})

router.get('/:id/:name/:amount/:date', function(req,res){

	// console.log(req.params)
	var date = req.params.date;
	var testtime = moment().format('hh:mm');
	var timestamp = gettimestamp(date,testtime);

	var data = {
		id:req.params.id,
		name:req.params.name,
		amount:parseInt(req.params.amount),
		date:req.params.date,
		weekofyear:moment(timestamp).format('w'),
		year:moment(timestamp).format('YYYY'),
		month:moment(timestamp).format('MMM'),
		time:moment().format('hh:mm:ss'),
		hourtime:moment().format('hh')
	}
	collection.insert(data,function(err,docs){
		if(err){
			res.send(err)
		}
		else{
			res.send(docs)
		}
	})
})


router.get('/:daily', function(req,res){
	if(req.params.daily == 'daily'){
		var date = moment().format('DD-MM-YYYY')
		collection.aggregate([{$match:{"date":date}},{$group:{_id:{hourtime:"$hourtime"},Total_Amount:{$sum:"$amount"}}}],function(err,docs){
			if(err){
				res.send(err)
			}
			else{
				res.send(docs)
			}
		})
	}
	else if(req.params.daily == 'weekly'){
		var week = moment().format('w')
		collection.aggregate([{$match:{"weekofyear":week}},{$group:{_id:{Date:"$date"},Total_Amount:{$sum:"$amount"}}}],function(err,docs){
			if(err){
				res.send(err)
			}
			else{
				res.send(docs)
			}
		})
	}
	else if(req.params.daily == 'monthly'){
		var year = moment().format('YYYY')
		var month = moment().format('MMM')
		collection.aggregate([{$match:{"month":month,"year":year}},{$group:{_id:{Date:"$date"},Total_Amount:{$sum:"$amount"}}}],function(err,docs){
			if(err){
				res.send(err)
			}
			else{
				res.send(docs)
			}
		})
	}
	else{
		res.send("Worng Parameter")
	}
})
module.exports = router;