// ----------------------------------------------------------
// global variables 
// ----------------------------------------------------------


// ----------------------------------------------------------
function resetAllData() 
{	
	//alert("Okay, it doesnt work yet. Its just a preparation for the persistent-state-version of mYAMS. Sorry.");

	localStorage.setItem("myams.dataAvailable", true);
	localStorage.setObject("myams.discardStack", new Array());	
	localStorage.setObject("myams.stack", welcomeStack.slice(0));


	localStorage.setObject("myams.vp", 0);

	localStorage.setObject("myams.exclusive", true);
	localStorage.setObject("myams.cardback", false);
	localStorage.setObject("myams.gameStarted", false);

	localStorage.setObject("myams.drawCards", yamsInfo.draw);
	localStorage.setObject("myams.keepCards", yamsInfo.keep);

	localStorage.setObject("myams.msg", "");

	localStorage.setObject("myams.date", new Date());
}
// ----------------------------------------------------------

$(document).ready(function() {

	//resetAllData();
	if (localStorage.getItem("myams.dataAvailable") === null) {
		resetAllData();
	}

	toStack(welcomeStack);
	$("#nrDraw").val( localStorage.getObject("myams.drawCards") );
	$("#nrDiscard").val( localStorage.getObject("myams.drawCards")-localStorage.getObject("myams.keepCards") );

	document.getElementById("rules").innerHTML = yamsInfo.rules;
	updatePage();
});

function updateVIP() {
	document.getElementById("victoryPoints").innerHTML = localStorage.getObject("myams.vp");
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
		var _gs = ! localStorage.getObject("myams.gameStarted");
		localStorage.setObject("myams.gameStarted", _gs	);

		if(	_gs) {
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
		$("#buttonStartGame").html(	_gs ? "end game" : "start game");
	} else if(id == "buttonSettings") {
		
		if($("#fsSettings").is(":visible")) {
			var _dummy = parseInt($("#nrDraw").val());
			localStorage.setObject("myams.drawCards", between(_dummy, 1, yamsCardStack.length));

			_dummy = parseInt($("#nrDraw").val()) - parseInt($("#nrDiscard").val());
			localStorage.setObject("myams.keepCards", between(_dummy, 1, yamsCardStack.length));
			
			$("#fsSettings").hide();
		} else {
			$("#fsSettings").show();			
		}
	} else if (id == "buttonDraw") {
		if (confirm("This will redraw your YAMS card for a new mission.\nAre you sure?")) {
			localStorage.setObject("myams.exclusive", true);
			drawAction();
			localStorage.setObject("myams.msg", "");
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
			localStorage.setObject("myams.exclusive", true);
			getStack();
			localStorage.setObject("myams.msg", "All cards drawn.");
		}
	} else if (id == "buttonAdd") {
		localStorage.setObject("myams.vp", localStorage.getObject("myams.vp")+1);
		updateVIP();
	} else if (id == "buttonSub") {
		localStorage.setObject("myams.vp", localStorage.getObject("myams.vp")-1);
		updateVIP();
	} else if (id == "buttonReset") {
		if(confirm("This will overwrite your current hand and settings, are you sure?")) {
			resetAllData();
		}
	} else if (id == "buttonUndoDiscard") {
		localStorage.setObject("myams.date", new Date());

		var _dStack = fromDiscardStack();
		var _stack = fromStack();

		if(_dStack.length > 0)
		{
			//console.log(_dStack);
			_stack.unshift( _dStack[0] );
			_dStack.shift();
			
			toStack(_stack);
			toDiscardStack(_dStack);
		} 
	} else if (id == "buttonFlip") {
		localStorage.setObject("myams.cardback", ! localStorage.getObject("myams.cardback"));
	} else if (id == "buttonMail") {
		if(confirm("I'll send a list of cards in your hand to your email program...")) {
			var _output = [];
			_output.push("At "+getStoredDate()+" you had these cards in your hand:\n\n");
			var _stack = fromStack();
			for(var i=0; i<_stack.length;i++)
				_output.push("\t* "+_stack[i].title+"\n");
			_output.push("\nThe counter was set to "+localStorage.getObject("myams.vp")+".\n");
			sendMail("", "Your MobileYAMS cards", _output.join(""));
		}
	} else if(id == "discardButton") {
		localStorage.setObject("myams.date", new Date());

		var btnIndex = $(this).data('index');

		var _dStack = fromDiscardStack();
		var _stack = fromStack();

		_dStack.unshift( _stack[btnIndex]);
		toDiscardStack(_dStack);
		
		_stack.splice(btnIndex, 1);
		toStack(_stack);

		//console.log(localStorage.getObject("myams.discardStack"));

	}
	updatePage();
}

function updatePage() {
	document.getElementById("cardList").innerHTML = "<h1>MobileYAMS based on " + yamsInfo.name + " " + yamsInfo.version + "</h1>" + 
	"<p class='smallLine'>You have "+stackLen()+" cards and "+localStorage.getObject("myams.discardStack").length+" discarded. (draw "+localStorage.getObject("myams.drawCards")+"/discard "+(localStorage.getObject("myams.drawCards")-localStorage.getObject("myams.keepCards"))+")</p>"+
	"<p class='timestamp'>these cards have been drawn at <em>" + getStoredDate() + "</em> "+localStorage.getObject("myams.msg")+" "+
	(	localStorage.getObject("myams.gameStarted") ? " / Game has started." : "" +"</p>") + createHTMLCardList();

	if(localStorage.getObject("myams.discardStack").length>0 && ! localStorage.getObject("myams.gameStarted")) { 
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
	toStack(
		drawFromStack(
			shuffleArray(getStack(true)), 
			localStorage.getObject("myams.drawCards")
		)
	);
}

function getStack(shuffle) {
	localStorage.setObject("myams.date", new Date());
	var _stack = yamsCardStack.slice(0);
	if(shuffle)
		_stack = shuffleArray(_stack);
	toStack(_stack);	
	return _stack;
}

function drawFromStack(_stack, number) {
	var drawnCards = [];
	for (var i = 0; i < number; i++)
	drawnCards.push(_stack.shift());
	return drawnCards;
}

function onHeaderClick() {
	exclusiveCard = $(this).data('index');
	localStorage.setObject("myams.exclusive", ! localStorage.getObject("myams.exclusive", true)); 
	updateExclusiveCard();
	registerEvents();
}

function updateExclusiveCard() {
	var _stack = fromStack();
	document.getElementById("exclusiveCard").innerHTML = 
		"<h1>I have this objective:</h1>" + 
		"<p class='timestamp'>this card has been drawn at<br>" + 
		getStoredDate() + "</p>" + 
		createHTMLCard(_stack[exclusiveCard], exclusiveCard, false);

	if (localStorage.getObject("myams.exclusive")) {
		$('#exclusiveCard').css('display', 'none');
		$('#cardList').css('display', 'block');
	} else {
		$('#cardList').css('display', 'none');
		$('#exclusiveCard').css('display', 'block');
	}
}

function createHTMLCardList() {
	var output = [];
	var _stack = fromStack();
	for (var i = 0; i < _stack.length; i++)
	if (_stack.length > localStorage.getObject("myams.keepCards")) 
		output.push(createHTMLCard(_stack[i], i, true));
	else 
		output.push(createHTMLCard(_stack[i], i, false));
	return output.join('');
}

function createHTMLCard(_card, index, showButton) {

	if(_card === undefined)
		return "";

	var output = [];	
	if(! localStorage.getObject("myams.cardback"))
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

function fromDiscardStack() {
	return localStorage.getObject("myams.discardStack");
}

function toDiscardStack(value) {
	localStorage.setObject("myams.discardStack", value);
}

function fromStack() {
	//console.log(localStorage.getObject("myams.stack"));
	return localStorage.getObject("myams.stack");
}

function toStack(value) {
	localStorage.setObject("myams.stack", value);
}

function stackLen() {
	var _stack = fromStack();
	return _stack.length;
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

function getStoredDate() {
	if(localStorage.getObject("myams.date")===null)
		return "";
	else
		return new Date(localStorage.getObject("myams.date")).toLocaleString();
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}