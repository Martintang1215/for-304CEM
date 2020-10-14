var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
// 	  if (err) throw err;
// 	  var dbo = db.db("cars");
// 	  dbo.collection('cars').aggregate([
// 	    { $lookup:
// 	       {
// 	         from: 'car_fav',            // 右集合
// 	         localField: 'carid',    // 左集合 join 字段
// 	         foreignField: 'carid',         // 右集合 join 字段
// 	         as: 'collectA'           // 新生成字段（类型array）
// 	       }
// 	     }
// 	    ]).toArray(function(err, result) {
// 	    if (err) throw err;
// 		console.log(JSON.stringify(result))
// 	    db.close();
// 	  });
// 	});
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cars");
    // 删除 test 集合
    dbo.collection("car_fav").drop(function(err, delOK) {  // 执行成功 delOK 返回 true，否则返回 false
        if (err) throw err;
        if (delOK) console.log("集合已删除");
        db.close();
    });
});
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cars");
    dbo.collection("car_fav"). find({}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

// MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("cars");
//     dbo.collection("cars"). find({}).toArray(function(err, result) { // 返回集合中所有数据
//         if (err) throw err;
//         console.log(result);
//         db.close();
//     });
// });