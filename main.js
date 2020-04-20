const fs = require("fs");
const bencode = require("bencode");
const url = require("url");
const http = require("http");
const crypto = require("crypto");
const hex2ascii = require("hex2ascii");
const querystring = require("querystring");
const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const message = Buffer.from("hello", "utf-8");

fs.readFile("music.torrent", (err, data) => {
    const torrent = bencode.decode(data);
    const tracker = url.parse(torrent.announce.toString('utf8'));
    const info_hash = crypto.createHash('sha1').update(bencode.encode(torrent.info)).digest();
    const peer_id = Buffer.from('-NT0001-');
    var peer;
    

    if (tracker.protocol == "http:") {
        console.log("http protocol");

        const options = {
            hostname: tracker.hostname,
            port: tracker.port,
            path: tracker.path
            + '?info_hash=' + escape(hex2ascii(info_hash.toString('hex'))) 
            + '&peer_id=' + escape(peer_id + hex2ascii(crypto.randomBytes(12).toString('hex')))
            + '&port=6881',
            method: 'GET'
        }
          
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
          
            res.on('data', d => {
                process.stdout.write(d);
                peer = d;
            });
        });
          
        req.on('error', error => {
            console.error(error);
        });
        
        console.log(bencode.decode(peer));

        req.end();
    }
    else if (torrent.protocol = "udp:") {
        console.log("udp protocol");
        client.send(message, 0, message.length, tracker.port, tracker.hostname, (err, bytes) => {
            if (err) throw err;
        });

        client.on('msg', (msg) => {
            console.log(msg);
        });
    }
    else {
        console.log("알 수 없는 프로토콜 (Unknown Protocol");
    }
});