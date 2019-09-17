$(function(){
	$('#search-form').on('submit', function(e){
		$('#search-button').attr('disabled', true).text('Please wait...');
	});
});
