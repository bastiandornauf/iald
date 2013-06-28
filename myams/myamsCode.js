var stack = new Array();
var date;

$(document).ready(function () {
	stack = getStack();
	document.getElementById("rules").innerHTML = yamsInfo.rules;
	updatePage();
});

function getStack() {
	date = new Date();	
	//clone copy
	return yamsCardStack.slice(0);
}

function drawFromStack(_stack, number) {
	var drawnCards = new Array();
	for(var i=0; i<number; i++)
		drawnCards.push(_stack.shift());
	return drawnCards;
}

function drawAction() {
	stack = drawFromStack(shuffleArray(getStack()), 4);
}

function updatePage() {
	document.getElementById("cardList").innerHTML = 
		"<h1>MobileYams based on "+yamsInfo.name+" "+yamsInfo.version+"</h1>"+
		"<p class='timestamp'>these cards have been drawn at<br>"+date.toLocaleString()+"</p>"+
		createHTMLCardList();
	registerEvents();
}

function registerEvents() {
	// remove old click handler
	$('button').off('click');
	// add new click handler
	$("button").click(onButtonClick);
}

function onButtonClick() {
	var id = $(this).attr('id');
//	console.log("pressed button = "+id);
	if(id == "buttonDraw") {
		drawAction();
	} else if(id == "buttonRules") {
		// toggle visibility of rules div
		if ($('#rules').css('display')=='block'){
			$('#rules').css('display', 'none');
		} else {
			$('#rules').css('display', 'block');
        }
	} else	if(id == "buttonMenuOff") {
		$('#menu').css('display', 'none');
	} else if(id == "buttonAllCards") {
		stack = getStack();
	} else {
		// discard button
		stack.splice(parseInt(id.substring(13)), 1);
	}
	updatePage();
}

function createHTMLCardList() {
	var output = new Array();
	for(var i=0; i<stack.length; i++)
		if(stack.length>2)
			output.push(createHTMLCard(stack[i], i));
		else
			output.push(createHTMLCard(stack[i]));
	return output.join('');
}

function createHTMLCard(_card, index) {
	if(typeof index != "undefined") {
		showButton = true;
	}
	else
		showButton = false;
	var output = new Array();
	output.push("<div class='card'>");
	output.push("<div class='cardHeader' style='background-color:#"+_card.color+"'>"+_card.title+"</div>");
	if('fluff' in _card)
		output.push("<div class='cardFluff'>"+_card.fluff+"</div>");
	output.push("<div class='cardItem'><span class='bold'>Objective:</span> "+_card.objective+"</div>");
	output.push("<div class='cardItem'><span class='bold'>Conditions:</span> "+_card.conditions+"</div>");
	output.push("<div class='cardItem'><span class='bold'>Reveal:</span> "+_card.reveal+"</div>");
	if(showButton)
		output.push("<button id='discardButton"+index+"'  class='btn'>discard</button>");
	output.push("</div>");

	return output.join('');
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}