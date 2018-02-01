'use strict'; 

var request = require('request');
var fs = require("fs");

exports.createXmlFile = function(req,res){
	var reqData  = req.body;
	var otp = req.body.otp;
	var mxid = req.body.mxid;

	var filename = mxid + ".xml";

	var filecontent = '<?xml version="1.0" encoding="UTF-8"?>'+
'<Response><Record timeout="10" transcribe="true" /></Response>';
	var dir = "/home/dirolabs/Documents/WS/pbschematools/public/otpdocs/"+filename;
	console.log(dir);
	console.log(mxid);
	console.log(filename);
	var writeStream = fs.createWriteStream(dir);
	writeStream.write(filecontent);
	writeStream.end();

	res.send("success");
}
