$('.btn-shorten').on('click', function(){

  $.ajax({
    url: '/add',
    type: 'GET',
    dataType: 'JSON',
    data: {
		url: $('#url-field').val(),
		vanity: $('#url-vanity').val()
	},
    success: function(data){
		console.log( data );
        var resultHTML = '<a class="result" href="' + data.url + '">'
            + data.url + '</a>';
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');
    }
  });

});
