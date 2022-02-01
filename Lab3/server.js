var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080;
const uri = "mongodb://127.0.0.1:27017";

const MongoClient = require('mongodb').MongoClient;

var port = PORT;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/Just Some User Input.html');
});

app.route('/login')
.get(function(req, res) {
    res.send('this is the login form');
    var output = 'processing the login form...'
    var input1 = req.query.input1;
    var input2 = req.query.input2;
    console.log('The params:' + req.query.input1 + " " + req.query.input2);
    
    MongoClient.connect(uri, function (err, db) {
        if(err) throw err;
        console.log('Start the database stuff');
        var dbo = db.db("mydb");
        var myobj = { firstInput: input1, secondInput: input2 };
        dbo.collection("users").insertOne(myobj, function(err, res) {
            if(err) throw err;
            console.log("1 user inserted");
            db.close();
        })
        console.log('End of database stuff');
    });
    
})
.post(function(req, res) { console.log('processing');
    res.send('processing the login form!');
});

var adminRouter = express.Router();

adminRouter.use(function(req, res, next) {
    console.log(req.method, req.url);
    next(); 
});

adminRouter.get('/', function(req, res) {
 res.send('I am the dashboard!'); });

adminRouter.get('/users', function(req, res) {
 res.send('I show all the users!'); });

adminRouter.param('name', function(req, res, next, name) {
    console.log('doing name validations on ' + name);
    req.name = name;
    next();
    });

adminRouter.get('/users/:name', function(req, res) {
    res.send('hello ' + req.name + '!'); 
});

adminRouter.get('/posts', function(req, res) {
    res.send('I show all the posts!'); 
});

app.use('/admin', adminRouter);

app.listen(PORT);
console.log('Express Server running at http://127.0.0.1:'.PORT);