/* eslint-disable camelcase */
var Sequelize = require('sequelize');
var db = require('./_db');
var Hotel = require('./hotel');
var Restaurant = require('./restaurant');
var Activity = require('./activity');

var Day = db.define('day', {
  number: Sequelize.INTEGER
});


Day.belongsTo(Hotel);
Day.belongsToMany(Restaurant, {through: 'restaurantDay'});
Day.belongsToMany(Activity, {through: 'activityDay'});

module.exports = Day;
