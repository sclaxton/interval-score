var readline = require('readline');
var fs = require('fs');
var interlib = require('./interval_tree');
var InterTree = interlib.tree;
var InterNode = interlib.node;
var Interval = interlib.interval;

var rl = readline.createInterface({
    input: fs.createReadStream('./input.txt'),
    // No output
    terminal: false
});

var data = [];

rl.on('line', function (line) {
	data.unshift(line);
});

rl.on('close', function () {
	console.log("data loaded!");
	main();
});

// should find a way to load input.txt and call load()
function IntervalStore() {
	this.tree = new InterTree();
}

//
// Adds many intervals to the set.
// Takes in array of strings of the form:
// "id, x, length, z"
IntervalStore.prototype.load = function(data) {
	data.forEach(function (string) {
		var inter = new Interval.apply(this, string.split(","));
		var interNode = new InterNode(inter);
		this.tree.insertNode(interNode);
	})
};

// create and add a new interval object
IntervalStore.prototype.add = function(id, x, len, z, arr) {
	var inter = new Interval(id, x, len, z);
	var interNode = new InterNode(inter);
	this.tree.insertNode(interNode);
};

// returns object with keys:
// {id, x, len, z}
// or empty object if nothing found
IntervalStore.prototype.find = function(x) {
	this.tree.findBestScore(x);
};


function main() {
	var myIntervalStore = new IntervalStore();
	myIntervalStore.load(data);

	// Test: click every hundred pixels (0, 100, 200, ... 9900)
	// Should match
	for (var i = 0; i < 100; i++) {
	    console.log("Clicking at point " + i + ": " + JSON.stringify(myIntervalStore.find(100 * i)));
	}
}
