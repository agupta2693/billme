
var CONSTANTS = require('./../utils/Constants');

// Returns total amount of a Bill
var getTotalAmountFromBill = function(billData) {
	console.log('Starting function getTotalAmountFromBill()');

	// Two types of bill layout - Horizontal and Vertical
	var billLayout = identifyBillLayoutForTotalAmount(billData);
	var totalAmount;

	switch(billLayout) {

		case CONSTANTS.BILL_LAYOUT_HORIZONTAL : 
			totalAmount = getTotalAmountFromHorizontalLayoutBill(billData);
			break;

		case CONSTANTS.BILL_LAYOUT_VERTICAL : 
			totalAmount = getTotalAmountFromVerticalLayoutBill(billData);
			break;
	}

	return totalAmount;
}

// Return total amount of a bill that has Horizontal Layout
var getTotalAmountFromHorizontalLayoutBill = function(billData) {
	var dataLowerCase = billData.toLowerCase();
	var lines = dataLowerCase.split('\n');

	// Fetching line numbers that contains keyword 'total'
	var lineNumbersContainingTextTotal = getLineNumbersContainingText(lines, CONSTANTS.KEYWORD_TOTAL);
	var numberOfLines = lineNumbersContainingTextTotal.length;

	// We need to get the amount from the last line
	var totalLineNumber = lineNumbersContainingTextTotal[numberOfLines-1];
	var totalLine = lines[totalLineNumber];
		
	// Removing commas(,) from the line
	totalLine = totalLine.split(',').join('');
	var totalAmount = getLastAmountFromLine(totalLine);
	return totalAmount;
}

// Return total amount of a bill that has Vertical Layout
var getTotalAmountFromVerticalLayoutBill = function(billData) {
	var dataLowerCase = billData.toLowerCase();
	var lines = dataLowerCase.split('\n');

	// Fetching line numbers that contains keyword 'total'
	var lineNumbersContainingTextTotal = getLineNumbersContainingText(lines, CONSTANTS.KEYWORD_TOTAL);
	var numberOfLines = lineNumbersContainingTextTotal.length;

	// We will traverse the array in reverse order
	for(var i in lineNumbersContainingTextTotal) {
		var currentLineNumber = lineNumbersContainingTextTotal[numberOfLines-1-i];
		var currentLine = lines[currentLineNumber];
		var startingIndex = currentLine.indexOf(CONSTANTS.KEYWORD_TOTAL);

		// We need to find Amount written below the Total keyword
		var totalLine = lines[parseInt(currentLineNumber)+1];
		totalLine = totalLine.substring(startingIndex);
		var totalAmountString = totalLine.split(' ')[0];
		
		// Removing commas(,) from the line
		totalAmountString = totalAmountString.split(',').join('');
		var totalAmount = parseFloat(totalAmountString);
		if(!isNaN(totalAmount)) {
			return totalAmount;
		}
	}

	return null;
}

/*
	Function to identity bill layout :-
	1. Horizontal : Amount is mentioned in same line as keyword 'total'
	2. Vertical : Amount is mentioned below(next line) the keyword 'total'
*/
var identifyBillLayoutForTotalAmount = function(billData) {
	var dataLowerCase = billData.toLowerCase();
	var lines = dataLowerCase.split('\n');
	var layoutIsHorizontal = true;

	for(var i in lines) {
		var line = lines[i];

		if(line.includes(CONSTANTS.KEYWORD_TOTAL)) {

			var lineContainsAnAmount = false;
			var words = line.split(' ');
			for (var j in words) {
				var amount = parseFloat(words[j]);
				if(!isNaN(amount)) {
					lineContainsAnAmount = true;
					break;
				}
			}

			if(!lineContainsAnAmount) {
				layoutIsHorizontal = false;
				break;
			}
		}
	}

	if(layoutIsHorizontal)
		return CONSTANTS.BILL_LAYOUT_HORIZONTAL;
	else
		return CONSTANTS.BILL_LAYOUT_VERTICAL;
}

/*
	Function to find line number that contains a text.
	Line numbers start from 0.
*/
var getLineNumbersContainingText = function(lines, text) {
	
	var lineNumbersContainingText = [];
	
	for(var i in lines) {
		var line = lines[i];

		if(line.includes(text)) {
			lineNumbersContainingText.push(i);
		}
	}

	return lineNumbersContainingText;
}

// Returns amount next to the last occurence of word 'total'
var getLastAmountFromLine = function(line) {
	var array = line.split(' ');
	var totalAmount;

	// We will traverse the array in reverse order
	for(var i in array) {
		var text = array[array.length-1-i];
		totalAmount = parseFloat(text);
		if(!isNaN(totalAmount)) {
			return totalAmount;
		}
	}

	return totalAmount;
}


module.exports = {
	getTotalAmountFromBill : getTotalAmountFromBill
}