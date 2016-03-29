var express = require('express');
var mongo = require('mongodb')
var db = require('../db');
var router = express.Router();

router.get('/',function(req,res){
    res.redirect('/userlist');
});
/* GET users listing. */
router.get('/userlist', function(req, res) {
  var collection = db.get().collection('user');
  collection.find({},{name:1,surname:1}).toArray(function(err, docs) {
    res.render('userlist', {users: docs})
  })
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User' });
});

router.get('/updateuser/:id', function(req, res) {
    var collection = db.get().collection('user');
    var id = new mongo.ObjectID(req.params.id);
    collection.find({_id:id},{name:1,surname:1}).toArray(function(err, docs){
        res.render('updateuser', { title: 'Update User', user:docs });
    });

});

/* GET New User page. */
router.get('/getuser/:id', function(req, res) {
    var collection = db.get().collection('user');
    var id = new mongo.ObjectID(req.params.id);
    collection.find({_id:id},{name:1,surname:1}).toArray(function(err, docs){
        res.render('getuser',{user:docs,title:'Get User'});
    });
});

router.post('/updateuser/:id', function(req, res) {
    var name = req.body.name;
    var surname = req.body.surname;

    var collection = db.get().collection('user');
    var id = new mongo.ObjectID(req.params.id);
    collection.updateOne({_id:id},{name:name,surname:surname},function(err,doc){
        if (err){
            res.send("There was a problem updating the information to the database.");
        }else{
            res.redirect("/userlist");
        }
    });
});

router.post('/adduser',function(req,res){
  // Get our form values. These rely on the "name" attributes
  var name = req.body.name;
  var surname = req.body.surname;

  // Set our collection
  var collection = db.get().collection('user');

  // Submit to the DB
  collection.insertOne({
    "name" : name,
    "surname" : surname
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("userlist");
    }
  });
});

router.get('/deleteuser/:id',function(req,res){
    // Get our form values. These rely on the "name" attributes
    var collection = db.get().collection('user');
    var id = new mongo.ObjectID(req.params.id);

    collection.deleteOne({
        "_id" : id
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.write("There was a problem deleting the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect('/userlist');
        }
    });
});

module.exports = router;
