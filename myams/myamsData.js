var yamsInfo = {
	name: "YAMS",
	link: "http://wargamingtrader.com/yams",
	version: "1.1",
	rules: "<h2>Setup Sequence:</h2><ul><li>Choose lists.</li><li>Draw 6 and discard 2 mission cards.</li><li>Roll off for Initiative v. Deploy.</li><li>Place the Civvie and crate d20&Prime; in from opposite table edges.</li><li>Deploy including flags, no deployment within ZoC of Civvie or crate.</li><li>Double-or-Quits, start first turn.</li></ul>"
};

var assessTable = "";
/*
 colors 
 violet 755ba2
 blue 4571b1
 red c81931
 orange f18e37
 green 7cba4f
*/

var yamsCardStack = [
	{
		title: "Catch the pigeon!",
		color: "755ba2",
		objective: "have the Civvie controlled by one of your active models via Ghost: Synchronised at the end of the game.",
		conditions: "remember that the Civvie becomes a target for AROs and deployables once it is synched.",
		reveal: "at end of game."
	},
	{
		title: "Collect",
		color: "4571b1",
		objective: "collect a document from any unconscious or dead enemy model.",
		conditions: "this is a short skill which requires BtB contact and a successful WIP check at -3. It cannot be done in ARO. The point is gained immediately.",
		reveal: "when declaring the short skill."
	},
	{
		title: "Kill the pidgeon",
		color: "c81931",
		fluff: "A spy is on the loose and must be stopped before their secrets are passed on.",
		objective: "the Civvie model must be dead at the end of the game.",
		conditions: "it doesn’t matter how the Civvie dies.",
		reveal: "at end of game."
	},
	{
		title: "Blockade",
		color: "f18e37",
		fluff: "Stop the enemy advance from reaching your lines.",
		objective: "keep control of your deployment zone.",
		conditions: "no active enemy models within your deployment zone at the end of the game.",
		reveal: "at end of game."
	},
	{
		title: "Forward base",
		color: "7cba4f",
		objective: "control one of the centreline terrain pieces at the end of the game.",
		conditions: "privately nominate the piece during deployment. You must have an active model in BtB contact with or within the terrain and no active enemy models in BtB contact or within it.",
		reveal: "at end of game."
	},
	{
		title: "Infiltrate",
		color: "7cba4f",
		objective: "have an active model in the enemy deployment zone at the end of the game.",
		conditions: "none.",
		reveal: "at end of game."
	},
	{
		title: "Mapping",
		color: "7cba4f",
		objective: "map the enemy DZ with a short skill/WIP check.",
		conditions: "cannot be done in the first turn. Cannot be done as an ARO. Model must be within the enemy DZ.",
		reveal: "when declaring skill."
	},
	{
		title: "Triangulation",
		color: "7cba4f",
		objective: "have a beacon within 10&Prime; of a table corner in the enemy DZ.",
		conditions: "place the beacon as if it were a Mine or E/Mauler but it can’t be done in ARO. The beacon has ARM1 BTS-3 STR1 &amp; Mimetism and must survive until the end of the game.",
		reveal: "when declaring skill."
	},
	{
		title: "Clear the Area!",
		color: "7cba4f",
		objective: "have none of your active models in your own deployment zone at the end of the game.",
		conditions: "none.",
		reveal: "at end of game."
	},
	{
		title: "Advance",
		color: "7cba4f",
		objective: "have at least three active models over the centreline at the end of the game.",
		conditions: "none.",
		reveal: "at end of game."
	},
	{
		title: "Assess",
		color: "4571b1",
		objective: "see at least 75% of the enemy force.",
		conditions: "LoF can be gained at any point during the game, LoF to markers doesn’t count." + assessTable,
		reveal: "at end of game."
	},
	{
		title: "Search the Crate",
		color: "4571b1",
		objective: "search the crate with one of your models.",
		conditions: "this is a short skill which requires BtB contact and a successful WIP check at -3. It cannot be done in ARO. The point is gained immediately. The crate is still searchable after this.",
		reveal: "when declaring the skill."
	},
	{
		title: "Ambush",
		color: "4571b1",
		objective: "counter one of the enemy’s objectives.",
		conditions: "the opponent must immediately reveal one random card. You gain one point now but lose it if the opponent achieves the revealed objective.",
		reveal: "after Double or Quits but before the first turn."
	},
	{
		title: "Capture",
		color: "c81931",
		fluff: "Intimidate the enemy through close assault.",
		objective: "kill at least two enemy models in close combat.",
		conditions: "synched Civvies do not count, neither does firing into combat.",
		reveal: "at end of game."
	},
	{
		title: "Intimidation",
		color: "c81931",
		fluff: "The Civvie is a gang boss who must be shown his place.",
		objective: "kill at least one enemy model within the Civvie’s sight.",
		conditions: "the kill must be within the Civvie’s LoF.",
		reveal: "when model is killed."
	},
	{
		title: "Kill the Leader",
		color: "c81931",
		fluff: "Decapitate the enemy chain of command by killing the Lieutenant.",
		objective: "kill an enemy Lieutenant.",
		conditions: "any enemy Lieutenant kill during the game counts.",
		reveal: "at end of game."
	},
	{
		title: "Kill the Boffin",
		color: "c81931",
		fluff: "Destroy the enemy’s support infrastructure.",
		objective: "kill a Doctor, Hacker or Engineer.",
		conditions: "the kill can take place at any point during the game. If there are no specialists, count the model worth the most points.",
		reveal: "at end of game."
	},
	{
		title: "Prize Fighter",
		color: "c81931",
		fluff: "Demoralise the enemy by killing their most powerful unit.",
		objective: "kill the most expensive enemy model.",
		conditions: "the kill can take place at any point during the game. The target must be the model worth the most points.",
		reveal: "at end of game."
	},
	{
		title: "Hold",
		color: "f18e37",
		fluff: "Hold the line!",
		objective: "don’t be in Retreat at the end of the game.",
		conditions: "you can be in Retreat during the game as long as you aren’t currently retreating at the end of the game. An all-Religious force will make no difference.",
		reveal: "at end of game."
	},
	{
		title: "Decimate",
		color: "f18e37",
		fluff: "It’s only one in ten&hellip;",
		objective: "take out at least half of the enemy force.",
		conditions: "at least half the models in the enemy force must be unconscious, dead, immobilised, possessed or Sepsitorised at the end of the game.",
		reveal: "at end of game."
	},
	{
		title: "Attrition",
		color: "f18e37",
		fluff: "Last to die wins.",
		objective: "end the game with more points on the table.",
		conditions: "at the end of the game you must control more points worth of active models than the other player.",
		reveal: "at end of game."
	},
	{
		title: "Forward Target",
		color: "f18e37",
		objective: "sabotage one of the centreline terrain pieces with a short skill/WIP check.",
		conditions: "privately nominate the piece during deployment. Models need BtB contact and a successful WIP check at -3. This can’t be done in ARO or the first turn and the point is gained immediately.",
		reveal: "when declaring the skill."
	},
	{
		title: "Flag Kill",
		color: "755ba2",
		fluff: "Destroy the enemy supply dump/communications hub.",
		objective: "destroy the enemy flag.",
		conditions: "cannot be done in the first turn. Remember that the flag starts as a camouflage marker.",
		reveal: "at end of game."
	},
	{
		title: "Capture the Flag",
		color: "755ba2",
		objective: "destroy the enemy flag in close combat.",
		conditions: "cannot be done in the first turn and cannot be done if there are any enemy models in BtB contact with your own flag. Remember that the flag starts as a camouflage marker but you are allowed to charge it.",
		reveal: "at end of game."
	}
];
