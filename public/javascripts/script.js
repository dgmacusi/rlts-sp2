$(document).ready(function(){
  // Show sideNav
  $('.button-collapse').sideNav('show');
  // Hide sideNav
  $('.button-collapse').sideNav('hide');
  // Destroy sideNav
  $('.button-collapse').sideNav('destroy')
  // Initialize collapse button
  $(".button-collapse").sideNav();
  
  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'right', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
  });
  $('select').material_select();

  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button,
    container: undefined, // ex. 'body' will append picker to body
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function(){} //Function for after opening timepicker
  });

  $('.datepicker').pickadate({
      selectMonths: true,
      selectYears: 200, 
      format: 'yyyy-mm-dd'
  });


  $('select#type').on('change', function (event) {
    if (this.value == 'classroom') {
      $('[for="section"]').css('display', 'block')
      $('[for="gradeLevel"]').css('display', 'block')
      $('[for="noOfStudents"]').css('display', 'block')
      $('#section').css('display', 'block')
      $('#gradeLevel').css('display', 'block')
      $('#noOfStudents').css('display', 'block')
    } else {
      $('[for="section"]').css('display', 'none')
      $('[for="gradeLevel"]').css('display', 'none')
      $('[for="noOfStudents"]').css('display', 'none')
      $('#section').css('display', 'none')
      $('#gradeLevel').css('display', 'none')
      $('#noOfStudents').css('display', 'none')
    }
  })

  //$('#fromDate').val(new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDay() + 1s)
  var $from = $('#fromDate.datepicker').pickadate()
  var $to = $('#toDate.datepicker').pickadate()

// Use the picker object directly.
  var fromPicker = $from.pickadate('picker')
  var toPicker = $to.pickadate('picker')

  fromPicker.set('select', new Date().setDate(new Date().getDate() - 7))
  toPicker.set('select', new Date())

});
