function TMXMap(xmlDoc) {
	var map = xmlDoc.getElementsByTagName('map')[0];
	this.width = map.getAttribute('width');
	this.height = map.getAttribute('height');
	this.tileWidth = map.getAttribute('tilewidth');
	this.tileHeight = map.getAttribute('tileheight');

	this.properties = {};
	var propertiesElement = map.getElementsByTagName('properties')[0];
	for(var i = 0; i < propertiesElement.children.length; i++){
		var property = propertiesElement.children[i];
		this.properties[property.getAttribute("name")] = property.getAttribute("value");
	}

	this.tilesets = [];
	var tilesetElements = map.getElementsByTagName('tileset');
	var tilesetImagesNeeded = new Set();
	for(var i = 0; i < tilesetElements.length; i++){
		this.tilesets[i] = new TileSet(tilesetElements[i]);
		tilesetImagesNeeded.add(this.tilesets[i].source);
	}
	var imagesNeededElement = document.createElement("div");
	var node = document.createTextNode("Following images are needed:");
	imagesNeededElement.appendChild(node);
	tilesetImagesNeeded.forEach(function(value1, value2, set){
		var divElement = document.createElement("div");
		divElement.id = value1;
		var node = document.createTextNode(value1);
		divElement.appendChild(node);
		imagesNeededElement.appendChild(divElement);
	});
	document.body.appendChild(imagesNeededElement);

	var inputDivElement = document.createElement("div");
	var inputElement = document.createElement("input");
	inputElement.setAttribute("type","file");
	inputElement.setAttribute("id","imageInput");
	inputElement.multiple = true;
	inputElement.onchange=function(){
		for (var i = 0; i < this.files.length; i++) {
			var fileName = this.files[i].name;
			if(tilesetImagesNeeded.has(fileName)){
				tilesetImagesNeeded.delete(fileName);
				var element = document.getElementById(fileName);
				element.parentNode.removeChild(element);
				var file = this.files[i];
				//LOAD IMAGE
				loadImage(file, function (img) {
					img.style.margin = "10px";
						document.body.appendChild(img);
					});
			}
		};
		this.files = [];
		console.log(tilesetImagesNeeded);
		if(tilesetImagesNeeded.size == 0){
			imagesNeededElement.parentNode.removeChild(imagesNeededElement);
		}
	};
	inputDivElement.appendChild(inputElement);
	document.body.appendChild(inputDivElement);

	var layerElement = map.getElementsByTagName('layer')[0];
	this.layer = getLayerData(layerElement);


	this.objectgroups = {};

	//printLayerData(this.layer, this.width, this.height);
}

function TileSet(tilesetElement){
	this.firstGid = tilesetElement.getAttribute("firstgid");
	this.name = tilesetElement.getAttribute("name");
	this.tileWidth = tilesetElement.getAttribute("tilewidth");
	this.tileHeight = tilesetElement.getAttribute("tileheight");

	var imageElement = tilesetElement.getElementsByTagName("image")[0];
	this.source = imageElement.getAttribute("source");
	this.width = imageElement.getAttribute("width");
	this.height = imageElement.getAttribute("height");

	this.tiles = [];
	var tileElements = tilesetElement.getElementsByTagName("tile");
	for (var i = 0; i < tileElements.length; i++) {
		this.tiles[i] = new Tile(tileElements[i]);
	};
}

function Tile(tileElement){
	var properties = {};
	var propertiesElements = tileElement.getElementsByTagName("properties")[0].children;
	for (var i = 0; i < propertiesElements.length; i++) {
		var propertyElement = propertiesElements[i];
		properties[propertyElement.getAttribute("name")] = propertyElement.getAttribute("value");
	};
}


function printLayerData(tileArray, width, height){
	for(var y = 0; y < height; y++){
		var line = "";
		for(var x = 0; x < width; x++){
			var tile = tileArray[y*width+x];
			var paddedTile = ("....." + tile).slice(-3);
			line += paddedTile + "|";
		}
		appendMonospaceTextElement(line);
	}
	appendBr();
}

function getLayerData(layer){
	//Decode base64 and uncompress zlib
	var data = layer.firstElementChild;
	var dataString = data.childNodes[0].nodeValue;
	var decodedData = window.atob(dataString);
	var uncompressedDataUint8 = pako.inflate(decodedData);
	var uint32array = new Uint32Array(uncompressedDataUint8.buffer);
	return uint32array;
}