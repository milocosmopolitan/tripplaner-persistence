var router = require('express').Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var DaysRoutes = require('./days');

router.get('/',(req, res, next)=>{
	 Promise.all([
	    Hotel.findAll(),  // = data[0]
	    Restaurant.findAll(), // = data[1]
	    Activity.findAll() // = data[2]
	]).then((data)=>{

		
		res.json({
			hotels: data[0],
			restaurants: data[1],
			activities: data[2]	
		});
		
	})
})

router.get('/hotels', (req, res, next)=>{
	Hotel.findAll().then((hotels)=>{res.json(hotels)});	
})

router.get('/restaurants', (req, res, next)=>{
	Restaurant.findAll().then((restaurants)=>{res.json(restaurants)});	
})

router.get('/activities', (req, res, next)=>{
	Activity.findAll().then((activities)=>{res.json(activities)});	
})

router.use('/days', DaysRoutes)

module.exports = router