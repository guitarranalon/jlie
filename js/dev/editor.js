/*
The editor itself, setting the UI and its functions
*/

$(document).ready(function(){
var editorModule = (function(){

	/* The image canvas and the path to the image to work with */
	var imageCanvas,
		   pathToImage,
		   image,
		   filterValues = {
			exposure: 0,
			contrast: 0,
			brightness: 0,
			vibrance: 0,
			saturation: 0,
			sharpen: 0
		   };


	/*  The handler for the sliders, which updates the value of the parameter
		to allow the user know how much effect is applying */
	var sliderHandler = function( event, ui ) {
		$(this).find('.parameter').text(ui.value);
	};
	
	/*
		Resets the image, applies the filters and renders the processed image (updating the histogram)
	*/
	var imageRender = function(){
		image.revert(function(){
			filterChain.handleFilter(image, filterValues);
			image.render(updateHistogram);
		});
	};

	/*
		Sets all the stuff for the effects sliders
	*/
	var createControls = function(){
		$('#expo').slider({
			step:1,
			value:0,
			min:-100,
			max:100,
			slide: sliderHandler,
				change: function(event, ui){
					filterValues.exposure = ui.value;
					imageRender();
				}
		});

		$('#brightness').slider({
			step:1,
			value:0,
			min:-100,
			max:100,
			slide: sliderHandler,
				change: function(event, ui){
					filterValues.brightness = ui.value;
					imageRender();
				}
		});
		
		$('#contrast').slider({
			step:1,
			value:0,
			min:-100,
			max:100,
			slide: sliderHandler,
				change: function(event, ui){
					filterValues.contrast = ui.value;
					imageRender();
				}
		});
		
		$('#vibrance').slider({
			step:1,
			value:0,
			min:-100,
			max:100,
			slide: sliderHandler,
				change: function(event, ui){
					filterValues.vibrance = ui.value;
					imageRender();
				}
		});

		$('#saturation').slider({
			step:1,
			value:0,
			min:-100,
			max:100,
			slide: sliderHandler,
			change: function(event, ui){
				filterValues.saturation = ui.value;
				imageRender();
			}
		});
		
		$('#sharpen').slider({
			step:1,
			value:0,
			min:-100,
			max:100,
			slide: sliderHandler,
			change: function(event, ui){
				filterValues.sharpen = ui.value;
				imageRender();
			}
		});
		
		$('#controls .parameter').html('0');
	};
	
	/*
		Adds the handlers to the buttons
	*/
	var prepareButtons = function(){
		/* Buttons */
		$('#save').click(function(e){
			e.preventDefault();
			image.save();
		});
		$('#reset').click(function(e){
			e.preventDefault();
			editorModule.initElements();
		});	
	}

	/*
		Updates the histogram (used after applying each effect
	*/
	var updateHistogram = function(){
		var pixFin = document.getElementById('photo').getContext("2d").getImageData(0, 0, 469, 232).data;
		histogramModule.updateHist('rgb', 10, pixFin, true, 'discreet', 'flat');
	};
	
	/* 
		Public part of the module
	*/
	return{
		/*
			Some initializations
		*/
		init: function(pimageCanvas, ppathToImage){
			imageCanvas = pimageCanvas;
			pathToImage = ppathToImage;
		},
		
		/*
			Initializating controls, histogram, ...
		*/
		initElements: function(){
			var histCanvas = $('#hist-canvas')[0];
			histogramModule.init(histCanvas, histCanvas.width);

			image = Caman(pathToImage, imageCanvas, function () {
				this.render(updateHistogram);
			});
	
			createControls();
			prepareButtons();
		}		
	};
})();

editorModule.init('#photo','xago-beach1.JPG');
editorModule.initElements();
});