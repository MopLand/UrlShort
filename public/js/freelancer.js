/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

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


$('.clear-url').click(function() {
	$('form[name=create] input[name=url]').val('').focus();
	$('#create_wrong, #create_qrcode').hide();
	$('#create_result').hide();
});

$('form[name=create]').on('submit', function(){

	var self = this;
	var url = $('[name=url]', self).val();
	var vanity = $('[name=vanity]', self).val();

	url && $.ajax({
		url: '/add',
		type: 'GET',
		dataType: 'JSON',
		data: {
			url: url,
			vanity: vanity
		},
		success: function(data){
			//console.log( data );

			$('#create_wrong, #create_qrcode').hide();
			$('#create_result').hide();

			if( data.result ){
				$('#create_result').show();
				$('#create_result b').html( data.url ).show().fadeIn('slow');
				$('#create_result label').html( '生成短网址' );
				$('#create_qrcode').show().fadeIn('slow');
				$('#create_qrcode img').attr('src','https://api.qrserver.com/v1/create-qr-code/?data='+ data.url);
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
	var url = $('[name=url]', self).val();

	url && $.ajax({
		url: '/whatis',
		type: 'GET',
		dataType: 'JSON',
		data: {
			url: url
		},
		success: function(data){

			//console.log( data );
			$('#decode_result, #decode_wrong').hide();

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
	var url = $('[name=url]', self).val();

	url && $.ajax({
		url: '/statis',
		type: 'GET',
		dataType: 'JSON',
		data: {
			url: url
		},
		success: function(data){
			//console.log( data );
			if( data.result ){

				$('#bind_click').html( data.click + '<small>访问量</small>' );
				$('#bind_visit').html( data.visit + '<small>独立访客</small>' );

				$('#hours-chart').attr( 'data-start', data.start ).attr( 'data-ip', '['+ data.ip +']' ).attr( 'data-uv', '['+ data.uv +']' );

				if( data.referer ){
					$('#domains-chart').attr( 'data-data', JSON.stringify( data.referer ) );
				}else{
					$('#domains-chart').remove();
					$('#bind_referer').html('<h3 class="no-data">暂无数据<small>来源分布</small></h3>');
				}

				if( data.region ){
					$('#locations-chart').attr( 'data-data', JSON.stringify( data.region ) );
				}else{
					$('#locations-chart').remove();
					$('#bind_region').html('<h3 class="no-data">暂无数据<small>地区分布</small></h3>');
				}

				//$('#statis_result b').html( data.url ).show().fadeIn('slow');
				$('#statis_result').show().fadeIn('slow');

				/////////////////////////

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
					data: JSON.parse(dChart.attr('data-uv'))
				  }, {
					type: 'column',
					name: '独立访客',
					data: JSON.parse(dChart.attr('data-ip')),
					color: Highcharts.getOptions().colors[2]
				  }]
				});
			  }

			  ///////////////////////////////////////

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

			  ///////////////////////////////////////

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

			}else{
				$('#statis_wrong').show().fadeIn('slow');
			}
		}
	});

	return false;

});

$(function() {

	var clipboard = new ClipboardJS('.bg-box a.txt-copy', {
		text: function(trigger) {
			return $(trigger).children('b').text();
		}
	});

	clipboard.on('success', function(e) {
		$(e.trigger).children('small.txt-tip').html('<i class="fa fa-check"></i> 复制成功');
	});

	clipboard.on('error', function(e) {
		console.error('Action:', e.action);
		console.error('Trigger:', e.trigger);
	});

});
