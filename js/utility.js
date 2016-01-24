function appendTextElement(text) {
	var element = document.createElement("div");
	var node = document.createTextNode(text)
	element.appendChild(node);
    document.body.appendChild(element);
}

function appendBr() {
    var element = document.createElement("br");
    document.body.appendChild(element);
}