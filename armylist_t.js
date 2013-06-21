function updateArmyList(rebuild) {
	var armyStats = {
		"activePts": 0,
		"pts": 0,
		"swc": 0,
		"units": 0,
		"activeUnits": 0
	}
	var htmlArmyList = "";

	if(unitCache == "" || rebuild) {
		units = loadUnits();
		for(var index = 0; index < units.length; index++) {
			htmlArmyList += htmlUnit(units[index], armyStats, index);
		}
		htmlArmyList = htmlListOpen(armyStats) + htmlArmyList;

		unitCache = htmlArmyList;
	} else {
		htmlArmyList = unitCache;
	}

	return htmlArmyList;
}

function htmlListOpen(armyStats) {
	var breakPoint = armyStats.pts * 0.4;
	console.log(breakPoint);
	var text = armyStats.activeUnits + "/" + armyStats.units + " models, " +
		armyStats.activePts + "/" + armyStats.pts + "pts, " + armyStats.swc + 
		"SWC &mdash; break at " + Math.floor(breakPoint);
	console.log(text);
	if(armyStats.activePts <= 0)
		text = "<span class='red'>ANNIHILATED! " + text + "</span>";
	else if(armyStats.activePts <= breakPoint)
		text = "<span class='red'>RETREAT! " + text + "</span>";

	return '<div class="top"><span class="clear" id="lbtn" title="open army editor">edit army</span><span class="clear" id="wbtn" title="toggle verbose weapon display">hide wpns</span>'+
		'<div class="screen">' + text + '</div></div>' +
		'<div id="loadbox">Enter the army list here, its has to be formatted as JSON. If you enter invalid JSON your changes will get lost (click several time on updateArmy-button until it works again ;) I am planning to allow a much more convenient method of data entry, but for now this should work.<br>The reset-button loads a default army list - be careful, there is no safety question. Download allows you to save the army data as text file.<br>' +
		'<textarea id="armyImport" rows="10" cols="60">' +
		JSON.stringify(armylistContent, null, "\t") +
		'</textarea><br>' +
		'<button id="reset" title="reset army to example">reset</button>' +
		'<button id="download" title="download current army as text file">download</button></div>';
}

function onDownload() {
	document.location = 'data:Application/octet-stream;filename=armylist.txt,' +
		encodeURIComponent(localStorage.getItem("iald.army"));

}

function htmlUnit(_unit, _stats, index) {
	if(typeof _unit == "string") {
		return "<h1>" + _unit + "</h1>";
	} else {
		name = _unit.spec;
		type = _unit.type;
		pts = _unit.pts;
		swc = _unit.swc;
		mov = _unit.mov;
		cc = _unit.cc;
		bs = _unit.bs;
		ph = _unit.ph;
		wip = _unit.wip;
		arm = _unit.arm;
		bts = _unit.bts;
		w = _unit.w;
		props = _unit.props.split(",");
		weapons = _unit.weapons.split(",");
		active = _unit.alive;

		if(_unit.regular)
			icons = "<img src='icons/regular_icon.png' width='24px' height='24px'>";
		else
			icons = "<img src='icons/irregular_icon.png' width='24px' height='24px'>";
		if(_unit.impetuous)
			icons += " <img src='icons/impetuous_icon.png' width='24px' height='24px'> ";

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
				propLinks.push('<a href="http://infinitythegame.wikispot.org/' + props[index].trim() + '">' + props[index] + '</a>');
			}
			output += '<div class="unitProps">' + icons + ' ' + propLinks.join(' ') + '</div>';

			wpnLinks = new Array();
			for(var index = 0; index < weapons.length; index++) {
				wpnLinks.push('<a href="http://infinitythegame.wikispot.org/' + weapons[index].trim() + '">' + weapons[index] + '</a>');
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
				var weaponName = weapons[index];
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
	var result = $.grep(data_weapons, function (e) {
		return e.name.trim().toLowerCase() == name.trim().toLowerCase();
	});
	if(result.length == 0) {
		console.log("weapon %s was not found.", name);
		return "<td colspan='9'>weapon data not found.</td>";
		// not found
	} else if(result.length == 1) {
		weapon = result[0];
		var output = "";
		output += "<td class='wpnStats'>" + optOP(weapon.damage) + "</td>";
		output += "<td class='wpnStats'>" + optOP(weapon.burst) + "</td>";
		if(weapon.ammo.indexOf("/") == -1)
			output += "<td class='wpnStatsS'><a href='http://infinitythegame.wikispot.org/" + weapon.ammo + "''>"+ weapon.ammo +"</a></td>";
		else {
			console.log("Found /: "+weapon.ammo);
			var ammos = weapon.ammo.split("/");
			output += "<td class='wpnStatsS'>";
			for(var index = 0; index < ammos.length; index++) {
				output += "<a href='http://infinitythegame.wikispot.org/" + ammos[index] + "''>"+ ammos[index] +"</a>";
				if(index<ammos.length-1)
					output+= "/";
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
		return "style='background-color:#3a3'";
	if(value > -3 && value < 3)
		return "style='background-color:yellow;'";
	if(value <= -3 && value > -6)
		return "style='background-color:orange;'";
	if(value <= -6)
		return "style='background-color:#c33;'";

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