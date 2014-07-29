// ----------------------------------------------------------
// global variables 
// ----------------------------------------------------------

var fieldsCount = 8,
	numbers = new Array(),
	labels = new Array();

// ----------------------------------------------------------
// ----------------------------------------------------------

$(document).ready(function () {
	load();


});

function load() {
	if (typeof localStorage != 'undefined') {
		if (localStorage.getItem("bd.counter.numbers") === null) {
			initNumbers();
		} 
		else 
		{
			fieldsCount = JSON.parse(localStorage.getItem("bd.counter.fc"));
			numbers = JSON.parse(localStorage.getItem("bd.counter.numbers"));
			labels = JSON.parse(localStorage.getItem("bd.counter.labels"));
		}
	}
	else
		initNumbers();

	updateFields();
}

function save() {
	if (typeof localStorage != 'undefined') {
		localStorage.setItem("bd.counter.fc", JSON.stringify(fieldsCount));
		localStorage.setItem("bd.counter.numbers", JSON.stringify(numbers));
		localStorage.setItem("bd.counter.labels", JSON.stringify(labels));	
	}
}


function registerEvents() {
	$('button').off('click');
	// add new click handler
	$("button").click(onButtonClick);
}
function onButtonClick() {
//	var id = $(this).attr('id');
	var index = $(this).data('index'),
		fn = $(this).data('fn');
	if(fn == 'Add') {
		numbers[index]++;
	} else if(fn == 'Sub') {
		numbers[index]--;
	} else if(fn == 'Label') {
		newLabel = prompt("Name this counter");
		labels[index] = newLabel;
	} else if(fn == 'Reset') {
		if(confirm("This resets all counters!"))
			initNumbers();
	} else if(fn == 'NrCounter') {
		var input = parseInt(prompt("How many counters do you need? 1..32", fieldsCount));
		console.log("input = "+input);
		if(! isNaN(input)) {
			if(input >= 1 && input <= 32)
			{
				fieldsCount = input;
				if(input>numbers.length) {
					//Append new Elements
					for(var i=numbers.length; i<=input;i++) {
						numbers.push("0");
					}
				}
				if(input>labels.length) {
					//Append new Elements
					for(var i=labels.length; i<=input;i++) {
						labels.push("label");
					}
				}
			} else {
				alert("You have to enter a number between 1 and 32!");
			}
		}
		else {
			alert("You have to enter a valid number!");
		}
	} else if(fn == "Clear")
	{
		console.log("satorage cleared");
		localStorage.clear();
	}
	save();
	updateFields();
}

function initNumbers() {
	fieldsCount = 8;
	labels = new Array();
	numbers = new Array();
	for(var i=0; i<fieldsCount; i++) {
		numbers.push(0);
		labels.push('label');
	}
}

function updateFields() {
	var output = new Array();
	output.push("<div class='center'>");
	for(var i=0; i<fieldsCount; i++)
	{
		output.push("<div class='field'>");		
		output.push("<div class='lbl'>"+labels[i]+"</div>");
		output.push("<div class='nr'>"+numbers[i]+"</div>");
		output.push("<div class='btns'>"+getButtonsHTML(i)+"</div>");
		output.push("</div>");
	}
	output.push("</div'><div class='clearboth'></div>");
	// 

	document.getElementById("fields").innerHTML = output.join("");

	registerEvents();
}

function getButtonsHTML(index) {
	return getButtonHTML(index, "Add", "+")+
		getButtonHTML(index, "Sub", "-")+
		getButtonHTML(index, "Label", "set");
}

function getButtonHTML(index, fn, txt) {
	return "<button data-index='"+
		index+
		"' data-fn='"+
		fn+
		"'>"+
		txt+
		"</button> ";
}