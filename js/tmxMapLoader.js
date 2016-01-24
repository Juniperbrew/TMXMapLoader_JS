function TMXMap(xmlDoc) {
	var map = xmlDoc.getElementsByTagName('map')[0];
	this.width = map.getAttribute('width');
	this.height = map.getAttribute('tileheight');
	this.tileWidth = map.getAttribute('tilewidth');
	this.tileHeight = map.getAttribute('tileheight');
	this.properties = {};
	this.tilesets = {};
	this.layers = {};
	this.objectgroups = {};

	var properties = map.getElementsByTagName('properties')[0];
	for(var i = 0; i < properties.children.length; i++){
		var property = properties.children[i];
		this.properties[property.getAttribute("name")] = property.getAttribute("value");
	}

}

function loadTMX(xmlDoc){

	var map = xmlDoc.getElementsByTagName('map')[0];
	console.log(map);
	parseMap(map);

	/*
	var oSerializer = new XMLSerializer();
	var sXML = oSerializer.serializeToString(xmlDoc);
	appendTextElement(sXML);
	*/
}

function parseMap(map){

	parseAttributes(map);
	appendBr();
	for(var i = 0; i < map.children.length; i++){
		var element = map.children[i];
		appendTextElement(element.tagName);
		switch(element.tagName){
			case "properties" : parseProperties(element); break;
			case "tileset" : parseTileset(element); break;
			case "layer" : parseLayer(element); break;
			case "objectgroup" : parseObjectgroup(element); break;
		}
		appendBr();
	}
}

function parseAttributes(element){
	for(var i = 0; i < element.attributes.length; i++){
		var attr = element.attributes.item(i);
		appendTextElement(attr.name +"="+attr.value);
	}
}

function parseProperties(properties){
	for(var i = 0; i < properties.children.length; i++){
		var property = properties.children[i];
		parseProperty(property);
	}
}

function parseTileset(tileset){
	for(var i = 0; i < tileset.children.length; i++){
		var element = tileset.children[i];
		switch(element.tagName){
			case "image" : parseImage(element); break;
			//case "tile" : parseTile(element); break;
		}
	}
}

function parseLayer(layer){
	var data = layer.firstElementChild;
	appendTextElement("encoding="+data.getAttribute("encoding"));
	appendTextElement("compression="+data.getAttribute("compression"));
	//console.log(data.childNodes[0].nodeValue);
	var dataString = data.childNodes[0].nodeValue;
	appendTextElement("EncodedData="+dataString);
	var decodedData = window.atob(dataString);
	appendTextElement("DecodedData="+decodedData);
	var uncompressedData = pako.deflate(decodedData);
	appendTextElement("UncompressedData="+uncompressedData);
}

function parseObjectgroup(objectgroup){
	for(var i = 0; i < objectgroup.children.length; i++){
		var object = objectgroup.children[i];
		parseAttributes(object);
		appendBr();
	}
}



function parseProperty(property){
	appendTextElement(property.getAttribute("name")+"="+property.getAttribute("value"));
}

function parseImage(image){
	parseAttributes(image);
}

function parseTile(tile){
	parseAttributes(tile);
	var properties = tile.firstElementChild;
	parseProperties(properties);
}