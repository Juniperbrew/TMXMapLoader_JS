function appendTextElement(text) {
	var element = document.createElement("div");
	var node = document.createTextNode(text)
	element.appendChild(node);
    document.body.appendChild(element);
}

function appendMonospaceTextElement(text) {
	var element = document.createElement("div");
	element.style.fontFamily = "Lucida Console";
	element.style.whiteSpace = "nowrap";
	var node = document.createTextNode(text)
	element.appendChild(node);
    document.body.appendChild(element);
}

function appendBr() {
    var element = document.createElement("br");
    document.body.appendChild(element);
}