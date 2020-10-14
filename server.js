var http = require('http');
var path = require('path');
var fs = require("fs");
var mime = require("mime");
var urlH = require("url");
var qs = require('querystring');
var formidable = require('formidable');
var MongoClient = require('mongodb').MongoClient;
var dburl = "mongodb://localhost:27017/";
http.createServer(function(req, res) {

	res.render = function(filename) {
		fs.readFile(filename, function(err, data) {
			if (err) {
				res.writeHead(404);
				res.write("Not Found!");
			} else {
				res.setHeader('Content-Type', mime.getType(filename));
				res.write(data);
			}
			res.end();
		});
	}
	var url = req.url;
	var method = req.method.toLowerCase();
	if (url.startsWith("/index")) {
		if (method === 'get') {
			res.render(path.join(__dirname, 'views', 'index.html'));
		}
	} else if (url.startsWith("/login")) {
		if (method === 'get') {
			res.render(path.join(__dirname, 'views', 'login.html'));
		} else if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				var username = postBody.username;
				var password = postBody.password;
				console.log(postBody);
				findUserByInfo(postBody, res);
			});
		}
	} else if (url.startsWith("/regist")) {
		if (method === 'get') {
			res.render(path.join(__dirname, 'views', 'regist.html'));
		} else if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8");
				postBody = qs.parse(postBody);
				regist(postBody, res);
			});
		}
	} else if (url.startsWith("/findByUsername")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				findUserByUserName(postBody, res);
			});
		}
	} else if (url.startsWith("/findMycar")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				console.log(postBody);
				findMycar(postBody, res);
			});
		}
	}else if (url.startsWith("/findMyFav")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				findMyFav(postBody, res);
			});
		}
	}
	
	else if (url.startsWith("/deleteMycar")) {
		if (method === 'delete') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				deleteMycar(postBody, res);
			});
		}
	} else if (url.startsWith("/delFav")) {
		if (method === 'delete') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8")
				postBody = qs.parse(postBody);
				delFav(postBody, res);
			});
		}
	}   
	else if (url.startsWith("/publishCar") && method === 'post') {
		var form = new formidable.IncomingForm();
		var targetFile = path.join(__dirname, './public/img');
		form.uploadDir = targetFile;
		form.parse(req, function(err, fields, files) {
			if (err) throw err;
			var oldpath = files.cardImage.path;
			var newpath = path.join(path.dirname(oldpath), files.cardImage.name);
			fs.rename(oldpath, newpath, (err) => {
				if (err) throw err;
				var imgSrc = "/public/img/" + files.cardImage.name;
				var data = {
					cardInfo: fields.cardInfo,
					oldPrice: fields.oldPrice,
					imgSrc: imgSrc,
					nowPrice: fields.nowPrice,
					buyDate: fields.buyDate,
					mileage: fields.mileage,
					userid: fields.userid
				};
				publishCar(data, res);
			})
		});
	}else if (url.startsWith("/updateMyCar") && method === 'post') {
		console.log("updateMyCar begin")
		var form = new formidable.IncomingForm();
		var targetFile = path.join(__dirname, './public/img');
		form.uploadDir = targetFile;
		form.parse(req, function(err, fields, files) {
			if (err) throw err;
			var oldpath = files.updateImage.path;
			var newpath = path.join(path.dirname(oldpath), files.updateImage.name);
			fs.rename(oldpath, newpath, (err) => {
				if (err) throw err;
				var imgSrc = "/public/img/" + files.updateImage.name;
				var data = {
					cardInfo: fields.cardInfo,
					oldPrice: fields.oldPrice,
					imgSrc: imgSrc,
					nowPrice: fields.nowPrice,
					buyDate: fields.buyDate,
					mileage: fields.mileage,
					userid: fields.userid,
					carid:fields.carid
				};
				updateMyCar(data, res);
			})
		});
	} else if (url.startsWith("/addFav")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8");
				postBody = qs.parse(postBody);
				addFav(postBody, res);
			});
		}
	}else if(url.startsWith("/findCars")) {
		if (method === 'post') {
			var array = [];
			req.on('data', function(chunk) {
				array.push(chunk);
			});
			req.on('end', function() {
				var postBody = Buffer.concat(array);
				postBody = postBody.toString("utf8");
				postBody = qs.parse(postBody);
				console.log(postBody.userid);
				if(postBody.userid == '-1')
				{
					findCars1(postBody, res);
				}else
				{
					findCars(postBody, res);
				}
				
			});
		}
	}else if (url.startsWith("/public") && method === 'get') {
		res.render(path.join(__dirname, url));
	} else {
		console.log("Requested URL is: " + req.url);
		res.end();
	}
}).listen(9999, function() {
	console.log("Server is running");
})

var dbName = "cars";

function regist(data, res) {
	data.uuid = guid();
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		dbo.collection("users").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}
function addFav(data, res) {
	data.uuid = guid();
	console.log(data)
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		dbo.collection("car_fav").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}

function findUserByInfo(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var whereStr = {
			"username": data.username,
			'password': data.password
		};
		dbo.collection("users").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
			if (result.length == 1) {
				res.end(result[0].uuid);
			} else {
				res.end("error");
			}
			db.close();
		});
	});
}

function findUserByUserName(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var whereStr = {
			"username": data.username
		};
		dbo.collection("users").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
			// console.log(result)
			if (result.length <= 0) {
				res.end("success");
			} else {
				res.end("error");
			}
			db.close();
		});
	});
}
function findMycar(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var whereStr = {
			"userid": data.userid
		};
		dbo.collection("cars").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
			// console.log(result)
			res.end(JSON.stringify(result));
			db.close();
		});
	});
}
function deleteMycar(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
		var whereStr = {
			"carid": data.carid
		};
		console.log(whereStr)
	    dbo.collection("cars").deleteOne(whereStr, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});
}
function delFav(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
		var whereStr={carid:data.carid,userid:data.userid}
		console.log(whereStr)
	    dbo.collection("car_fav").deleteOne(whereStr, function(err, obj) {
	        if (err) throw err;
			res.end("success");
			db.close();
	    });
	});
}
function publishCar(data, res) {
	var uuid=guid();
	data.carid=uuid;
	console.log(data);
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		dbo.collection("cars").insertOne(data, function(err, result) {
			if (err) throw err;
			res.end("success");
			db.close();
		});
	});
}
function findCars1(data, res) {
	MongoClient.connect(dburl, {
		useNewUrlParser: true
	}, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var whereStr = {
			
		};
		dbo.collection("cars").find(whereStr).toArray(function(err, result) { 
			if (err) throw err;
			// console.log(result)
			res.end(JSON.stringify(result));
			db.close();
		});
	});
}
function findCars(data,res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(dbName);
	  var userid=data.userid;
	  dbo.collection('cars').aggregate([
	    { $lookup:
	       {
	         from: 'car_fav',            
	         localField: 'carid',    
	         foreignField: 'carid',     
	         as: 'collectA'           
	       }
	     }
	    ]).toArray(function(err, result) {
	    if (err) throw err;
		var resultArr=[];
		for(var i=0;i<result.length;i++)
		{
			var collectA = result[i].collectA;
			console.log('collectA.length:'+collectA.length);
			if(collectA.length<=0)
			{
				result[i].isCollect=false;
				delete result[i].collectA;
				resultArr.push(result[i]);
				continue;
			}
			var isCollect =false;
			for(var j=0;i<collectA.length;j++)
			{
				console.log('collectA[j].userid:'+collectA[j].userid);
				if(collectA[j].userid==userid)
				{
					isCollect = true;
					break;
				}
			}
			result[i].isCollect=isCollect;
			delete result[i].collectA;
			resultArr.push(result[i]);
		}
		res.end(JSON.stringify(resultArr));
	    db.close();
	  });
	});
}

function findMyFav(data,res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(dbName);
	  dbo.collection('car_fav').aggregate([
	    { $lookup:
	       {
	         from: 'cars',           
	         localField: 'carid',    
	         foreignField: 'carid',  
	         as: 'carInfo'           
	       }
	     }
	    ]).toArray(function(err, result) {
	    if (err) throw err;
		res.end(JSON.stringify(result));
	    db.close();
	  });
	});
}
function updateMyCar(data, res) {
	MongoClient.connect(dburl, { useNewUrlParser: true }, function(err, db) {
	    if (err) throw err;
	    var dbo = db.db(dbName);
	    var whereStr = {"carid":data.carid};  
		console.log(whereStr)
		var updata = {
			cardInfo: data.cardInfo,
			oldPrice: data.oldPrice,
			imgSrc: data.imgSrc,
			nowPrice: data.nowPrice,
			buyDate: data.buyDate,
			mileage: data.mileage
		};
		
	    var updateStr = {$set: updata};
		console.log(updata)
	    dbo.collection("cars").updateOne(whereStr, updateStr, function(err, obj) {
	       if (err) throw err;
	       res.end("success");
	       db.close();
	    });
	});
}
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
