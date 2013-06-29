var yamsInfo = {
	name: "YAMS",
	link: "http://wargamingtrader.com/yams",
	version: "1.1",
	rules: 
		"<h2>Setup Sequence:</h2><ul><li>Choose lists.</li><li>Draw 6 and discard 2 mission cards.</li><li>Roll off for Initiative v. Deploy.</li><li>Place the Civvie and crate d20&Prime; in from opposite table edges.</li><li>Deploy including flags, no deployment within ZoC of Civvie or crate.</li><li>Double-or-Quits, start first turn.</li></ul>"+
		"<h2>Overview:</h2><p>At the start of the game, each player draws a number of objective cards and then chooses some of them to discard. During the game and at the end of the game, different objective cards are revealed as their conditions are met. Each card revealed in this way is worth 1VP.</p>"+
		"<h2>Pick Armies, Select Cards</h2> <p>After choosing their army list each player randomly picks six cards from their pile of objective cards and discards two of their choice leaving them with four objectives, each worth one VP. These cards are kept secret, the other player does not know your objectives!</p> <p>To alter the total number of points available in a game alter the number of cards kept and discarded.</p>"+
		"<h2>Double-or-Quits, Start Game</h2>"+
		"<p>Starting with the player who will get first turn, each player can announce ʻdoubleor-quitsʼ. They then reveal one of their objective cards. If the conditions are acheived, this card is worth 2VP instead of 1VP. Ambush cards are then played, starting with the first player.</p>"+
		"<h2>Deployment</h2>"+
		"<p>The player that gets deployment should place the Civvie and Crate before any models are deployed. Place the Civvie on the centre line of the table, d20” from the left table edge and the Crate d20” in from the opposite table edge, also on the centre line.</p>"+
		"<p>When deploying their main force, each player must also deploy a flag/HQ marker in their deployment zone. This is the size and shape of a 25mm base, has ARM0 and BTS0 and is destroyed by any failed ARM or BTS roll. It cannot be moved and counts as having CH: Camouflage against shooting.</p>"+
		"<p>Deploy reserve models as normal.</p>"+
		"<p><span class='bold'>Important note:</span> models cannot deploy with the Civvie or Crate within their 8” ZoC.</p>"+
		"<h2>Notes</h2>"+	
		"<h3>Civvie</h3>"+
		"<ul> <li>The Civvie is neutral.</li> <li>It cannot be shot at unless it is synched to an enemy model.</li> <li>Once synched to an enemy model it counts as an enemy model for AROs, deployable equipment and Impetuous moves.</li> <li>Anyone can attack the Civvie in close combat.</li> <li>Models cannot deploy with the Civvie in their ZoC.</li></ul>"+
		"<h3>Crate</h3>"+
		"<ul><li>The crate cannot be moved or destroyed.</li><li>Models cannot deploy with the Crate in their ZoC.</li></ul>"+
		"<h3>Triangulation</h3><ul><li>Each model carries a single beacon.</li></ul>"+
		"<h3>Forward Base/Forward Target</h3>"+
		"<ul><li>The terrain piece must be wholly within 6&Prime; of the centre line between the playerʼs deployment zones.</li></ul>"+
		"<h3>General</h3>"+
		"<ul><li>ʻCannot be done in the first turnʼ cards canʼt be used at all in the first game turn.</li></ul>"+
		"",
	 draw: 6,
	 keep: 4
};

var assessTable = "<table><tr><th>Force</th><th>75%</th><th>Force</th><th>75%</th><th>Force</th><th>75%</th><th>Force</th><th>75%</th></tr> <tr><td>1</td><td>1</td><td>6-7</td><td>5</td><td>12</td><td>9</td><td>17</td><td>13</td> <tr><td>2-3</td><td>2</td><td>8</td><td>6</td><td>13</td><td>10</td><td>18-19</td><td>14</td> <tr><td>3</td><td>3</td><td>9</td><td>7</td><td>14-15</td><td>11</td><td>20</td><td>15</td> <tr><td>4</td><td>4</td><td>10-11</td><td>8</td><td>16</td><td>12</td><td></td><td></td> </table> "; /*
 colors 
 violet 755ba2
 blue 4571b1
 red c81931
 orange f18e37
 green 7cba4f
*/
var welcomeStack = [
	{
		title: "Welcome to MobileYAMS!",
		text: "<p>To play a game with MobileYAMS just click on the DRAW button above. Six cards will be randomly drawn. Then you can discard two by clicking the discard buttons. Clicking on a header of a card you can activate a mode where only this card is shown, so you can reveal it to your opponent.</p>"+
			"<p>Press RULES to see the YAMS rules.</p>"+
			"<p>Press HELP to get a help text for MobileYAMS</p>"+
			"<p></p>",
		color: "4571b1",
		objective: "",
		conditions: "",
		reveal: ""
	}
];

var yamsCardStack = [
	{
		title: "Catch the pigeon!",
		icon: "icons/qmark.png",
		color: "755ba2",
		objective: "have the Civvie controlled by one of your active models via Ghost: Synchronised at the end of the game.",
		conditions: "remember that the Civvie becomes a target for AROs and deployables once it is synched.",
		reveal: "at end of game."
	},
	{
		title: "Collect",
		icon: "icons/intel.png",
		color: "4571b1",
		objective: "collect a document from any unconscious or dead enemy model.",
		conditions: "this is a short skill which requires BtB contact and a successful WIP check at -3. It cannot be done in ARO. The point is gained immediately.",
		reveal: "when declaring the short skill."
	},
	{
		title: "Kill the pidgeon",
		icon: "icons/skull.png",
		color: "c81931",
		fluff: "A spy is on the loose and must be stopped before their secrets are passed on.",
		objective: "the Civvie model must be dead at the end of the game.",
		conditions: "it doesn’t matter how the Civvie dies.",
		reveal: "at end of game."
	},
	{
		title: "Blockade",
		icon: "icons/block.png",
		color: "f18e37",
		fluff: "Stop the enemy advance from reaching your lines.",
		objective: "keep control of your deployment zone.",
		conditions: "no active enemy models within your deployment zone at the end of the game.",
		reveal: "at end of game."
	},
	{
		title: "Forward base",
		icon: "icons/arrow.png",
		color: "7cba4f",
		objective: "control one of the centreline terrain pieces at the end of the game.",
		conditions: "privately nominate the piece during deployment. You must have an active model in BtB contact with or within the terrain and no active enemy models in BtB contact or within it.",
		reveal: "at end of game."
	},
	{
		title: "Infiltrate",
		icon: "icons/arrow.png",
		color: "7cba4f",
		objective: "have an active model in the enemy deployment zone at the end of the game.",
		conditions: "none.",
		reveal: "at end of game."
	},
	{
		title: "Mapping",
		icon: "icons/arrow.png",
		color: "7cba4f",
		objective: "map the enemy DZ with a short skill/WIP check.",
		conditions: "cannot be done in the first turn. Cannot be done as an ARO. Model must be within the enemy DZ.",
		reveal: "when declaring skill."
	},
	{
		title: "Triangulation",
		icon: "icons/arrow.png",
		color: "7cba4f",
		objective: "have a beacon within 10&Prime; of a table corner in the enemy DZ.",
		conditions: "place the beacon as if it were a Mine or E/Mauler but it can’t be done in ARO. The beacon has ARM1 BTS-3 STR1 &amp; Mimetism and must survive until the end of the game.",
		reveal: "when declaring skill."
	},
	{
		title: "Clear the Area!",
		icon: "icons/arrow.png",
		color: "7cba4f",
		objective: "have none of your active models in your own deployment zone at the end of the game.",
		conditions: "none.",
		reveal: "at end of game."
	},
	{
		title: "Advance",
		icon: "icons/arrow.png",
		color: "7cba4f",
		objective: "have at least three active models over the centreline at the end of the game.",
		conditions: "none.",
		reveal: "at end of game."
	},
	{
		title: "Assess",
		icon: "icons/intel.png",
		color: "4571b1",
		objective: "see at least 75% of the enemy force.",
		conditions: "LoF can be gained at any point during the game, LoF to markers doesn’t count." + assessTable,
		reveal: "at end of game."
	},
	{
		title: "Search the Crate",
		icon: "icons/intel.png",
		color: "4571b1",
		objective: "search the crate with one of your models.",
		conditions: "this is a short skill which requires BtB contact and a successful WIP check at -3. It cannot be done in ARO. The point is gained immediately. The crate is still searchable after this.",
		reveal: "when declaring the skill."
	},
	{
		title: "Ambush",
		icon: "icons/intel.png",
		color: "4571b1",
		objective: "counter one of the enemy’s objectives.",
		conditions: "the opponent must immediately reveal one random card. You gain one point now but lose it if the opponent achieves the revealed objective.",
		reveal: "after Double or Quits but before the first turn."
	},
	{
		title: "Capture",
		icon: "icons/skull.png",
		color: "c81931",
		fluff: "Intimidate the enemy through close assault.",
		objective: "kill at least two enemy models in close combat.",
		conditions: "synched Civvies do not count, neither does firing into combat.",
		reveal: "at end of game."
	},
	{
		title: "Intimidation",
		icon: "icons/skull.png",
		color: "c81931",
		fluff: "The Civvie is a gang boss who must be shown his place.",
		objective: "kill at least one enemy model within the Civvie’s sight.",
		conditions: "the kill must be within the Civvie’s LoF.",
		reveal: "when model is killed."
	},
	{
		title: "Kill the Leader",
		icon: "icons/skull.png",
		color: "c81931",
		fluff: "Decapitate the enemy chain of command by killing the Lieutenant.",
		objective: "kill an enemy Lieutenant.",
		conditions: "any enemy Lieutenant kill during the game counts.",
		reveal: "at end of game."
	},
	{
		title: "Kill the Boffin",
		icon: "icons/skull.png",
		color: "c81931",
		fluff: "Destroy the enemy’s support infrastructure.",
		objective: "kill a Doctor, Hacker or Engineer.",
		conditions: "the kill can take place at any point during the game. If there are no specialists, count the model worth the most points.",
		reveal: "at end of game."
	},
	{
		title: "Prize Fighter",
		icon: "icons/skull.png",
		color: "c81931",
		fluff: "Demoralise the enemy by killing their most powerful unit.",
		objective: "kill the most expensive enemy model.",
		conditions: "the kill can take place at any point during the game. The target must be the model worth the most points.",
		reveal: "at end of game."
	},
	{
		title: "Hold",
		icon: "icons/block.png",
		color: "f18e37",
		fluff: "Hold the line!",
		objective: "don’t be in Retreat at the end of the game.",
		conditions: "you can be in Retreat during the game as long as you aren’t currently retreating at the end of the game. An all-Religious force will make no difference.",
		reveal: "at end of game."
	},
	{
		title: "Decimate",
		icon: "icons/block.png",
		color: "f18e37",
		fluff: "It’s only one in ten&hellip;",
		objective: "take out at least half of the enemy force.",
		conditions: "at least half the models in the enemy force must be unconscious, dead, immobilised, possessed or Sepsitorised at the end of the game.",
		reveal: "at end of game."
	},
	{
		title: "Attrition",
		icon: "icons/block.png",
		color: "f18e37",
		fluff: "Last to die wins.",
		objective: "end the game with more points on the table.",
		conditions: "at the end of the game you must control more points worth of active models than the other player.",
		reveal: "at end of game."
	},
	{
		title: "Forward Target",
		icon: "icons/block.png",
		color: "f18e37",
		objective: "sabotage one of the centreline terrain pieces with a short skill/WIP check.",
		conditions: "privately nominate the piece during deployment. Models need BtB contact and a successful WIP check at -3. This can’t be done in ARO or the first turn and the point is gained immediately.",
		reveal: "when declaring the skill."
	},
	{
		title: "Flag Kill",
		icon: "icons/qmark.png",
		color: "755ba2",
		fluff: "Destroy the enemy supply dump/communications hub.",
		objective: "destroy the enemy flag.",
		conditions: "cannot be done in the first turn. Remember that the flag starts as a camouflage marker.",
		reveal: "at end of game."
	},
	{
		title: "Capture the Flag",
		icon: "icons/qmark.png",
		color: "755ba2",
		objective: "destroy the enemy flag in close combat.",
		conditions: "cannot be done in the first turn and cannot be done if there are any enemy models in BtB contact with your own flag. Remember that the flag starts as a camouflage marker but you are allowed to charge it.",
		reveal: "at end of game."
	}
];
