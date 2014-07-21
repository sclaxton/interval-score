// An interval object looks like this:
//	{
// 		id: unique id,    
//		low: x postion,
//		len: length 
//		zscore: z index         
//	}

// The Interval class constructor takes 
// as a string containg the comma-separated
// properties of the interval, e.g.
//
// var string = "<id>, <x position>, <length>, <z index>";

// Interval class
// constructor: string -> Interval
function Interval(id, x, len, z, arr) {
	this.id = id;
	this.low = x;
	this.len = len;
	this.zscore = z;	
}

Interval.prototype.contains = function(point){
	return this.low <= point && 
		point <= (this.low + this.len);
}

// The following implements an interval tree
// which is a red-black tree for maintaining
// a set of intervals 

// Global constants
var RED = true;
var BLACK = false;

// Interval Node class
// constructor: ? -> Node
function InterNode(inter) {
	this.parent = null
  this.right = null;
  this.left = null;
  this.key = inter.low;
  this.inter = inter;
  this.color = RED;
  this.max = inter.low + inter.len;
  this.min = inter.low;
}

InterNode.prototype.subtreeContains = function(point) {
	return this.min <= point && 
		point <= this.max;
}

function InterTree() {
  this._root = null;
  this.size = 0;
}

// returns true if inserted, false if duplicate
InterTree.prototype.insertNode = function (newNode) {
	var y = null;
	var x = this._root;
	while (x !== null){
		y = x;
		if (newNode.key < x.key){
			x = x.left;
		}
		else {
			x = x.right;
		}
	}
	newNode.parent = y;
	if (y == null){
		this._root = newNode;
	}
	else if (newNode.key < y.key){
		y.left = newNode;
	} else {
		y.right = newNode;
	}
	this._fixup(newNode);
};


InterTree.prototype._fixup = function (node) {
	while (node.parent && node.parent.parent && node.parent.color == RED) {
		var y;
		if (node.parent.parent.left && node.parent.id == node.parent.parent.left.id){
			y = node.parent.parent.right;
			// case 1
			if (y && y.color == RED) {
				node.parent.color = BLACK;
				y.color = BLACK;
				node.parent.parent.color = RED;
				node = node.parent.parent;
			} else {
				// case 2
				if (node.parent.right && node.id == node.parent.right.id) {
					node = node.parent;
					this._left_rotate(node);
				}
				// case 3
				node.parent.color = BLACK;
				node.parent.parent.color = RED;
				this._right_rotate(node.parent.parent);
			}
		} else {
			y = node.parent.parent.left;
			// case 1
			if (y && y.color == RED) {
				node.parent.color = BLACK;
				y.color = BLACK;
				node.parent.parent.color = RED;
				node = node.parent.parent;
			} else {
				// case 2
				if (node.parent.left && node.id == node.parent.left.id) {
					node = node.parent;
					this._right_rotate(node);
				}
				// case 3
				node.parent.color = BLACK;
				node.parent.parent.color = RED;
				this._left_rotate(node.parent.parent);
			}
		}
	}
	this._root.color = BLACK;
};

InterTree.prototype._left_rotate = function (node) {
	var a = node.left;
	var y = node.right;
	var b = y ? y.left : null;    
  node.right = y.left;
  if (y.left !== null) y.left.parent = node;
  y.parent = node.parent;
  if (node.parent === null) {
  	this._root = y;
  } else {
    if (node.parent.left && node.id === node.parent.left.id) {
     	node.parent.left = y;
   	} else {
    	node.parent.right = y;
		}
	}
  y.left = node;
  node.parent = y;
  y.max = node.max;
  var max_a = a ? a.max : 0;
  var max_b = b ? b.max : 0;
  var min_b = b ? b.min : 0;
  node.max = Math.max(max_a, max_b, node.inter.low + node.inter.len);
  y.min = node.min;
};

InterTree.prototype._right_rotate = function (node) {
	var a = node.right;
	var y = node.left;
	var b = y ? y.right : null;
  node.left = y.right;   
  if (y.right !== null) y.right.parent = node; 
  y.parent = node.parent;
  if (node.parent === null) {
  	this._root = y;
  } else {
    if (node.parent.left && node.id === node.parent.left.id) {
     	node.parent.left = y;
   	} else if (node.parent.right) {
    	node.parent.right = y;
		}
	}
  y.right = node;
  node.parent = y;
  y.max = node.max;
  var max_a = a ? a.max : 0;
  var max_b = b ? b.max : 0;
  var min_b = b ? b.min : 0;
  node.max = Math.max(max_a, max_b, node.inter.low + node.inter.len);
  node.min = min_b;
};

InterTree.prototype.findBestScore = function (point) {
	bestScoreHelper(point, this._root, null);
}

function bestScoreHelper (point, curNode, best){
	if (curNode === null) return best;
	if(curNode.inter.contains(point)){
		if (best.inter.zscore < curNode.inter.zscore) {
			best = curNode;
		}
	}
	if (curNode.left.subtreeContains(point)){
		bestScoreHelper(point, curNode.left, best);
	}
	if (curNode.right.subtreeContains(point)){
		bestScoreHelper(point, curNode.right, best);
	}
};

InterTree.prototype.prettyPrint = function() {
	console.log(printHelper(this._root) + "\n");
}

function printHelper(curNode) {
	if (curNode){
		return "{ " + curNode.inter.id + ": " + "{ left: " + printHelper(curNode.left) + ", right: " + printHelper(curNode.right) +  " }" + " }";
	} else {
		return "null";
	}
}

var testArray = [ "0,571046,85,311",
									"1,946233,69,916",
									"2,678485,44,936",
									"3,577960,42,267",
									"4,669143,34,286",
									"5,293435,40,25", 
									"6,745762,90,737",
									"7,315183,57,53",
									"8,129500,25,535",
									"9,427357,84,938",
									"10,764923,18,472",
									"11,233523,90,917",
									"12,641346,65,508",
									"13,765729,91,438",
									"14,246303,64,127",
									"15,95595,10,84",
									"16,435966,56,543",
									"17,531152,39,634",
									"18,135221,6,31", ];

function test_run(){
	var tree = new InterTree();
	testArray.forEach(function(string){
		var inter = new Interval.bind.apply();
		console.log(inter.id);
		var interNode = new InterNode(inter);
		tree.insertNode(interNode);
		tree.prettyPrint();
	});
}

module.exports = { tree: InterTree, node: InterNode, interval: Interval };
