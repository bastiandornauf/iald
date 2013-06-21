// walk through every unit and every child from data.units

window.onload = run;
var stats = [ "mov", "cc", "bs", "ph", "wip", "arm", "bts", "w"];
var statsLength = stats.length;

var dUnits;

function importData() {
//		dUnits = new Object();
	dUnits = new Array();
	for (var i=0, toti=sUnits.length; i < toti; i++) {
		var sUnit = sUnits[i];
		var dUnit = new Object();

		console.log(sUnit.isc);
		dUnit["isc"] = sUnit.isc;

		// spec relies on childs

		if(sUnit.irr.toLowerCase() == "x")
			dUnit.regular = false;
		else
			dUnit.regular = true;

		if(sUnit.imp.toLowerCase() == "x")
			dUnit.impetuous = true;
		else
			dUnit.impetuous = false;

		// pts + swc rely on childs

		dUnit["type"] = sUnit["type"];

		// stat block
		for(var n=0; n<statsLength; n++) {
			dUnit[stats[n]] = sUnit[stats[n]];
		}

		// props and weapons rely on childs

		dUnit.alive = true;

		if("altp" in sUnit) {
			// TODO inelegant construction of base header
			dUnit.header = sUnit.isc;

			var statLine = new Object();
			for(var n=0; n<statsLength; n++) {
				var s = sUnit.altp[0][stats[n]];
				if($.trim(s) != "")
					statLine[stats[n]] = sUnit.altp[0][stats[n]];
				else
					statLine[stats[n]] = dUnit[stats[n]];
			}		
			statLine.header = sUnit.altp[0].isc;
			
			dUnit.secondStatLine = statLine;
		}

		// Now lets walk through all those childs ...
		for(var j=0, totj=sUnit.childs.length; j<totj; j++ ) {
			var child = sUnit.childs[j];

			dUnit.swc = child.swc;
			dUnit.pts = child.cost;

			dUnit.spec = sUnit.name;
			if(child.codename == "" && child.code !="Default")
				dUnit.spec += " " + child.code;
			else
				dUnit.spec += " " + child.codename;

			console.log(" .. "+dUnit.spec);

/*
				if(child["code"].toLowerCase() != "default" && child.code != "")
					dUnit.spec = sUnit.name + " " + child.code;
				else
						if(child.codename != "") {
							dUnit.spec = sUnit.name + " " + child.codename;
						}
						else {
							if(sUnit["code"] != "")
								dUnit.spec = sUnit.name + " " + sUnit["code"];
							else 
								dUnit.spec = sUnit.name;
						}
*/

			dUnit.props = sUnit.spec.concat(child.spec).toString();
			dUnit.weapons = sUnit.bsw.concat(child.bsw, sUnit.ccw, child.ccs).toString();

			dUnit.spec = dUnit.spec.trim();
			dUnit.code = child.code;
//			dUnits[sUnit.isc+" - "+child.code] = owl.deepCopy(dUnit);
			dUnits.push(owl.deepCopy(dUnit));
		}
	}
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function run() {
	importData();
	document.getElementById("json").innerHTML = JSON.stringify(sortByKey(dUnits, "spec"), null, "\t");
}