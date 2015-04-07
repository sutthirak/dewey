var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var nconf = require('nconf');
var mongoose = require('mongoose')
var google = require('googleapis')

nconf.file({ file: 'config.json' });

var app = express();
app.use(express.static('public'))
app.use(express.static('bower_components'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(multer())

var Schema = mongoose.Schema;
var topicSchema = new Schema({
    name: String,
    description: String,
    user: {id: String,name: String,image: String},
    startDate: Date,
    endDate: Date
})
mongoose.connect('mongodb://localhost/dewey')
var Topic = mongoose.model('Topic',topicSchema)

var googleClientId = nconf.get('google-api:client-id');
var googleClientSecret = nconf.get('google-api:client-secret');
var googleRedirectUrl = nconf.get('google-api:redirect-url');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(googleClientId,googleClientSecret,googleRedirectUrl);
var plus = google.plus('v1');
var scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/calendar'
];

//middleware
app.use(function(req, res, next) {
    next();
})

app.get('/login',function(req, res) {
    var url = oauth2Client.generateAuthUrl({scope: scopes});
    res.redirect(url);
})

app.get('/token/:token',function(req, res){
    oauth2Client.setCredentials({access_token: req.param('token')});
    plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
        res.send('{"token":"'+req.param('token')+'","id":'+response.id+',"name":"'+response.displayName+'","image":"'+response.image.url+'"}')
    });
})

app.get('/oauth2callback',function(req, res){
    oauth2Client.getToken(req.query.code, function(err, tokens) {
        res.redirect("/index.html#?code="+tokens.access_token);
    });
})

app.get('/topics',function(req, res){
    Topic.find(null).sort({_id: 'desc'}).exec(function(err, docs) {
        res.send(docs);
    });
})

app.post('/topics',function(req, res){
    var newTopic = new Topic(req.body)
    newTopic.save(function (err) {
        if (err) {
            console.log('can not save')
        }
    });
    res.status(200)
    res.send(req.body)
})

app.put('/topics/:id',function(req, res){
    var objectId = mongoose.Types.ObjectId(req.param('id'))
    Topic.findByIdAndUpdate(objectId,req.body, function(){
        res.status(204)
        res.send()
    })
})

app.delete('/topics/:id',function(req, res){
    var objectId = mongoose.Types.ObjectId(req.param('id'))
    Topic.findByIdAndRemove(objectId, function(){
        res.status(204)
        res.send()
    })
})

var server = app.listen(9002, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Dewey listening at http://%s:%s', host, port)
})
