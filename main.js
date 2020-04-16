const fs = require("fs");
const bencode = require("bencode");
const urlParse = require("url");
const dgram = require("dgram");
const client = dgram.createSocket("udp4");

fs.readFile("test.torrent", (err, data) => {
	
});


