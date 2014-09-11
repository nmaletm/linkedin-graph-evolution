

function GraphViewer() {
    this.images = ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg'];
    this.dates = ['03/12/2013', '25/05/2014', '01/07/2014', '28/07/2014', '25/08/2014'];

    this.legend = [
		{
			fib: 'blue',
			trovit: 'yellow',
			etsetb: 'orange',
			sek: 'pink'
		},
		{
			inlab: 'blue',
			fib: 'orange',
			trovit: 'yellow',
			etsetb: 'pink',
			sek: 'green'
		},
		{
			inlab: 'blue',
			fib: 'orange',
			trovit: 'yellow',
			etsetb: 'pink',
			sek: 'green'
		},
		{
			inlab: 'blue',
			fib: 'orange',
			trovit: 'yellow',
			etsetb: 'pink',
			sek: 'green'
		},
		{
			inlab: 'blue',
			fib: 'orange',
			trovit: 'yellow',
			etsetb: 'pink',
			sek: 'green'
		},
    ];

    this.currentImage = 0;
    this.timer = null;
}

GraphViewer.prototype.init = function() {
	var me = this;
	$("#viewer").attr("src",me.images[me.currentImage]);
	me.updateDate();
	me.updateLegend();

	$('#play').click(function(){
		me.play();
	});

	$('#pause').click(function(){
		me.pause();
	});

	$('#back').click(function(){
		me.back();
	});

	$('#help').click(function(){
		me.track('image','previous', undefined);
		$('#help-information').show();
	});

	$('#help-information').click(function(){
		$('#help-information').hide();
	});

	me.udateControlButtons();

    me.preloadImages();

    me.configureKeyboard();
    me.configureScroll();
    me.configureSwipe();
}; 

GraphViewer.prototype.changeImage = function(animated, next) {
	var me = this;

	if(animated){

		$("#under-viewer").attr("src",me.images[me.currentImage]);
		me.currentImage = next;
		$("#viewer").fadeOut(500, function() {
			$("#viewer").attr("src",me.images[me.currentImage]);
			me.updateDate();
			me.updateLegend();
		}).fadeIn(500, function(){
			me.udateControlButtons();
		});

	} else {
		me.currentImage = next;
		$("#viewer").attr("src",me.images[me.currentImage]);
		me.udateControlButtons();
		me.updateDate();
		me.updateLegend();
	}
	$('#info-title').fadeOut();
};

GraphViewer.prototype.track = function(category, action, label) {
	ga('send', 'event', category, action, label);
};

GraphViewer.prototype.updateLegend = function() {
	var me = this;
	$('#legend-colors').removeClass();
	$('#legend-colors li').removeClass().hide();
    jQuery.each(this.legend[me.currentImage], function(i, val) {
    	console.log(i+'-'+val);
		$('#'+i+'').removeClass().addClass(val).show();
    });
};

GraphViewer.prototype.updateDate = function() {
	var me = this;
	$("#date").html(me.dates[me.currentImage]);
};

GraphViewer.prototype.nextImage = function(animated) {
	var me = this;
	if(me.currentImage == this.images.length-1){
		me.pause();
		return;
	}

	me.changeImage(animated, me.currentImage + 1);
	me.track('image','next', undefined);
}; 

GraphViewer.prototype.previousImage = function(animated) {
	var me = this;
	if(me.currentImage == 0){
		return;
	}

	me.changeImage(animated, me.currentImage - 1);
	me.track('image','previous', undefined);
}; 

GraphViewer.prototype.play = function() {
	var me = this;

	me.nextImage(true);
	if(me.timer != undefined){
		window.clearInterval(me.timer);
	}
	me.timer = setInterval(function () {
		me.nextImage(true);
	}, 3000);

	me.udateControlButtons();
	me.track('control','play',undefined);
}; 

GraphViewer.prototype.pause = function() {
	var me = this;
	window.clearInterval(me.timer);

	delete me.timer;

	me.udateControlButtons();
	me.track('control','pause',undefined);
}; 

GraphViewer.prototype.back = function() {
	var me = this;
	me.currentImage = 0;
    $("#viewer").attr("src",me.images[me.currentImage]);
	me.udateControlButtons();

	me.track('control','back',undefined);
}; 

GraphViewer.prototype.udateControlButtons = function() {
	var me = this;
	$('#help').show();

	if(me.currentImage == this.images.length-1){
		$('#back').show();
		$('#play').hide();
		$('#pause').hide();

	} else {
		$('#back').hide();
		if(me.timer != undefined){
			$('#play').hide();
			$('#pause').show();
		} else {
			$('#play').show();
			$('#pause').hide();
		}
	}
}; 



GraphViewer.prototype.configureKeyboard = function() {
	var me = this;
	$(document).keydown(function(e) {
		switch(e.which){
			case 13: 
			case 32:
			case 110:
				me.nextImage(true);
				me.track('control','keyboard','next');
				break;
			case 8: 
			case 112:
				me.previousImage(true);
				me.track('control','keyboard','previous');
				break;
			case 39:
				me.nextImage(false);
				me.track('control','keyboard','arrow right');
				break;
			case 37:
				me.previousImage(false);
				me.track('control','keyboard','arrow left');
				break;
		}
	});
};

GraphViewer.prototype.configureScroll = function() {
	var me = this;
	$(document).on('DOMMouseScroll mousewheel', function (e) {
		if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { //alternative options for wheelData: wheelDeltaX & wheelDeltaY
			//scroll down
			me.nextImage(false);
			me.track('control','scroll','next');
		} else {
			//scroll up
			me.previousImage(false);
			me.track('control','scroll','previous');
		}
		//prevent page fom scrolling
		return false;
	});
};

GraphViewer.prototype.configureSwipe = function() {
	var me = this;
	$(document).swipe( {
		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			if(direction == 'left'){
				me.nextImage(true);
				me.track('control','swipe','next');
			} else if(direction == 'right'){
				me.previousImage(true);
				me.track('control','swipe','previous');
			}
		},
		//Default is 75px, set to 0 for demo so any distance triggers swipe
		threshold:10
	});

};



GraphViewer.prototype.preloadImages = function() {
    $(this.images).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
};

var viewer;

$(function() {
	viewer = new GraphViewer();
	viewer.init();
});