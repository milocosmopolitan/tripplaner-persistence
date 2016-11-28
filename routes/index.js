var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../models/hotel');
var Restaurant = require('../models/restaurant');
var Activity = require('../models/activity');


var AttractionRoute = require('./api/attractions');

router.get('/', function(req, res, next) {  
  res.render('index');
});

router.use('/api', AttractionRoute);

module.exports = router;
