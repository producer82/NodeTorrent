const fs = require("fs");
const bencode = require("bencode");
const url = require("url");
const dgram = require("dgram");
const http = require("http");
const client = dgram.createSocket("udp4");

const message = Buffer.from("hello", "utf-8");

fs.readFile("music.torrent", (err, data) => {
    torrent = bencode.decode(data);
    tracker = url.parse(torrent.announce.toString('utf8'));

    console.log(torrent.info.filehash.toString('hex'));

    const options = {
        hostname: tracker.hostname,
        port: tracker.port,
        path: '?' + tracker.path + '=' + torrent.info.filehash.toString('hex'),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': message.length
        }
    }

    if (tracker.protocol == "http:") {
        console.log("http protocol");
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
          
            res.on('data', d => {
                console.log(d);
            });
        });
          
        req.on('error', err => {
            console.error(err);
        });
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


