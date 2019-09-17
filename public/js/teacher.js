$(function(){
	$('#staff-selector').hide();
	let schoolOptions = $('#school-selector option');
	if (schoolOptions.length == 2) {
		if (schoolOptions[1].val() != '') {
			schoolOptions[1].prop('selected', true);
		}
		if ($('#school-selector').val() != '') {
			populateStaffList();
		}
	}
	$('#school-selector').on('change', function(e){
		populateStaffList();
	});

	$('#staff-selector').on('change', function(e){
		if ($(this).val() != '') {
			$('#impersonate-button').prop('disabled', false);
		} else {
			$('#impersonate-button').prop('disabled', true);
		}
	});

	$('#breakfast-count-form button').on('click', function(e){
		e.preventDefault();
		populateConfirmationModal($('#breakfast-count-form'));
		$('#confirmModal').modal();
	});
	$('#confirm-submission').on('click', function(e){
		$('#breakfast-count-form').submit();
	});
});

const populateStaffList = () => {
	let schoolId = $('#school-selector').val();
	$('#staff-selector').html('');
	$('#staff-selector').hide();
	$('#staff-selector').siblings().remove();
	if (schoolId != '') {
		$('#staff-selector').parent().append('<p>Loading...</p>');
		$.ajax({
			url: '/admin/stafflist/' + schoolId,
			success: function(response) {
				$('#staff-selector').siblings().remove();
				if (Array.isArray(response) && response.length > 0) {
					$.each(response, function(index, staff){
						let newOption = $('<option>');
						newOption.text(staff.fullname);
						newOption.val(staff.email);
						$('#staff-selector').append(newOption);
					});
					$('#staff-selector').prepend('<option value="" selected>Select a teacher...</option>');
					$('#staff-selector').show();
				} else {
					$('#staff-selector').parent().append('<p>No staff found for this school.</p>');
				}
			}
		});
	}
}

const populateConfirmationModal = (that) => {
	let modalBody = $('#confirmModal .modal-body');
	modalBody.html('');
	let checkedStudents = $(that).find('input[type="checkbox"]:checked');
	console.log(checkedStudents);
	if (checkedStudents.length > 0) {
		let studentList = $('<ul class="checked-list">');
		let student = checkedStudents.length == 1 ? 'student' : 'students';
		let message = $('<p>The following ' + student + ' took a breakfast:</p>');
		checkedStudents.each(function( index ){
			let studentName = $(this).closest('td').prev('td').text();
			studentList.append('<li>' + studentName + '</li>');
		});
		modalBody.append(message);
		modalBody.append(studentList);
	} else {
		let message = $('<p>No students took breakfast this morning.</p>');
		modalBody.append(message);
	}
	modalBody.append('<p>Is this correct?</p>');
}