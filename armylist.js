        var units = new Array(), armylistContent = JSON.parse(dumpArmyAsText());
        
        $(document).ready(function () {
                if(localStorage.getItem("iald.displayWeapons") == null)
                    localStorage.setItem("iald.displayWeapons", "true");
                if(localStorage.getItem("iald.displayEdit") == null)
                    localStorage.setItem("iald.displayEdit", "false");

                var vars = $.getUrlVars();
                if("list" in vars) {
             		if(confirm("An army list will be imported.\nThis will overwrite your current army list in IALD.\n\nAre you sure?"))
					{
                		if("import" in $.getUrlVars())
	                		if($.getUrlVar('import').toLowerCase() === "aleph") {
	 	                		data = importArmyFromAleph($.getUrlVar('list'));
	 	                		console.log("imported"+data);
				                localStorage.setItem("iald.army", JSON.stringify(data));
	 	                	} else {}
	                	else
	                		alert("The URL contains a list but the import source is not specified or known.");
                	}
            	}
    
                data = localStorage.getItem("iald.army");
                if(data == null)
                    data = dumpArmyAsText();
                armylistContent = JSON.parse(data);
                
                updateHTML();
                registerEvents();
/*
                // show Base64 encoded version of army
                // is said to work in FF and C only
                alert(btoa(armylistContent));
*/ 
        });

        function updateHTML() {
        	var d=document;
            d.getElementById("armylist")
                .innerHTML = updateArmyList();
            hideUnitWpn(toBoolean(localStorage.getItem("iald.displayWeapons")));
            hideLoadbox(toBoolean(localStorage.getItem("iald.displayEdit")));
        }

        function registerEvents() {
            $("button")
                .click(performClick);
            $("#wbtn")
                .click(tglWeapons);
            $("#lbtn")
                .click(performLoadClick);
        }

        function performClick() {
            var rebuild = true;
            var id = $(this).attr('id');
            if(id == "import") {
                armylistContent = importArmy();
                localStorage.setItem("iald.army", JSON.stringify(armylistContent));
                rebuild = true;
            } else if(id == "reset") {
                armylistContent = JSON.parse(dumpArmyAsText());
                localStorage.setItem("iald.army", dumpArmyAsText());
                rebuild = true;
            } else if(id == "download") {
                onDownload();

            } else if(id =="help") {
            	return;
            }
            else {
                var index = parseInt(id.substring(4));
                if(units.length > 0)
                    units[index].alive = !units[index].alive;
                localStorage.setItem("iald.army", JSON.stringify(units));
            }
            updateHTML(rebuild);
            registerEvents();
        }

        function performLoadClick() {
        	var ls = localStorage;
            display = !toBoolean(ls.getItem("iald.displayEdit"));
            ls.setItem("iald.displayEdit", display.toString());
            if(!display) {
                armylistContent = JSON.parse(document.getElementById("armyImport").value);
                ls.setItem("iald.army", JSON.stringify(armylistContent));
                updateHTML(true);
            } else
                updateHTML(false);
            registerEvents();
        }

        function hideUnitWpn(visible) {
        	var d=document;
            if(visible) {
                $(".weapondata")
                    .show();
                d.getElementById("wbtn")
                    .innerHTML = "hide wpn";
            } else {
                $(".weapondata")
                    .hide();
                d.getElementById("wbtn")
                    .innerHTML = "show wpn";
            }
            var elements = d.getElementsByClassName("unitWpn");
            for(var index = 0; index < elements.length; index++)
                elements[index].hidden = visible;
        }

        function hideLoadbox(visible) {
        	var d= document;
            if(visible) {
                $("#loadbox").show();
                d.getElementById("lbtn")
                    .innerHTML = "update army";

            } else {
                $("#loadbox").hide();
                d.getElementById("lbtn")
                    .innerHTML = "edit army";
            }
        }

        function toBoolean(a) {
            return String(a).toLowerCase() === 'true';
        }

        function tglWeapons() {
        	var ls = localStorage, display = !toBoolean(ls.getItem("iald.displayWeapons"));
            ls.setItem("iald.displayWeapons", display.toString());
            hideUnitWpn(display);
        }

        function tglLoad() {
        	var ls = localStorage, display = !toBoolean(ls.getItem("iald.displayEdit"));
            ls.setItem("iald.displayEdit", display.toString());
            hideLoadbox(display);
        }

        function loadUnits() {
            return armylistContent;
        }


function updateArmyList() {
	var armyStats = {
		"activePts": 0,
		"pts": 0,
		"swc": 0,
		"units": 0,
		"activeUnits": 0
	}, htmlArmyList = new Array();

	units = loadUnits();
	for(var index = 0; index < units.length; index++) {
		htmlArmyList.push( htmlUnit(units[index], armyStats, index));
	}

	return htmlListOpen(armyStats) + htmlArmyList.join(" ");
}

function htmlListOpen(armyStats) {
	var breakPoint = armyStats.pts * 0.4, text = armyStats.activeUnits + "/" + armyStats.units + " models, " +
		armyStats.activePts + "/" + armyStats.pts + "pts, " + armyStats.swc + 
		"SWC &mdash; break at " + Math.floor(breakPoint);
	if(armyStats.activePts <= 0)
		text = "<span class='red'>ANNIHILATED! " + text + "</span>";
	else if(armyStats.activePts <= breakPoint)
		text = "<span class='red'>RETREAT! " + text + "</span>";

	return '<div class="top"><span class="clear" id="lbtn" title="open army editor">edit army</span><span class="clear" id="wbtn" title="toggle verbose weapon display">hide wpns</span>'+
		'<a href="help.html" class="imgLink" title="open help page"><button id="help">help</button></a>'+
		'<div class="screen">' + text + '</div></div>' +
		'<div id="loadbox">Enter the army list here - either as Export from iaAleph or as manually entered JSON. If you enter invalid JSON your changes will get lost (click several time on updateArmy-button until it works again ;) See the help page for more infos about editing.<br>The reset-button loads a default army list - be careful, there is no safety question. Download allows you to save the army data as text file.<br>' +
		'<br>I have finished a way to import army lists from <a href="http://anyplace.it/ia/">ia Aleph</a>. Just copy the list that is shown when you click export in aleph. Then paste the list into the army editor field here and click IMPORT. Voila. I hope it works fine!<br><br>'+
		'<textarea id="armyImport" rows="10" cols="60">' +
		JSON.stringify(armylistContent, null, "\t") +
		'</textarea><br>' +
		'<button id="import" title="imports an army">import</button>' +
		'<button id="reset" title="reset army to example">reset</button>' +
		'<button id="download" title="download current army as text file">download</button>'+
		'</div>';
}

function onDownload() {
	document.location = 'data:Application/octet-stream;filename=armylist.txt,' +
		encodeURIComponent(localStorage.getItem("iald.army"));

}

function htmlUnit(_unit, _stats, index) {
	if(_unit == undefined) {
		alert("Unit was null - a bug has happened. I reset the army list, sorry!");
		                armylistContent = JSON.parse(dumpArmyAsText());
                localStorage.setItem("iald.army", dumpArmyAsText());
                return "";
	}

	if(typeof _unit == "string") {
		return "<h1>" + _unit + "</h1>";
	} else {
		name = _unit.spec;
		type = _unit.type;
		pts = parseInt(_unit.pts);
		swc = parseInt(_unit.swc);
		mov = _unit.mov;
		cc = _unit.cc;
		bs = _unit.bs;
		ph = _unit.ph;
		wip = _unit.wip;
		arm = _unit.arm;
		bts = _unit.bts;
		w = _unit.w;
		if("props" in _unit) {
			props = _unit.props.split(",");
		} else
			props = [];
		if("weapons" in _unit) {
			weapons = _unit.weapons.split(",");
		} else
			weapons = [];

		active = _unit.alive;

		if(_unit.regular)
			icons = "<a href = 'http://infinitythegame.wikispot.org/Instruction?action=show' class='imgLink'><img src='icons/regular_icon.png' width='24px' height='24px'></a>";
		else
			icons = "<a href = 'http://infinitythegame.wikispot.org/Instruction?action=show' class='imgLink'><img src='icons/irregular_icon.png' width='24px' height='24px'></a>";
		if(_unit.impetuous)
			icons += " <a href = 'http://infinitythegame.wikispot.org/Fury?action=show' class='imgLink'><img src='icons/impetuous_icon.png' width='24px' height='24px'></a> ";

		if(active) {
			_stats.activePts += pts;
			_stats.activeUnits++;
		}
		_stats.pts += pts;
		_stats.swc += swc;
		_stats.units++;

		var output = "";
		if(!active)
			output += '<div class="inactive" id="act' + index + '">';
		else {
			output += '<div class="active" id="act' + index + '">';
		}
		output += '<div class="unit"><div class="unitName">';

		//NAME and COST
		button = '<button title="toggle status of this unit" id="unit' + index + '">' + _stats.units + '</button>';
		output += '<div class="unitCost">' + type + ' ' + pts + 'pts ' + swc + 'SWC</div>' + button + name;

		if(active) {
			output += "</div>";

			if("header" in _unit)
				output += "<h2>"+_unit.header+"</h2>";
			/*
			else
				output += "<h2>"+_unit.isc+"</h2>";
*/

			output += statBox(mov, cc, bs, ph, wip, arm, bts, w, 1);

			if("secondStatLine" in _unit) {
				output += "<h2 class='second'>"+_unit.secondStatLine.header+"</h2>";
				output += statBox(
					_unit.secondStatLine.mov, 
					_unit.secondStatLine.cc, 
					_unit.secondStatLine.bs, 
					_unit.secondStatLine.ph, 
					_unit.secondStatLine.wip, 
					_unit.secondStatLine.arm, 
					_unit.secondStatLine.bts,
					_unit.secondStatLine.w, 
					.5
				);
			}

			propLinks = new Array();
			for(var index = 0; index < props.length; index++) {
				if(props[index].trim() != "")
					propLinks.push('<a href="http://infinitythegame.wikispot.org/' + props[index].trim() + '">' + props[index] + '</a>');
			}
			output += '<div class="unitProps">' + icons + ' ' + propLinks.join(' ') + '</div>';

			wpnLinks = new Array();
			for(var index = 0; index < weapons.length; index++) {
				if(weapons[index].trim()!=="")
					wpnLinks.push('<a href="http://infinitythegame.wikispot.org/' + weapons[index].replace(/ *\([^)]*\) */g, "").trim() + '">' + weapons[index] + '</a>');
			}
			output += '<div class="unitWpn">' + wpnLinks.join(' ') + '</div>';

			output += '<table class="weapondata"><tr>'+
			'<th>Weapon</th>'+
			'<th>Dmg</th>'+
			'<th>B</th>'+
			'<th>Ammo</th>'+
			'<th>Template</th>'+
			'<th class="value">S</th><th class="value">M</th><th class="value">L</th><th class="value">Max</th>'+
			'<th>Notes</th></tr>';
			for(var index = 0; index < weapons.length; index++) {
				weaponName = weapons[index];
				if(weaponName.trim() != "")
					output += '<tr><td>' + wpnLinks[index] + '</td>' + htmlWeapon(weaponName) + '</tr>';
			}
			output += '</table>';

		} else {
			output += " &mdash; Out Of Action! </div> ";
		}
		output += '</div>';
		output += '</div>\n\n';

		return output;
	}
}
function statBox(mov, cc, bs, ph, wip, arm, btw, wounds, opacity) {
	//KEYS - HEADER
			var output = "";
			output += "<table style='opacity:"+opacity+";"
				+"'><tr>";
			output += "<th class='isc'>mov</th>";
			output += "<th class='isc'>cc</th>";
			output += "<th class='isc'>bs</th>";
			output += "<th class='isc'>ph</th>";
			output += "<th class='isc'>wip</th>";
			output += "<th class='isc'>arm</th>";
			output += "<th class='isc'>bts</th>";
			output += "<th class='isc'>w</th>";
			output += "</tr>";

			// KEYS - DATA
			output += '<tr>';
			output += '<td class="stats">' + (mov) + '</td>';
			output += '<td class="stats">' + (cc) + '</td>';
			output += '<td class="stats">' + (bs) + '</td>';
			output += '<td class="stats">' + (ph) + '</td>';
			output += '<td class="stats">' + (wip) + '</td>';
			output += '<td class="stats">' + (arm) + '</td>';
			output += '<td class="stats">' + fmt(bts) + '</td>';
			output += '<td class="stats">' + (wounds) + '</td>';
			output += '</tr></table>';
			return output;
}

function htmlWeapon(name) {
	sname = name.replace(/ *\([^)]*\) */g, "").trim();
	var result = $.grep(data_weapons, function (e) {
		return e.name.trim().toLowerCase() == sname.trim().toLowerCase();
	});
	if(result.length == 0) {
		return "<td colspan='9'>weapon data not found.</td>";
		// not found
	} else if(result.length == 1) {
		weapon = result[0];
		var output = "";
		output += "<td class='wpnStats'>" + optOP(weapon.damage) + "</td>";
		output += "<td class='wpnStats'>" + optOP(weapon.burst) + "</td>";
		if(weapon.ammo.indexOf("/") === -1 && weapon.ammo.indexOf("+") === -1)
			output += "<td class='wpnStatsS'><a href='http://infinitythegame.wikispot.org/" + weapon.ammo + "''>"+ weapon.ammo +"</a></td>";
		else {
			if(weapon.ammo.indexOf("/") !== -1) {
				ammos = weapon.ammo.split("/");
				output += "<td class='wpnStatsS'>";
				for(var index = 0; index < ammos.length; index++) {
					output += "<a href='http://infinitythegame.wikispot.org/" + ammos[index] + "''>"+ ammos[index] +"</a>";
					if(index<ammos.length-1)
						output+= "/";
				}
			} else {
				ammos = weapon.ammo.split("+");
				output += "<td class='wpnStatsS'>";
				for(var index = 0; index < ammos.length; index++) {
					output += "<a href='http://infinitythegame.wikispot.org/" + ammos[index] + "''>"+ ammos[index] +"</a>";
					if(index<ammos.length-1)
						output+= "+";
				}
			}
			output += "</td>";
		}
		output += "<td class='wpnStatsS'>" + weapon.template + "</td>";
		output += "<td class='wpnStats' " + tdCol(weapon.short_mod) + ">" + slash(weapon.short_dist,weapon.short_mod) + "</td>";
		output += "<td class='wpnStats' " + tdCol(weapon.medium_mod) + ">" + slash(weapon.medium_dist,weapon.medium_mod) + "</td>";
		output += "<td class='wpnStats' " + tdCol(weapon.long_mod) + ">" + slash(weapon.long_dist,weapon.long_mod) + "</td>";
		output += "<td class='wpnStats' " + tdCol(weapon.max_mod) + ">" + slash(weapon.max_dist,weapon.max_mod) + "</td>";
		var notes = new Array();
		if(weapon.em_vul == "Yes")
			notes.push("E/M vuln.");
		if(weapon.cc == "Yes")
			notes.push("in CC");
		if(weapon.note != "")
			notes.push(weapon.note);
		output += "<td>" + notes.toString() + "</td>";
		return output;
	} else {
		console.log("multiple weapons found: %o", result);
	}
}

function slash (a, b) {
	a = optOP(a);
	b = fmt(b);
	if(a == "-" && b === "-")
		return "&ndash;";
	else
		return a+ "/" +b;
}

function tdCol(value) {
	if(value >= 3)
		return "style='background-color:#6c3'";
	if(value > -3 && value < 3)
		return "style='background-color:#ff6;'";
	if(value <= -3 && value > -6)
		return "style='background-color:#f93;'";
	if(value <= -6)
		return "style='background-color:#f33;'";

}

function fmt(value) {
	if(value > 0)
		return "+" + value;
	else
		if(value < 0)
			return "&minus;"+Math.abs(value);
		else
			return optOP(value);
}

function optOP(value) {
	if(value == "--")
		value = "&ndash;";
	return value;
}

function dumpArmyAsText() {
	return '[\r\n  \"triad 1\",\r\n  {\r\n    \"spec\": \"Sakiel - Viral\",\r\n    \"header\": \"active symbiont armor\",\r\n    \"regular\": true,\r\n    \"impetuous\": true,\r\n    \"type\": \"LI\",\r\n    \"pts\": 26,\r\n    \"swc\": 0,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 14,\r\n    \"bs\": 12,\r\n    \"ph\": 11,\r\n    \"wip\": 13,\r\n    \"arm\": 2,\r\n    \"bts\": 0,\r\n    \"w\": 1,\r\n    \"props\": \"Cube, Fireteam: Tohaa, Impetuous, Symbiont Armour, V: Courage\",\r\n    \"weapons\": \"Viral Combi Rifle, Swarm Grenades, Pistol, Knife\",\r\n    \"secondStatLine\": {\r\n      \"header\": \"inactive symbiont armor\",\r\n      \"mov\": \"4-4\",\r\n      \"bs\": 12,\r\n      \"cc\": 14,\r\n      \"ph\": 11,\r\n      \"wip\": 13,\r\n      \"arm\": 0,\r\n      \"bts\": 0,\r\n      \"w\": 1\r\n    },\r\n    \"alive\": true\r\n  },\r\n  {\r\n    \"spec\": \"Kamael - Combi\",\r\n    \"regular\": true,\r\n    \"impetuous\": false,\r\n    \"type\": \"LI\",\r\n    \"pts\": 12,\r\n    \"swc\": 0,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 13,\r\n    \"bs\": 11,\r\n    \"ph\": 11,\r\n    \"wip\": 13,\r\n    \"arm\": 1,\r\n    \"bts\": 0,\r\n    \"w\": 1,\r\n    \"props\": \"Cube, Fireteam: Tohaa\",\r\n    \"weapons\": \"Combi Rifle, Pistol, Knife\",\r\n    \"alive\": true\r\n  },\r\n  {\r\n    \"spec\": \"Kamael - Combi\",\r\n    \"regular\": true,\r\n    \"impetuous\": false,\r\n    \"type\": \"LI\",\r\n    \"pts\": 12,\r\n    \"swc\": 0,\r\n    \"mov\": \"4-4\",\r\n    \"bs\": 13,\r\n    \"cc\": 11,\r\n    \"ph\": 11,\r\n    \"wip\": 13,\r\n    \"arm\": 1,\r\n    \"bts\": 0,\r\n    \"w\": 1,\r\n    \"props\": \"Cube, Fireteam: Tohaa\",\r\n    \"weapons\": \"Combi Rifle, Pistol, Knife\",\r\n    \"alive\": true\r\n  },\r\n  \"triad 2\",\r\n  {\r\n    \"spec\": \"Makaul - Swarm\",\r\n    \"regular\": true,\r\n    \"impetuous\": true,\r\n    \"type\": \"WB\",\r\n    \"pts\": 18,\r\n    \"swc\": 0,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 19,\r\n    \"bs\": 11,\r\n    \"ph\": 13,\r\n    \"wip\": 13,\r\n    \"arm\": 1,\r\n    \"bts\": -3,\r\n    \"w\": 1,\r\n    \"props\": \"Cube, Fireteam: Tohaa, Impetuous, Martial Arts L2, i-Kohl L1\",\r\n    \"weapons\": \"Swarm Grenades, Zero-V Smoke Grenades, Heavy Flamethrower, Pistol, Viral CCW\",\r\n    \"alive\": true\r\n  },\r\n  {\r\n    \"spec\": \"Makaul - Flamer\",\r\n    \"regular\": true,\r\n    \"impetuous\": true,\r\n    \"type\": \"WB\",\r\n    \"pts\": 15,\r\n    \"swc\": 0,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 19,\r\n    \"bs\": 11,\r\n    \"ph\": 13,\r\n    \"wip\": 13,\r\n    \"arm\": 1,\r\n    \"bts\": -3,\r\n    \"w\": 1,\r\n    \"props\": \"Cube, Fireteam: Tohaa, Impetuous, Martial Arts L2, i-Kohl L1\",\r\n    \"weapons\": \"Zero-V Smoke Grenades, Heavy Flamethrower, Pistol, Viral CCW\",\r\n    \"alive\": true\r\n  },\r\n  {\r\n    \"spec\": \"Makaul - Flamer\",\r\n    \"regular\": true,\r\n    \"impetuous\": true,\r\n    \"type\": \"WB\",\r\n    \"pts\": 15,\r\n    \"swc\": 0,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 19,\r\n    \"bs\": 11,\r\n    \"ph\": 13,\r\n    \"wip\": 13,\r\n    \"arm\": 1,\r\n    \"bts\": -3,\r\n    \"w\": 1,\r\n    \"props\": \"Cube, Fireteam: Tohaa, Impetuous, Martial Arts L2, i-Kohl L1\",\r\n    \"weapons\": \"Zero-V Smoke Grenades, Heavy Flamethrower, Pistol, Viral CCW\",\r\n    \"alive\": true\r\n  },\r\n  \"loner\",\r\n  {\r\n    \"spec\": \"Ectros - Lt\",\r\n    \"header\": \"active symbiont armor\",\r\n    \"regular\": true,\r\n    \"impetuous\": false,\r\n    \"type\": \"HI\",\r\n    \"pts\": 50,\r\n    \"swc\": 0,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 17,\r\n    \"bs\": 13,\r\n    \"ph\": 14,\r\n    \"wip\": 13,\r\n    \"arm\": 3,\r\n    \"bts\": -6,\r\n    \"w\": 2,\r\n    \"props\": \"Cube, Fireteam: Tohaa, Poison, Symbiont Armor\",\r\n    \"weapons\": \"Viral Combi Rifle, Nanopulser, Pistol, CCW\",\r\n    \"secondStatLine\": {\r\n      \"header\": \"inactive symbiont armor\",\r\n      \"mov\": \"4-4\",\r\n      \"cc\": 17,\r\n      \"bs\": 12,\r\n      \"ph\": 11,\r\n      \"wip\": 13,\r\n      \"arm\": 0,\r\n      \"bts\": 0,\r\n      \"w\": 1\r\n    },\r\n    \"alive\": true\r\n  },\r\n  {\r\n    \"spec\": \"Chaksa - HMG\",\r\n    \"regular\": true,\r\n    \"impetuous\": false,\r\n    \"type\": \"LI\",\r\n    \"pts\": 25,\r\n    \"swc\": 1,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 14,\r\n    \"bs\": 11,\r\n    \"ph\": 12,\r\n    \"wip\": 13,\r\n    \"arm\": 0,\r\n    \"bts\": 0,\r\n    \"w\": 1,\r\n    \"props\": \"Poison, V: Courage, 360\u00B0 Visor, Neurocinetics\",\r\n    \"weapons\": \"HMG, Pistol, CCW\",\r\n    \"alive\": true\r\n  },\r\n  {\r\n    \"spec\": \"Chaksa - HMG\",\r\n    \"regular\": true,\r\n    \"impetuous\": false,\r\n    \"type\": \"LI\",\r\n    \"pts\": 25,\r\n    \"swc\": 1,\r\n    \"mov\": \"4-4\",\r\n    \"cc\": 14,\r\n    \"bs\": 11,\r\n    \"ph\": 12,\r\n    \"wip\": 13,\r\n    \"arm\": 0,\r\n    \"bts\": 0,\r\n    \"w\": 1,\r\n    \"props\": \"Poison, V: Courage, 360\u00B0 Visor, Neurocinetics\",\r\n    \"weapons\": \"HMG, Pistol, CCW\",\r\n    \"alive\": true\r\n  }\r\n]';
}	
function importArmy() {
	var input = document.getElementById("armyImport").value;
	var importedUnits = input.split("\n");
	var output = new Array();
	for(var i=0;i<importedUnits.length;i++) {
		var line = importedUnits[i].replace(/ *\([^)]*\) */g, "").trim();
		if(line != "") {
			if(line.indexOf("Combat Group") !== -1)
				output.push(line);
			else {
				var obj = findUnitBySpec(line);
				if(obj !== null)
					output.push(obj);
				else
					output.push(line);
			}
		}
	}
	return output;
}

function findUnitBySpec(spec) {
	var unitsJSON = getUnitsJSON();
/*	for(var i=0; i<unitsJSON.length; i++)
		if(unitsJSON[i].spec === spec)
			return unitsJSON[i];
	console.log("unit not found: "+spec);
	return null;
*/
	index = searchArray("spec", spec, unitsJSON);
	if(index>=0)
		return unitsJSON[index];
	else
		return null;
	
}

function importArmyFromAleph(data) {
	var importedUnits = getJSONfromURL(data).models;
	var output = new Array();
	for(var i=0;i<importedUnits.length;i++) {
		var model = importedUnits[i]; 
		var obj = findUnitByISCAndCode(model.isc, model.code);
		if(obj !== null) {
			output.push(obj);
		}
		else
			output.push("unit not found:"+model.toString());
    }
    return output;
}
 


function findUnitByISCAndCode(isc, code) {
	var unitsJSON = getUnitsJSON();
	for(var i=0; i<unitsJSON.length; i++)
		if(unitsJSON[i].isc === isc && unitsJSON[i].code === code)
			return unitsJSON[i];
	console.log("unit not found: "+isc+"/"+code);
	return null;
}


function decode_base64(s) {
    var e={},i,k,v=[],r='',w=String.fromCharCode;
    var n=[[65,91],[97,123],[48,58],[43,44],[47,48]];

    for(z in n){for(i=n[z][0];i<n[z][1];i++){v.push(w(i));}}
    for(i=0;i<64;i++){e[v[i]]=i;}

    for(i=0;i<s.length;i+=72){
    var b=0,c,x,l=0,o=s.substring(i,i+72);
         for(x=0;x<o.length;x++){
                c=e[o.charAt(x)];b=(b<<6)+c;l+=6;
                while(l>=8){r+=w((b>>>(l-=8))%256);}
         }
    }
    return r;
}

function getJSONfromURL(url) {
	return JSON.parse(
            decode_base64 (
                unescape(
                    url.replace(/^.*list=/,'')
                ).
                    replace(/[%]../g,'').
                    replace(/_/g,'/').
                    replace(/-/g,'+').
                    replace(/[.:]/g,'=').
                    replace(/[^a-zA-Z0-9+\/=]/g,'')
            )
    );
}

function searchArray(key, needle, haystack, case_insensitive) {
    if (typeof(haystack) === 'undefined' || !haystack.length) return -1;
    var high = haystack.length - 1;
    var low = 0;
    case_insensitive = (typeof(case_insensitive) === 'undefined' || case_insensitive) ? true:false;
    needle = (case_insensitive) ? needle.toLowerCase():needle;

    while (low <= high) {
        mid = parseInt((low + high) / 2)
        element = (case_insensitive) ? haystack[mid][key].toLowerCase():haystack[mid][key];
        if (element > needle) {
            high = mid - 1;
        } else if (element < needle) {
            low = mid + 1;
        } else {
            return mid;
        }
    }
    return -1;
};

// Read a page's GET URL variables and return them as an associative array.
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});