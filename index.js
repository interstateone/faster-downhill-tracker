var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var bodyParser = require('body-parser');
var Point = require('./point.js');

var app = express();
app.use(bodyParser.json());

if (process.env.DEBUG) {
    mongoose.connect('mongodb://localhost/tracker');
}
else {
    var dbUsername = process.env.DB_USERNAME;
    var dbPassword = process.env.DB_PASSWORD;
    var dbHost = process.env.DB_HOST;
    var dbPort = process.env.DB_PORT;
    mongoose.connect('mongodb://'+dbUsername+':'+dbPassword+'@'+dbHost+':'+dbPort+'/tracker');
}

var authenticate = function(req, res, next) {
    var token = req.get('X-Auth-Token');
    
    var tokenIsCorrect = process.env.TOKEN !== undefined && token === process.env.TOKEN;
    var pathRequiresAuthentication = req.path !== '/points/latest';
    if (!tokenIsCorrect && pathRequiresAuthentication) {
        return res.status(401).json({ error: '401 Unauthorized' });
    }
    
    if (tokenIsCorrect) {
        req.authenticated = true;
    }

    next();
};

app.all('*', authenticate);

app.get('/', function (req, res) {
    res.json({});
});

app.post('/points', function (req, res, next) {
    var point = new Point({
        name: req.body.name, 
        inside: req.body.inside,
        date: moment(req.body.date),
        coordinates: [req.body.longitude, req.body.latitude]
    });

    point.save(function (err) {
        if (err) return next(err);
        res.status(201).json(point);
    });
});

app.get('/points', function (req, res, next) {
    Point.find().sort({ date: -1 }).exec(function(err, points) {
        if (err) return next(err);
        res.json(points);
    });
});

app.get('/points/latest', function (req, res, next) {
    Point.findOne().sort({ date: -1 }).exec(function(err, point) {
        if (err) return next(err);
        if (req.authenticated) {
            res.json(point);
        }
        else {
            res.json({
                name: point.name,
                inside: point.inside
            });    
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port ' + port + '.');
});
