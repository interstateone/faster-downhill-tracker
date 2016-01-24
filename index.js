var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var authenticate = function(req, res, next) {
    var token = req.get('X-Auth-Token');
    if (process.env.TOKEN === undefined || token !== process.env.TOKEN) {
        return res.status(401).json({ 'error': '401 Unauthorized' });
    }
    next();
};

app.all('*', authenticate);

app.get('/', function (req, res) {
    res.json({});
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('App listening on port ' + port + '.');
});
