'use strict';
/* global $ dayModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var tripModule = (function () {

  // application state

  var days = [],
      currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

  // jQuery event binding

  $(function () {
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });

  function addDay () {
    if (this && this.blur) this.blur(); // removes focus box from buttons

    // Promise latancy


    var newDay = dayModule.create({ number: days.length + 1 }); // dayModule

    days.push(newDay);
    if (days.length === 1) {
      currentDay = newDay;
    }

    $.ajax({
      url: '/api/days',
      method: 'post',
      data: { number: days.length}
    }).then((result)=>{
      console.log('addDay',result);

      days[days.length-1].hotel = result.hotel

      switchTo(newDay);
      
    })
  }

function deleteCurrentDay() {
    // prevent deleting last day
    //console.log(currentDay.number);

    $.ajax({
        url: `/api/days/${currentDay.number}`,
        method: 'delete'
    }).then((result) => {
        if (result) {
            if (days.length < 2 || !currentDay) return;
            // remove from the collection
            var index = days.indexOf(currentDay),
                previousDay = days.splice(index, 1)[0],
                newCurrent = days[index] || days[index - 1];
            // fix the remaining day numbers
            days.forEach(function(day, i) {
                day.setNumber(i + 1);
            });
            switchTo(newCurrent);
            previousDay.hideButton();
        }
    })

}


  // globally accessible module methods

  var publicAPI = {

    load: function () {
      $.ajax({
        url: '/api/days',
        method: 'get'
      }).then((result)=>{
        console.log(result);
        result.forEach((day)=>{
          console.log(day);
          //days.push(day);
          $(addDay);

          //dayModule.create(day);
        })
      })

    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      $.ajax({
        url: `/api/days/${currentDay.number}/${attraction.type}/${attraction.id}`,
        method: 'post'
      }).then((result) => {

      })
      console.log('attraction', attraction);
      console.log('currentDay', currentDay);
      currentDay.addAttraction(attraction);      
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return publicAPI;

}());
