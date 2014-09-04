

function GraphViewer() {
    this.images = ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg'];
    this.currentImage = 0;
    this.timer = null;
}

GraphViewer.prototype.init = function() {
	var me = this;
	$("#viewer").attr("src",me.images[me.currentImage]);

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
			me.udateControlButtons();
		}).fadeIn(500, function(){
			me.udateControlButtons();
		});

	} else {
		me.currentImage = next;
		$("#viewer").attr("src",me.images[me.currentImage]);
		me.udateControlButtons();
	}
	$('#info-title').fadeOut();
};

GraphViewer.prototype.nextImage = function(animated) {
	var me = this;
	if(me.currentImage == this.images.length-1){
		me.pause();
		return;
	}

	me.changeImage(animated, me.currentImage + 1);
}; 

GraphViewer.prototype.previousImage = function(animated) {
	var me = this;
	if(me.currentImage == 0){
		return;
	}

	me.changeImage(animated, me.currentImage - 1);
}; 

GraphViewer.prototype.play = function() {
	var me = this;

	me.nextImage(true);
	me.timer = setInterval(function () {
		me.nextImage(true);
	}, 2000);

	me.udateControlButtons();

}; 

GraphViewer.prototype.pause = function() {
	var me = this;
	window.clearInterval(me.timer);

	delete me.timer;

	me.udateControlButtons();
}; 

GraphViewer.prototype.back = function() {
	var me = this;
	me.currentImage = 0;
    $("#viewer").attr("src",me.images[me.currentImage]);
	me.udateControlButtons();

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
				break;
			case 8: 
			case 112:
				me.previousImage(true);
				break;
			case 39:
				me.nextImage(false);
				break;
			case 37:
				me.previousImage(false);
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
		} else {
			//scroll up
			me.previousImage(false);
		}
		//prevent page fom scrolling
		return false;
	});
};

GraphViewer.prototype.configureSwipe = function() {
	var me = this;
	$(document).swipe( {
		tap:function(event, target) {
			me.nextImage(true);
		},
		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			if(direction == 'left'){
				me.nextImage(true);
			} else if(direction == 'right'){
				me.previousImage(true);
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