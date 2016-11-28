var router = require('express').Router();
var Day = require('../../models/day');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');

router.get('/', (req, res, next)=>{
	Day.findAll().then((days)=>{
		res.json(days);
	})	
})

router.post('/', (req, res, next)=>{
	console.log(req.body);

	Day.findOrCreate({
		where: { number: parseInt(req.body.number) },
		include: [
			{ model: Hotel, require: false },
			{ model: Restaurant, require: false },
			{ model: Activity, require: false }
		]
	}).spread((result, created)=>{

		console.log('plain', result.get({
          plain: true
        }))

		console.log('day find or create', result);
		res.json(result);
	})
})

router.post('/:id/:attraction', (req, res, next)=>{
	res.json(req.body);
})

router.put('/', (req, res, next)=>{
	
})

router.delete('/:number', (req, res, next)=>{
	Day.destroy({
		where:{
			number : req.params.number
		}
	}).then((result)=>{
		let bool = true;
		if(result <= 0) bool = false; 
		
		res.json(bool);
	})
})


router.post('/:number/hotel/:typeId', (req, res, next)=>{
	Day.update({
		hotelId: req.params.typeId,
	}, {
		where:{
			number : req.params.number
		},
		returning: true,
  		plain: true
	}).then((result)=>{
		res.json(result);
	})
	
})

module.exports = router