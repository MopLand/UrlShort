/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
  $('body').on('click', '.page-scroll a', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top
    }, 400, 'easeInOutExpo');
    event.preventDefault();
  });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
  target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  $('.navbar-toggle:visible').click();
});

$('form[name=create]').on('submit', function(){
	
	var self = this;

	$.ajax({
		url: '/add',
		type: 'GET',
		dataType: 'JSON',
		data: {
			url: $('[name=url]', self).val(),
			vanity: $('[name=vanity]', self).val()
		},
		success: function(data){
			//console.log( data );		
			if( data.result ){
				$('#create_result').show();
				$('#create_result b').html( data.url ).show().fadeIn('slow');
				//$('#create_result').hide().fadeIn('slow');
			}else{
				$('#create_wrong').show().fadeIn('slow');
			}
		}
	});
	
	return false;

});

$('form[name=decode]').on('submit', function(){
	
	var self = this;

	$.ajax({
		url: '/whatis',
		type: 'GET',
		dataType: 'JSON',
		data: {
			url: $('[name=url]', self).val()
		},
		success: function(data){
			//console.log( data );		
			if( data.result ){
				$('#decode_result').show();
				$('#decode_result b').html( data.url ).show().fadeIn('slow');
				//$('#create_result').hide().fadeIn('slow');
			}else{
				$('#decode_wrong').show().fadeIn('slow');
			}
		}
	});
	
	return false;

});

$('form[name=statis]').on('submit', function(){
	
	var self = this;

	$.ajax({
		url: '/statis',
		type: 'GET',
		dataType: 'JSON',
		data: {
			url: $('[name=url]', self).val()
		},
		success: function(data){
			//console.log( data );		
			if( data.result ){
				$('#statis_result').show();
				$('#statis_result b').html( data.url ).show().fadeIn('slow');
				//$('#create_result').hide().fadeIn('slow');
			}else{
				$('#statis_wrong').show().fadeIn('slow');
			}
		}
	});
	
	return false;

});

$(function() {
  // api-key
  ZeroClipboard.config({
    swfPath: 'js/zeroclipboard.swf'
  });
  var zeroClientKey = new ZeroClipboard($('.bg-box a.txt-copy'));
  zeroClientKey.on('ready', function(e) {
    zeroClientKey.on('copy', function(e) {
      e.clipboardData.setData('text/plain', $(e.target).children('b').text());
    }).on('aftercopy', function(e) {
      $(e.target).children('small.txt-tip').html('<i class="fa fa-check"></i> 复制成功');
    })
  });
  // charts
  var dChart = $('#hours-chart');
  if (dChart.length) {
    var start = dChart.attr('data-start'), x = [], i, s;
    var d = new Date(), t;
    d.setFullYear('20' + start.substr(0, 2));
    d.setMonth(parseInt(start.substr(2, 2), 10) - 1);
    d.setDate(parseInt(start.substr(4, 2), 10));
    d.setHours(parseInt(start.substr(6, 2), 10));
    d.setMinutes(0);
    d.setSeconds(0);
    t = d.getTime();
    for (i = 0; i < 24; ++i) {
      s = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' +
          d.getDate() + ' ' + d.getHours() + ':00';
      x.push(s);
      t += 3600000;
      d.setTime(t);
    }
    dChart.highcharts({
      chart: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        spacing: [ 20, 0, 0, 0 ]
      },
      title: null,
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: x,
        tickInterval: 3,
        labels: {
          style: { fontSize: '9px' },
          formatter: function() {
            return this.value.substr(this.value.indexOf(' ') + 1);
          }
        }
      },
      yAxis: {
        min: 0,
        title: { text: '24小时 访问量/独立访客' }
      },
      tooltip: {
        shared: true,
        crosshairs: { dashStyle: 'solid', color: 'rgba(44, 62, 80, 0.1)' }
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 1,
            lineColor: Highcharts.getOptions().colors[0],
            lineWidth: 1
          }
        }
      },
      series: [{
        type: 'spline',
        name: '访问量',
        data: JSON.parse(dChart.attr('data-data'))
      }, {
        type: 'column',
        name: '独立访客',
        data: JSON.parse(dChart.attr('data-data-uv')),
        color: Highcharts.getOptions().colors[2]
      }]
    });
  }
  dChart = $('#domains-chart');
  if (dChart.length) {
    var data = [], i, d = JSON.parse(dChart.attr('data-data'));
    for (i in d) {
      if (d.hasOwnProperty(i)) {
        data.push({
          name: i,
          y: d[i]
        });
      }
    }
    dChart.highcharts({
      chart: {
        type: 'pie',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        spacing: [ 10, 0, 0, 0 ]
      },
      title: null,
      credits: { enabled: false },
      legend: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: { enabled: false }
        }
      },
      series: [{
        name: '访问量',
        data: data
      }]
    });
  }
  dChart = $('#locations-chart');
  if (dChart.length) {
    var data = [], i, d = JSON.parse(dChart.attr('data-data'));
    for (i in d) {
      if (d.hasOwnProperty(i)) {
        data.push({
          name: i,
          y: d[i]
        });
      }
    }
    dChart.highcharts({
      chart: {
        type: 'pie',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        spacing: [ 10, 0, 0, 0 ]
      },
      title: null,
      credits: { enabled: false },
      legend: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: { enabled: false }
        }
      },
      series: [{
        name: '访问量',
        data: data
      }]
    });
  }
});
