
const express = require('express');
const fileUpload = require('express-fileupload');
const TextScrapper = require('./modules/TextScrapper');

const app = express();

app.use(fileUpload());
app.use('*/js', express.static(__dirname + '/src/js'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.post('/getBillAmount', (req, res) => {
	var files = req.files;

	// Checking if Bill has been uploaded
	if(files && files.bill) {
		console.log('Getting Total Amount from Bill : ' + files.bill.name);
		var billData = Buffer.from(files.bill.data).toString('utf8');
		var totalAmount = TextScrapper.getTotalAmountFromBill(billData);

		// Checking if Total Amount is a valid number
		if(!isNaN(totalAmount)) {
			console.log('Total Amount : ' + totalAmount);
			res.status(200);
			res.send('Total Amount is : ' + totalAmount);
		}
		else {
			res.status(500);		// Internal Server Error
			res.send('Oops...Something went wrong.');
		}
	}
	else {
		res.status(400);			// Bad Request
		res.send('Please upload a Bill');
	}
});

app.listen('8343', function() {
	console.log('Server listenning on port 8343 ...');
});
