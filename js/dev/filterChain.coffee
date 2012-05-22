#Kind of chain of responsibility, but this time, all of the members of the chain 
#can handle the request. 

#Top class of the hierarchy
class FilterProcessor
	constructor: (@successor) ->
	
	handleFilter: (image, filterValues) ->
		@successor.handleFilter(image, filterValues)	
		
#Implements the exposure processor, applying some effect if the value is not zero
class ExposureProcessor extends FilterProcessor
	handleFilter: (image, filterValues) ->
		#console.log(filterValues.exposure)	
		if(filterValues.exposure!=0)
			image.exposure(filterValues.exposure)
		if (@successor)
			@successor.handleFilter(image, filterValues)

#Implements the brightness processor, applying some effect if the value is not zero				
class BrightnessProcessor extends FilterProcessor
	handleFilter: (image, filterValues) -> 
		#console.log(filterValues.brightness)
		if(filterValues.brightness!=0)
			image.brightness(filterValues.brightness)
		if (@successor)
			@successor.handleFilter(image, filterValues)

#Implements the contrast processor, applying some effect if the value is not zero				
class ContrastProcessor extends FilterProcessor
	handleFilter: (image, filterValues) -> 
		#console.log(filterValues.contrast)
		if(filterValues.contrast!=0)
			image.contrast(filterValues.contrast)
		if (@successor)
			@successor.handleFilter(image, filterValues)

#Implements the vibrance processor, applying some effect if the value is not zero
class VibranceProcessor extends FilterProcessor
	handleFilter: (image, filterValues) ->
		#console.log(filterValues.vibrance)	
		if(filterValues.vibrance!=0)
			image.vibrance(filterValues.vibrance)
		if (@successor)
			@successor.handleFilter(image, filterValues)

#Implements the saturation processor, applying some effect if the value is not zero				
class SaturationProcessor extends FilterProcessor
	handleFilter: (image, filterValues) ->
		#console.log(filterValues.saturation)
		if(filterValues.saturation!=0)
			image.saturation(filterValues.saturation)
		if (@successor)
			@successor.handleFilter(image, filterValues)

#Implements the sharpen processor, applying some effect if the value is not zero				
class SharpenProcessor extends FilterProcessor
	handleFilter: (image, filterValues) -> 
		#console.log(filterValues.sharpen)
		if(filterValues.sharpen!=0)
			image.sharpen(filterValues.sharpen)
		if (@successor)
			@successor.handleFilter(image, filterValues)

#Now, time to prepare the chain				
sharpen = new SharpenProcessor (null)
saturation = new SaturationProcessor (sharpen)
vibrance = new VibranceProcessor (saturation)
contrast = new ContrastProcessor(vibrance)
brightness = new BrightnessProcessor(contrast)
exposure = new ExposureProcessor(brightness)

#This is not strictly necesary (you can use exposure.handleFilter), but quite useful to
#make the code more easy to read and maintain
filterChain = new FilterProcessor(exposure)