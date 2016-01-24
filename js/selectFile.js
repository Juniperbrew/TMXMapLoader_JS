function handleFileSelect(target) {
	/*var element = document.createElement("div");
	var node = document.createTextNode("handleFileSelect() called from "+ target)
	element.appendChild(node);
	document.body.insertBefore(element, target.nextSibling);*/
    var fileList = target.files;
    var f = fileList[0];
    var reader = new FileReader();

    reader.onload = function(e) {
    	var text = reader.result;
    	var parser, xmlDoc;
    	parser = new DOMParser();
    	xmlDoc = parser.parseFromString(text,"text/xml");
    	var map = new TMXMap(xmlDoc);
		console.log(map);
		//loadTMX(xmlDoc)
    }

    reader.readAsText(f);
}