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
});
