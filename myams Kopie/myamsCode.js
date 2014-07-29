// ----------------------------------------------------------
// global variables 
// ----------------------------------------------------------

var stack = [];
var discardStack = [];

var date = new Date();

var keepCards = yamsInfo.keep;
var numberOfDrawnCards = yamsInfo.draw;

var exclusiveMode = true;
var cardBacksMode = false;
var gameStarted = false;

var exclusiveCard = 0;
var victoryPoints = 0;

var msg = "";
// ----------------------------------------------------------
// ----------------------------------------------------------

$(document).ready(function() {
	stack = welcomeStack;
	$("#nrDraw").val( yamsInfo.draw );
	$("#nrDiscard").val( yamsInfo.draw-yamsInfo.keep );

	document.getElementById("rules").innerHTML = yamsInfo.rules;
	updatePage();
});

function updateVIP() {
	document.getElementById("victoryPoints").innerHTML = victoryPoints;
}

function onButtonClick() {
	var id = $(this).attr('id');
	if(id == "buttonMenu") {
		$(".collapse").toggle();
		if($("#buttonMenu").html()=="show menu")
		{
			$("#buttonMenu").html("hide menu");
		} else {
			$("#buttonMenu").html("show menu");
		}
	} else if(id == "buttonStartGame") {
		gameStarted = ! gameStarted;

/*
		$('#buttonDraw').attr("disabled", gameStarted);
		$('#buttonAllCards').attr("disabled", gameStarted);
		$('#buttonUndoDiscard').attr("disabled", gameStarted);
		$('#buttonSettings').attr("disabled", gameStarted);		
		$('#buttonReset').attr("disabled", gameStarted);
*/
		if(gameStarted) {
			$('#buttonDraw').hide();
			$('#buttonAllCards').hide();
			$('#buttonUndoDiscard').hide();
			$('#buttonSettings').hide();
			$('#buttonReset').hide();
		} else {
			$('#buttonDraw').show();
			$('#buttonAllCards').show();
			$('#buttonUndoDiscard').show();
			$('#buttonSettings').show();
			$('#buttonReset').show();		
		}
		$("#buttonStartGame").html(gameStarted ? "end game" : "start game");
	} else if(id == "buttonSettings") {
		
		if($("#fsSettings").is(":visible")) {

			numberOfDrawnCards = parseInt($("#nrDraw").val());
			numberOfDrawnCards = between(numberOfDrawnCards, 1, yamsCardStack.length);
			keepCards = parseInt($("#nrDraw").val()) - parseInt($("#nrDiscard").val());
			keepCards = between(keepCards, 1, yamsCardStack.length);
			$("#fsSettings").hide();
		} else {
			$("#fsSettings").show();			
		}
	} else if (id == "buttonDraw") {
		if (confirm("This will redraw your YAMS card for a new mission.\nAre you sure?")) {
			exclusiveMode = true;
			drawAction();
			msg = "";
		}
	} else if (id == "buttonRules") {
		if ($('#rules').css('display') == 'block') {
			$('#rules').css('display', 'none');
		} else {
			$('#rules').css('display', 'block');
		}
	} else if (id == "buttonHelp") {
		if ($('#help').css('display') == 'block') {
			$('#help').css('display', 'none');
		} else {
			$('#help').css('display', 'block');
		}
	} else if (id == "buttonMenuOff") {
		if (confirm("This will remove the menu so you cant accidently hit buttons.\nThis can be undone by reloading the page only - you'll loose your drawn cards.\nAre you sure?")) $('#menu').css('display', 'none');
	} else if (id == "buttonAllCards") {
		if (confirm("This will replace the drawn cards with a complete stack.\nAre you sure?")) {
			exclusiveMode = true;
			stack = getStack();
			msg = "All cards drawn.";
		}
	} else if (id == "buttonAdd") {
		victoryPoints++;
		updateVIP();
	} else if (id == "buttonSub") {
		victoryPoints--;
		updateVIP();
	} else if (id == "buttonReset") {
		if(confirm("This will overwrite your current hand and settings, are you sure?")) {
			resetAllData();
		}
	} else if (id == "buttonUndoDiscard") {
		date = new Date();
		if(discardStack.length > 0)
		{
			stack.unshift( discardStack[0] );
			discardStack.shift()
		} 
	} else if (id == "buttonFlip") {
		cardBacksMode = ! cardBacksMode;
	} else if (id == "buttonMail") {
		if(confirm("I'll send a list of cards in your hand to your email program...")) {
			var _output = [];
			_output.push("At "+date.toLocaleString()+" you had these cards in your hand:\n\n");
			for(var i=0; i<stack.length;i++)
				_output.push("\t* "+stack[i].title+"\n");
			_output.push("\nThe counter was set to "+victoryPoints+".\n");
			sendMail("", "Your MobileYAMS cards", _output.join(""));
		}
	} else if(id == "discardButton") {
		var btnIndex = $(this).data('index');
		discardStack.unshift( stack[btnIndex] );
		stack.splice(btnIndex, 1);
	}
	updatePage();
}

function updatePage() {
	document.getElementById("cardList").innerHTML = "<h1>MobileYAMS based on " + yamsInfo.name + " " + yamsInfo.version + "</h1>" + 
	"<p class='smallLine'>You have "+stack.length+" cards and "+discardStack.length+" discarded. (draw "+numberOfDrawnCards+"/discard "+(numberOfDrawnCards-keepCards)+")</p>"+
	"<p class='timestamp'>these cards have been drawn at <em>" + date.toLocaleString() + "</em> "+msg+" "+
	(gameStarted ? " / Game has started." : "" +"</p>") + createHTMLCardList();

	if(discardStack.length>0 && ! gameStarted) { 
		$('#buttonUndoDiscard').attr("disabled", false);
  	}
	else {
		$('#buttonUndoDiscard').attr("disabled", true);
	}

	updateExclusiveCard();
	updateVIP();
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

function drawAction() {
	stack = drawFromStack(shuffleArray(getStack()), numberOfDrawnCards);
}

function getStack() {
	date = new Date();
	return yamsCardStack.slice(0);
}

function drawFromStack(_stack, number) {
	var drawnCards = [];
	for (var i = 0; i < number; i++)
	drawnCards.push(_stack.shift());
	return drawnCards;
}

function onHeaderClick() {
	exclusiveCard = $(this).data('index');
	exclusiveMode = !exclusiveMode;
	updateExclusiveCard();
	registerEvents();
}

function updateExclusiveCard() {
	document.getElementById("exclusiveCard").innerHTML = 
		"<h1>I have this objective:</h1>" + 
		"<p class='timestamp'>this card has been drawn at<br>" + 
		date.toLocaleString() + "</p>" + 
		createHTMLCard(stack[exclusiveCard], exclusiveCard, false);

	if (exclusiveMode) {
		$('#exclusiveCard').css('display', 'none');
		$('#cardList').css('display', 'block');
	} else {
		console.log("show exclusiveCard");
		$('#cardList').css('display', 'none');
		$('#exclusiveCard').css('display', 'block');
	}
}

function createHTMLCardList() {
	var output = [];
	for (var i = 0; i < stack.length; i++)
	if (stack.length > keepCards) output.push(createHTMLCard(stack[i], i, true));
	else output.push(createHTMLCard(stack[i], i, false));
	return output.join('');
}

function createHTMLCard(_card, index, showButton) {
	var output = [];	
	if(_card == undefined || ! cardBacksMode )
	{
		if ('icon' in _card) img = "<img src='" + _card.icon + "' class='icon'> ";
		else img = "";
		output.push("<div class='card'>");
		output.push("<div class='cardHeader' data-index='" + index + "' style='background-color:#" + _card.color + "'>" + img + _card.title + "</div>");
		if ('fluff' in _card && _card.fluff !== "") output.push("<div class='cardFluff'>" + _card.fluff + "</div>");
		if ('text' in _card && _card.text !== "") output.push("<div class='cardText'>" + _card.text + "</div>");
		if ('objective' in _card && _card.objective !== "") output.push("<div class='cardItem'><span class='bold'>Objective:</span> " + _card.objective + "</div>");
		if ('conditions' in _card && _card.conditions !== "") output.push("<div class='cardItem'><span class='bold'>Conditions:</span> " + _card.conditions + "</div>");
		if ('reveal' in _card && _card.reveal !== "") output.push("<div class='cardItem'><span class='bold'>Reveal:</span> " + _card.reveal + "</div>");
		if (showButton) output.push("<button id='discardButton' class='btn'  data-index='" + index + "' data-btn='discard'>discard</button>");
		output.push("</div>");
	} else {
				output.push("<div class='card'><div class='cardHeader' data-index='" + index + "'>mYams</div></div>");
	}
	return output.join('');
}

function resetAllData() 
{	
	alert("Okay, it doesnt work yet. Its just a preparation for the persistent-state-version of mYAMS. Sorry.");
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

function sendMail(address, subject, body) {
    var link = "mailto:" + address
             + "?subject=" + escape(subject)
             + "&body=" + escape(body)
    ;

    window.open(link, '_blank');
}


function between(x, min, max) {
	if(x < min) {
		return min;
	}
	else if(x > max) {
		return max;
	}
	else { 
		return x;
	}
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}