// randomArmylistGenerator
var MAXLOOPS = 100, log = [], armylist = [], remotesAllowed = false, allowedPts = 0, allowedSWC = 0, totalAVA = {}, ava = {}, servantsAllowed = false, hasJumperInList = false, isSectorial = false, 
knownFactions = ["aleph", "ariadna", "combined army", "haqqislam", "nomads", "panoceania", "tohaa", "yu jing"], 
knownSectorials=["jsa", "maf", "sef", "bakunin", "qk", "hassassin"];

window.onload = onLoad();

function onLoad() {
	popDropDown();
	run(false);
}

function onButton() {
	run(true);
}

function run(useFields) {
	document.getElementById("json").innerHTML = generate(useFields)+"<hr><h2>Log</h2>"+log.join(" ");
}

function dump() {
	var names = [];
	army = document.getElementById("dropdown").value;
	
	if(knownFactions.contains(army)) {
		armyUnits = units.filter(function(obj) {
	    	return (obj.army.toLowerCase() === army.toLowerCase());
		});
		for(i=0; i<armyUnits.length;i++)
			names.push(armyUnits[i].spec);
	}
	else if(knownSectorials.contains(army)){
		names = sectorials[army].split(",");
	}

	document.getElementById("json").innerHTML = "<h2>unit dump</h2><pre>"+names.join(",")+"</pre>";
}

function dump2() {
	var names = [];
	army = document.getElementById("dropdown").value;
	
	if(knownFactions.contains(army)) {
		armyUnits = units.filter(function(obj) {
	    	return (obj.army.toLowerCase() === army.toLowerCase());
		});
		for(i=0; i<armyUnits.length;i++)
			names.push(armyUnits[i].spec);
	}
	else if(knownSectorials.contains(army)){
		names = sectorials[army].split(",");
	}

	document.getElementById("json").innerHTML = "<h2>unit dump</h2><pre>"+names.join(",<br>")+"</pre>";
}

function dump3() {
	var names = [];
	army = document.getElementById("dropdown").value;
	
	if(knownFactions.contains(army)) {
		armyUnits = units.filter(function(obj) {
	    	return (obj.army.toLowerCase() === army.toLowerCase());
		});
		for(i=0; i<armyUnits.length;i++)
			names.push("<tr><td>"+armyUnits[i].spec+"</td><td>"+armyUnits[i].isc+"</td><td>"+armyUnits[i].ava +"</td></tr>");
	}
	else if(knownSectorials.contains(army)){
		var list = sectorials[army].split(",");		for(i=0; i<list.length;i++){
			var _units = $.grep(units, function(e){ return e.spec === list[i].trim(); })
	    	for(j=0; j<_units.length; j++) {
		    	//console.log(JSON.stringify(_units[j]));
	    		names.push(  "<tr><td>"+_units[j].spec+"</td><td>"+_units[j].isc+"</td><td>"+_units[j].ava+"</td></tr>");
	    	}
		}
	}

	document.getElementById("json").innerHTML = "<h2>spec - isc</h2>format: spec - isc<br>units with same isc share AVA<pre><table><tr><th>SPEC</th><th>ISC</th><th>AVA</th></tr>"+names.join(" ")+"</table></pre>";
}

function dump4() {
	var _ava = {};
	army = document.getElementById("dropdown").value;
	
	if(knownFactions.contains(army)) {
		armyUnits = units.filter(function(obj) {
	    	return (obj.army.toLowerCase() === army.toLowerCase());
		});
		for(i=0; i<armyUnits.length;i++)
			_ava[armyUnits[i].isc] = armyUnits[i].ava;

	document.getElementById("json").innerHTML = "<h2>isc : ava</h2><pre>"+JSON.stringify(_ava, null, '\t')+"</pre>";

	}
	else
		document.getElementById("json").innerHTML = "<h2>isc : ava</h2><pre>"+JSON.stringify(sectorialAVA[army], null, '\t')+"</pre>";

	}

// ==================== THE GENERATOR ====================

function generate(useFields) {
	if(useFields === undefined)
		useFields = false;

	log = [];
	armyUnits = [];
	armylist = [];
	remotesAllowed = false;
	allowedPts = 0;
	allowedSWC = 0;
	ava = {};
	totalAVA = {};
	servantsAllowed = false;
	hasJumperInList = false;

	knownFactions = 
		["aleph", "ariadna", "combined army", "haqqislam", "nomads", "panoceania", "tohaa", "yu jing"];

	// get parameters, army, point limit, calc swc limit
	if(useFields) {
		army = document.getElementById("dropdown").value;
		pointLimit = document.getElementById("nr").value;
	} else {
    	army = getUrlValue("army");
    	pointLimit = getUrlValue("pts");
	}
	if(army !== undefined) {
		army = army.toLowerCase();
	} else {
		army = "tohaa";	//default
	}
	if(! (knownFactions.contains(army)  || knownSectorials.contains(army))) {
		army = "tohaa";//default
	}

	if(pointLimit !== undefined) {
	} else {
		pointLimit = 200;//default
	}
	if(!useFields) {
    	document.getElementById("dropdown").value = army;
    	document.getElementById("nr").value = pointLimit;
	}
    allowedPts = pointLimit;
    swcLimit = Math.ceil(pointLimit/50)*1;
    allowedSWC = swcLimit;
    log.push("<p>generate list for "+army+" "+uFmt(pointLimit, "pts")+"/"+uFmt(swcLimit, "swc"));

	// filter for army
    if(knownSectorials.contains(army)) {
    	isSectorial = true;
	    log.push("<p>loading sectorial list");
	    sectorialUnitNames = sectorials[army].split(",");
	    armyUnits = [];
	    for(i=0;i<sectorialUnitNames.length;i++) {
	    	// find units with spec
			var _units = $.grep(units, function(e){ return e.spec === sectorialUnitNames[i].trim(); })
	    	for(j=0; j<_units.length; j++) {
		    	//console.log(JSON.stringify(_units[j]));
	    		armyUnits.push( _units[j] );
	    	}
	    } 
    } else {
    	isSectorial = false;
	    log.push("<p>loading vanilla list");
	    armyUnits = [];
		armyUnits = units.filter(function(obj) {
	    	return (obj.army.toLowerCase() === army.toLowerCase());
		});
	}
	// and drop cost 0 units
	armyUnits = armyUnits.filter(function(obj) {
    	return (obj.pts >0);
	});	

	//console.log(JSON.stringify(armyUnits));
	ava = {};
// generate ava object
	if(isSectorial) {
		ava = owl.deepCopy(sectorialAVA[army]);
	} else {
		
		for(x=0; x<armyUnits.length; x++) {
			node = armyUnits[x];
			ava[node.isc] = node.ava;
		}
	}
	totalAVA = owl.deepCopy(ava);
	for(o in ava) {
		ava[o] = ava[o] === "T" ? 1000 : ava[o];
	}

	// console.log(JSON.stringify(totalAVA));

	// drop units with ava 0 from pool
   	armyUnits = armyUnits.filter(function(obj) {
		return (totalAVA.hasOwnProperty(obj.isc) && (totalAVA[obj.isc]==="T" || totalAVA[obj.isc] > 0));
	});
    log.push(
    	"<br>&bull;  army has "+
    	tooltip(armyUnits.length+" units", listOfPool(armyUnits))
    );

	//console.log("AVA ---> "+JSON.stringify(ava, null, '\t'));

	// ensure only unique units
	armyUnits = $.unique(armyUnits);		

	// generate lt list, normal list, n+rem list
	ltOptions = armyUnits.filter(function(obj) {
    	return isLt(obj);
	});
	// console.log(JSON.stringify(ltOptions,null, '\t'));


	// draw a lt
    log.push("<p>"+tooltip("found "+ltOptions.length+" lieutenant options", listOfPool(ltOptions)));

    unit = randomFrom(ltOptions);
    //console.log(JSON.stringify(unit));
    allowedPts -= parseInt(unit.pts);
    allowedSWC -= parseInt(unit.swc);
	ava[unit.isc] -= 1;	    

    log.push("<br> &bull; added "+unitFmt(unit));
    armylist.push(unit);

    // check for servants
    if(! servantsAllowed && (unit.props.indexOf('Doctor')!==-1 || unit.props.indexOf('Engineer')!==-1)) {
    	servantsAllowed = true;
    	log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  allows servants</span>");
    }

    //check if lt already allows remotes
    if(allowsREM(unit)) {
    	log.push("<br><span style='font-size:12pt;'>  &nbsp;&nbsp; &rarr;  allows remotes.</span>");
    	remotesAllowed = true;
    }

    // remove lt options from list
    armyUnits = armyUnits.filter(function(obj) {
    	return (! isLt(obj));
	});

    // irregular? remove regulars
    if(! unit.regular)
	{
	    armyUnits = armyUnits.filter(function(obj) {
    		return (obj.regular === false);
		});
		log.push("<br><span style='font-size:12pt;'>  &nbsp;&nbsp; &rarr;  irregular lt cannot lead regular units > remove regular units</span>");
	}
    // generate servants-list
    onlyServants = armyUnits.filter(function(obj) {
    	return (obj.props.indexOf("G: Servant")!==-1);
	});

    // generate remote list
    onlyREM = armyUnits.filter(function(obj) {
    	return (obj.type.toLowerCase() === "rem" && obj.props.indexOf('G: Servant')===-1);
	});

    // generate remote-free list
    pool = armyUnits.filter(function(obj) {
    	return (obj.type.toLowerCase() !== "rem" && obj.props.indexOf('G: Servant')===-1);
	});
   	log.push("<br><span style='font-size:12pt;'>  &nbsp;&nbsp; &rarr;  Army has "+
   		tooltip(pool.length+" non remote units", listOfPool(pool))+
   		", "+
   		tooltip(onlyREM.length+" remote units", listOfPool(onlyREM))+
   		" and "+
   		tooltip(onlyServants.length+" servant units", listOfPool(onlyServants))+
   		"</span>");    	

   if(remotesAllowed)
    	pool = pool.concat(onlyREM);

   if(servantsAllowed)
    	pool = pool.concat(onlyServants);

	// draw random unit until pt limits reached, repeat until last x draws didnt fit

	pool = pool.filter(function(obj) {
    	return (obj.pts <= allowedPts && obj.swc <= allowedSWC);
	});

		log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  left "+uFmt(allowedPts,"pts")+"/"+uFmt(allowedSWC, "swc")+" &Rarr; "+tooltip("allowed units to choose from: "+pool.length, listOfPool(pool))+"</span>");

	var loopCounter = MAXLOOPS;
	while(pool.length > 0 && loopCounter > 0 ) {

		// get a unit
		unit = randomFrom(pool);

	    // check for servant
	    if(! servantsAllowed && unit.props.indexOf('G: Servant')!==-1) {
	    	log.push("<p>I chose a servant unit, but I have no doctor/engineer.");    	
	    } else {
	    	unitTaken = true;

			allowedPts -= unit.pts;
			allowedSWC -= unit.swc;
			ava[unit.isc] -= 1;	  

	    	// check for special rules
	    	if(! hasJumperInList && unit.props.indexOf("G: Jumper") !== -1) {
	    		console.log("handle proxy special rule");
	    		unitTaken = handleGhostJumper(unit);
	    	}


		    // mod allowances
			if(unitTaken) {
 				log.push("<p> &bull;  added "+unitFmt(unit));
			    armylist.push(unit);
			    // check Doctor/Engineer
			    if(! servantsAllowed && (unit.props.indexOf('Doctor')!==-1 || unit.props.indexOf('Engineer')!==-1)) {
			    	servantsAllowed = true;
			    	log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  allows servants</span>")
			    
			    	pool = pool.concat(onlyServants);
					// ensure only unique units
					pool = $.unique(pool);
			    }
			
			    // check if special models appear
			    if('addToList' in unit) {
			    	bonusUnits = unit.addToList;
			    	for(j=0; j<bonusUnits.length; j++) {
			    		bonusUnit = bonusUnits[j];
				    	armylist.push(bonusUnit);
				    	log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  adds '"+bonusUnit.spec+"' to army list</span>");
			    	}
			    }
			    if('addToPool' in unit) {
			    	bonusUnits = unit.addToPool;
			    	for(j=0; j<bonusUnits.length; j++) {
			    		bonusUnit = bonusUnits[j];
			    		if(!(bonusUnit.isc in ava)) {
			    			ava[bonusUnit.isc] = bonusUnit.ava;
				    		console.log("AVA set to"+bonusUnit.ava);
			    		}
				    	log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  adds '"+bonusUnit.spec+"' to pool</span>");
					}

					// add units to pool & ensure only unique units
					pool = pool.concat(unit.addToPool);
					pool = $.unique(pool);
				}
		    } else {
		    	// console.log("NO PROXY TO ADD ===> "+JSON.stringify(unit));
		    	// console.log("BEFORE "+allowedPts);
				allowedPts = parseInt(allowedPts) + parseInt(unit.pts);
				allowedSWC = parseInt(allowedSWC) + parseInt(unit.swc);
				ava[unit.isc] += 1;	  
				// console.log("AFTER  "+allowedPts);
		    }

		    // mod allowances
			if(ava[unit.isc] <= 0)
		    	log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  AVA reached > removed from pool</span>")


			// check if remotes allowed
		    if(! remotesAllowed && allowsREM(unit)) {
		    	log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  allows remotes > add remotes to pool</span>")
		    	remotesAllowed = true;
		    	pool = pool.concat(onlyREM);
				// ensure only unique units
				pool = $.unique(pool);
		    }

		    // drop expensive units/ava 0 from pool
		   	pool = pool.filter(function(obj) {
	    		return (obj.pts <= allowedPts && obj.swc <= allowedSWC && ava[obj.isc] > 0);
			});
	    }
		loopCounter -= 1;

		log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  left "+uFmt(allowedPts,"pts")+"/"+uFmt(allowedSWC, "swc")+" &Rarr; "+tooltip("allowed units to choose from: "+pool.length, listOfPool(pool))+"</span>");

		//log.push("<br><span style='font-size:12pt;'> &nbsp;&nbsp; &rarr;  left "+uFmt(allowedPts,"pts")+"/"+uFmt(allowedSWC, "swc")+" &Rarr; allowed units to choose from: "+pool.length+"</span>");
	}

		if(loopCounter < 1 )
			log.push("<p>Aborted list generation due to loop limit.");
	// print out list
    return "<hr><h2>Generated list</h2><p>"+printArmy(armylist)+"</p>";
}

function listOf(array, key) {
	_result = "";
	for(i=0; i<array.length; i++) {
		if(_result != "")
			_result += ", ";
		node = array[i];
		_result += node[key];
	}
	return _result;
}


function handleGhostJumper(_unit) {
	otherUnits = pool.filter(function(obj) {
	    		return (obj.props.indexOf("G: Jumper") !== -1 && 
	    				obj.pts <= allowedPts && obj.swc <= allowedSWC && 
	    				ava[obj.isc] > 0
	    		);
			});
	if(otherUnits.length > 0) {
		hasJumperInList = true;
		jumperUnit = owl.deepCopy(_unit);

		while(jumperUnit.isc === _unit.isc)
			jumperUnit = randomFrom(otherUnits);
		
		allowedPts -= jumperUnit.pts;	
		allowedSWC -= jumperUnit.swc;
		ava[jumperUnit.isc] -= 1;
		armylist.push(jumperUnit);	

		log.push("<p> &bull;  added "+unitFmt(jumperUnit)+" (to ensure 2+ Ghost: Jumper)");
		return true;
	} else {
		log.push("<p> &bull;  couldn't add "+_unit.spec+" since no other Ghost: Jumper");
		return false;
	}
}
// ============================================================

function printArmy(l, ptsLine) {
	if(ptsLine === undefined)
		ptsLine = true;

	var output = [];
	var SORTCHARS =6;

	output.push("<div class='box'>")
	if(ptsLine)
		output.push("<p><b>"+uFmt(l.length, "models")+" / "+uFmt(pointLimit-allowedPts, "pts")+" / "+uFmt(swcLimit-allowedSWC, "swc")+"</b></p><p><ul>")
	l.sort(function(a,b){
	    if (a.spec.substr(0,SORTCHARS) > b.spec.substr(0,SORTCHARS))
	      return 1;
	    if (a.spec.substr(0,SORTCHARS) < b.spec.substr(0,SORTCHARS))
	      return -1;
	    return b.pts - a.pts;
	});
	for(var i=0; i<l.length;i++) {
		if(! isLt(l[i]))
			output.push("<li>"+unitFmt(l[i], false)+"</li>");
		else
			output.push("<li class='lt'>"+unitFmt(l[i], false)+"</li>");
	}
	output.push("</ul></div>")
	return output.join("");
}

function isLt(unit) {
	return (unit.props.indexOf("Lieutenant") !== -1);
}

function randomFrom(array) {
   return array[Math.floor(Math.random() * array.length)];
}	

function allowsREM(unit) {
	return (unit.type.toLowerCase() === "tag" || unit.props.toLowerCase().indexOf('hacker') !== -1);
}
function unitDetails(_unit) {
	return String.format("{0} {1}<table><tr><th>mov</th><th>cc</th><th>bs</th><th>ph</th><th>wip</th><th>arm</th><th>bts</th><th>w</tr>"+
		"<tr><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td>{7}</td><td>{8}</td><td>{9}</td><tr></table>", 
		_unit.spec,
		_unit.regular?"Regular":"Irregular" +
			_unit.impetuous?" Impetuous": " ",
		_unit.mov, _unit.cc, _unit.bs, _unit.ph, _unit.wip, _unit.arm, _unit.bts, _unit.w
		) 
	{}
}
function unitFmt(u, showAva) {
	if(showAva === undefined)
		showAva = true;

	if(u !== undefined)
		if(showAva)
			return String.format("<html><b>{0}</b> ({1}/{2}<span style='font-size:12pt;'>/AVA {3} of {4}</span>)", 
				(isLt(u)?"&#10029;":"")+u.spec, 
				uFmt(u.pts, "pts"), 
				uFmt(u.swc, "swc"), 
				((totalAVA[u.isc]==="T"?1000:totalAVA[u.isc])-ava[u.isc]),
				totalAVA[u.isc]
			);
		else
			return String.format("<b>{0}</b> ({1}/{2}) {3}",
				u.spec, 
				uFmt(u.pts, "pts"),
				uFmt(u.swc, "swc"),
				false?tooltip("i", unitDetails(u)):""
			);

	else 
		return "ERROR";
//	return "<b>"+u.spec + "</b> (" + u.pts+"pts/"+u.swc+"swc)";
}

function listOfPool(_pool) {
	output = [];
	for(i=0; i<_pool.length; i++)
		output.push(_pool[i].spec.replace("Lieutenant", "Lt"));
	return output.length>0?output.sort().join(", "):"** no units **";
}

function uFmt(nr, un){
	return String.format("<span class='ufmt'>{0} {1}</span>", nr, un);
}

function getUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            //console.log("getUrlValue() : "+VarSearch+" -> "+decodeURIComponent(KeyValuePair[1].trim()) )
            return decodeURIComponent(KeyValuePair[1].trim());
        }
    }
}

function tooltip(msg, tt) {
	return "<span class='tooltip' data-tooltip='"+escapeHtml(tt)+"'>"+escapeHtml(msg)+"</span>";
}

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

function popDropDown() {
	// populate the drop down to army selection
    var select = document.getElementById("dropdown");
    console.assert(select !== null)
    var options = knownFactions.concat(knownSectorials);
    var i;
    for (i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}
