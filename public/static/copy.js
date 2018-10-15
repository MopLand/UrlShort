/*
*	(C)2017 VeryIDE
*	js/copy.js
*	author: Lay veryide@qq.com
*	desc: 复制文案组件
*	date: 2018/05/18
*/
var Copy = {
			
	//复制成功提示
	Succeed: function(){

		//成功提示
		R.toast("success", '已复制，请打开手机淘宝', {'time': 3, 'unique': 'toast'});

		//改写按钮
		Copy.Button.html('已复制');

	},
	
	//使用兼容模式
	Compatibility: function(){

		//自动选择文本
		document.addEventListener("selectionchange", function(e) {
			tkl = document.getElementById("intro");
			window.getSelection().selectAllChildren( tkl );
		}, false);
	
	},

	Init: function( conf ){

		//复制按钮
		Copy.Button = R(conf.button);

		//视图容器
		Copy.Vessel = R(conf.vessel);
		
		//内容容器
		Copy.Content = R(conf.content);

		
		//浏览器支持剪贴板
		if( Copy.Button.attr('display') || !Clipboard.isSupported() ){

			//兼容模式
			Copy.Compatibility();

			//复制文本
			var clipboard = new Clipboard( conf.vessel + 'button' );

			//复制成功
			clipboard.on('success', function (e) {
				console.info('Action:', e.action);
				console.info('Text:', e.text);
				console.info('Trigger:', e.trigger);
				e.clearSelection();
				Copy.Succeed();
			});
		
		}else{
			Copy.Compatibility();
			//复制文本
			var clipboard = new Clipboard( conf.button, {
				text: function(trigger) {
					return R.String( Copy.Content.html() ).stripTags().trim();
				}
			});
			
			//复制成功
			clipboard.on('success', function (e) {
				console.info('Action:', e.action);
				console.info('Text:', e.text);
				console.info('Trigger:', e.trigger);
				e.clearSelection();
				Copy.Succeed();
			});
			
			//复制失败
			clipboard.on('error', function (e) {
				console.error('Action:', e.action);
				console.error('Trigger:', e.trigger);
				Copy.Compatibility();
			});
		
		}
	
	}

};

//初始化组件
Copy.Init( { 'button' : '.copy_tkl', 'content' : '#intro', 'vessel' : '#vessel' } );
