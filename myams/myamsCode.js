var stack = new Array();
var date;
var keepCards = yamsInfo.keep;
var numberOfDrawnCards = yamsInfo.draw;
var exclusiveMode = true;
var exclusiveCard = 0;

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
	stack = drawFromStack(shuffleArray(getStack()), numberOfDrawnCards);
}

function updatePage() {
	document.getElementById("cardList").innerHTML = 
		"<h1>MobileYams based on "+yamsInfo.name+" "+yamsInfo.version+"</h1>"+
		"<p class='timestamp'>these cards have been drawn at<br>"+date.toLocaleString()+"</p>"+
		createHTMLCardList();
	updateExclusiveCard();
	registerEvents();
}

function registerEvents() {
	// remove old click handler
	$('button').off('click');
	$('.cardHeader').off('click');
	// add new click handler
	$("button").click(onButtonClick);
	$(".cardHeader").click(onHeaderClick);
}

function onButtonClick() {
	var id = $(this).attr('id');
//	console.log("pressed button = "+id);
	if(id == "buttonDraw") {
		if(confirm("This will redraw your YAMS card for a new mission.\nAre you sure?"))
			exclusiveMode = true;
			drawAction();
	} else if(id == "buttonRules") {
		// toggle visibility of rules div
		if ($('#rules').css('display')=='block'){
			$('#rules').css('display', 'none');
		} else {
			$('#rules').css('display', 'block');
        }
	} else if(id == "buttonHelp") {
		// toggle visibility of rules div
		if ($('#help').css('display')=='block'){
			$('#help').css('display', 'none');
		} else {
			$('#help').css('display', 'block');
        }
	} else	if(id == "buttonMenuOff") {
		if(confirm("This will remove the menu so you cant accidently hit buttons.\nThis can be undone by reloading the page only - you'll loose your drawn cards.\nAre you sure?"))
			$('#menu').css('display', 'none');
	} else if(id == "buttonAllCards") {
		if(confirm("This will replace the drawn cards with a complete stack.\nAre you sure?"))
			exclusiveMode = true;
			stack = getStack();
	} else {
		// discard button
		stack.splice(parseInt(id.substring(13)), 1);
	}
	updatePage();
}

function onHeaderClick() {
	exclusiveCard = $(this).data('index');
	exclusiveMode = ! exclusiveMode;	    
	updateExclusiveCard();
	registerEvents();        
}



function updateExclusiveCard() {
	document.getElementById("exclusiveCard").innerHTML = 
	"<h1>I have this objective:</h1>"+
		"<p class='timestamp'>this card has been drawn at<br>"+date.toLocaleString()+"</p>"+
		createHTMLCard(stack[exclusiveCard], exclusiveCard, false);	

	if (exclusiveMode){
		console.log("show cardList");
		$('#exclusiveCard').css('display', 'none');
		$('#cardList').css('display', 'block');
	} else {
		console.log("show exclusiveCard");
		$('#cardList').css('display', 'none');
		$('#exclusiveCard').css('display', 'block');
    }	
}

function createHTMLCardList() {
	var output = new Array();
	for(var i=0; i<stack.length; i++)
		if(stack.length>keepCards)
			output.push(createHTMLCard(stack[i], i, true));
		else
			output.push(createHTMLCard(stack[i], i, false));
	return output.join('');
}

function createHTMLCard(_card, index, showButton) {
	var output = new Array();
	if('icon' in _card)
		img = "<img src='"+_card.icon+"' class='icon'> ";
	else
		img = "";
	output.push("<div class='card'>");
	output.push("<div class='cardHeader' data-index='"+index+"' style='background-color:#"+_card.color+"'>"+img+_card.title+"</div>");
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