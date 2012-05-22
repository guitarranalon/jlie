/*
The histogram code is based on this:
http://www.robodesign.ro/coding/svg-or-canvas/histogram.html
*/

var histogramModule = (function (){
	var runtime,
		histCanvas,
		histCtx,
		histType,
		accuracy,
		imgData,
		plotStyle,
		plotFill,
		plotColors,
		imgCanvas,
		imgCtx,
		gradients,
      	colors = {
      	  'red':   ['#000', '#f00'],
      	  'green': ['#000', '#0f0'],
      	  'blue':  ['#000', '#00f'],
      	  'hue':   [
      	    '#f00',   // 0, Red,       0°
      	    '#ff0',   // 1, Yellow,   60°
      	    '#0f0',   // 2, Green,   120°
      	    '#0ff',   // 3, Cyan,    180°
      	    '#00f',   // 4, Blue,    240°
      	    '#f0f',   // 5, Magenta, 300°
      	    '#f00'],  // 6, Red,     360°
      	  'val':     ['#000', '#fff'],
      	  'kelvin':  ['#fff', '#000'],
      	  'cyan':    ['#000', '#0ff'],
      	  'yellow':  ['#000', '#ff0'],
      	  'magenta': ['#000', '#f0f']
      	},
      	discreetWidth;

 var calcHist = function (type) {
    var chans = [[]],
        maxCount = 0, val, subtypes = [type];

    if (type === 'rgb') {
      chans = [[], [], []];
      subtypes = ['red', 'green', 'blue'];
    } else if (type === 'cmyk') {
      chans = [[], [], [], []];
      subtypes = ['cyan', 'magenta', 'yellow', 'kelvin'];
    }

    var step = accuracy;
    if (isNaN(step) || step < 1) {
      step = 1;
    } else if (step > 50) {
      step = 50;
    }
    accuracy = step;
    step *= 4;

    for (var i = 0, n = imgData.length; i < n; i+= step) {
      if (type === 'rgb' || type === 'red' || type === 'green' || type === 
          'blue') {
        val = [imgData[i], imgData[i+1], imgData[i+2]];

      } else if (type === 'cmyk' || type === 'cyan' || type === 'magenta' || 
          type === 'yellow' || type === 'kelvin') {
        val = rgb2cmyk(imgData[i], imgData[i+1], imgData[i+2]);

      } else if (type === 'hue' || type === 'sat' || type === 'val') {
        val = rgb2hsv(imgData[i], imgData[i+1], imgData[i+2]);
      }

      if (type === 'red' || type === 'hue' || type === 'cyan') {
        val = [val[0]];
      } else if (type === 'green' || type === 'sat' || type === 'magenta') {
        val = [val[1]];
      } else if (type === 'blue' || type === 'val' || type === 'yellow') {
        val = [val[2]];
      } else if (type === 'kelvin') {
        val = [val[3]];
      }

      for (var y = 0, m = val.length; y < m; y++) {
        if (val[y] in chans[y]) {
          chans[y][val[y]]++;
        } else {
          chans[y][val[y]] = 1;
        }
		
		/* modification: the extreme values are not relevant */
        if ((chans[y][val[y]] > maxCount)&&(val[y]!=0)&&(val[y]!=255)) {
          maxCount = chans[y][val[y]];
        }
      }
    }
	
    if (maxCount === 0) {
      return;
    }

    histCtx.clearRect(0, 0, histCanvas.width, histCanvas.height);

    if (plotFill && chans.length > 1) {
      histCtx.globalCompositeOperation = 'lighter';
    }

    for (var i = 0, n = chans.length; i < n; i++) {
      drawHist(subtypes[i], chans[i], maxCount);
    }

    if (plotFill && chans.length > 1) {
      histCtx.globalCompositeOperation = 'source-over';
    }
  };

	
  var drawHist = function (type, vals, maxCount) {
    var ctxStyle;

    if (plotFill || plotStyle === 'discreet') {
      ctxStyle = 'fillStyle';
      histCtx.strokeStyle = '#000';
    } else {
      ctxStyle = 'strokeStyle';
    }

    if (plotColors === 'flat') {
      if (type === 'hue') {
        histCtx[ctxStyle] = gradients.hue;
      } else if (type in colors && type !== 'val') {
        histCtx[ctxStyle] = colors[type][1];
      } else {
        histCtx[ctxStyle] = '#000';
      }

    } else if (plotColors === 'gradient') {
      if (type in gradients) {
        histCtx[ctxStyle] = gradients[type];
      } else {
        histCtx[ctxStyle] = '#000';
      }
    } else if (plotColors === 'none') {
      histCtx[ctxStyle] = '#000';
    }

    if (plotStyle === 'continuous') {
      histCtx.beginPath();
      histCtx.moveTo(0, histCanvas.height);
    }

    for (var x, y, i = 0; i <= 255; i++) {
      if (!(i in vals)) {
        continue;
      }

      y = Math.round((vals[i]/maxCount)*histCanvas.height);
      x = Math.round((i/255)*histCanvas.width);	  
	  
      if (plotStyle === 'continuous') {
        histCtx.lineTo(x, histCanvas.height - y);
      } else if (plotStyle === 'discreet') {
        if (plotFill) {
          histCtx.fillRect(x, histCanvas.height - y, discreetWidth, y);
        } else {
          histCtx.fillRect(x, histCanvas.height - y, discreetWidth, 2);
        }
      }
    }

    if (plotStyle === 'continuous') {
      histCtx.lineTo(x, histCanvas.height);
      if (plotFill) {
        histCtx.fill();
      }
      histCtx.stroke();
      histCtx.closePath();
	    }
	};	
	
	return {
		init: function(canvasHistogram, imgWidth){
			runtime = $('footer').get(0);
			histCanvas = canvasHistogram;
			histCtx = histCanvas.getContext("2d");
			
      		gradients = {
        		'red':     histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'green':   histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'blue':    histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'hue':     histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'val':     histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'cyan':    histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'magenta': histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'yellow':  histCtx.createLinearGradient(0, 0, imgWidth, 0),
        		'kelvin':  histCtx.createLinearGradient(0, 0, imgWidth, 0)
      		}	

			discreetWidth = Math.round(histCanvas.width / 255);	
		},
	
		updateHist: function (histogramType, accuracyP, imageData, fill, style, colors) {
			histType = histogramType;
			accuracy = accuracyP;
			imgData = imageData;
			plotFill = fill;
			plotStyle = style;
			plotColors = colors;

/*	   		var timeStart = (new Date()).getTime();
	   		runtime.innerHTML = 'Calculating histogram...';*/
	   		calcHist(histType);
/*	   		var timeEnd = (new Date()).getTime();
		   		runtime.innerHTML = 'Plot runtime: ' + (timeEnd - timeStart) + ' ms';*/
		}
	};
})();