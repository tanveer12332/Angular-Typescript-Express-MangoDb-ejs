/// <reference path='./../typings/tsd.d.ts' />
var express = require('express');
var loggar = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//local path
var mongojs = require('mongojs');
var viewRenderEngine = require('ejs');
var db = mongojs('meanteckapp', ['meanteckapp']);
var app = express();
//app.use(express.static(__dirname + "/public"));
app.use(express.static("./public"));
app.use(bodyParser.json());
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(loggar('Server started'));
app.use(cookieParser());
app.use(session({
    secret: 'keyboardcat',
    resave: true,
    saveUninitialized: true
}));
//check route error
app.use(function (err, req, res, next) {
    console.log(err + ":" + "Error");
    res.send(err);
});
//custom middleware
app.use(function (req, res, next) {
    console.log('this is first middle ware');
    next();
});
//import routes= require('./controllers/main');
//routes.homereq
//app.get('/',routes.homereq);
/*app.use(logger1('/ab'));

function logger1(prefix){
    return function (req, res, next){
    console.log(prefix + ': ' + req.url.toString());
    if(prefix== "ab"){
        
        next();
    } else{
        next("error");
    }
}
}*/
//monting 
app.use('/admin', function (req, res, next) {
    //console.log("admin routes");
    console.log(req.cookies);
    //confirm.log(req.session);
    res.send('admin routes');
    next();
});
app.get('/', function (req, res, next) {
    console.log('/ login middleware called');
    next();
}, function (req, res) {
    res.render("login", {
        title: "MEAN STACK",
        classname: "white"
    });
});
app.get('/dashbord', function (req, res, next) {
    console.log('i received dashbord middleware users');
    next();
}, function (req, res) {
    res.render('index');
});
app.get('/getcontacts', function (req, res) {
    console.log('I received GET http requrest');
    db.meanteckapp.find(function (err, docs) {
        //
        //console.log(docs);
        res.json(docs);
    });
});
app.post('/setcontacts', function (req, res) {
    console.log('i received POST http request');
    db.meanteckapp.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});
app.delete('/delcontacts/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id + 'i received delete request');
    db.meanteckapp.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    });
});
app.get('/editcontacts/:id', function (req, res) {
    var id = req.params.id;
    //	console.log(id +"i received Edit contact  request");
    db.meanteckapp.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
        res.json(doc);
    });
});
app.put('/updatecontact/:id', function (req, res) {
    var id = req.params.id;
    db.meanteckapp.findAndModify({
        query: { _id: mongojs.ObjectId(id) },
        update: { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone, address: req.body.address, city: req.body.city, country: req.body.country, designation: req.body.designation } },
        new: true }, function (err, doc) {
        res.json(doc);
    });
});
app.get('/searchcontact/:userSearch', function (req, res) {
    var userSearch = req.params.userSearch;
    db.meanteckapp.find({ name: { $in: [userSearch] } }, function (err, doc) {
        for (var i = 0; i < doc.length; i++) {
            if ((doc[i].name) == userSearch) {
                res.json(doc);
                console.log(doc[i].name);
                return;
            }
        }
        console.log("User Not Found");
    });
});
///server setting 
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    var listeningPort = server.address().port;
    console.log('The Server is listening on port: ' + listeningPort);
});
