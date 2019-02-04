const http = require('http');
const url = require('url');
const fs = require('fs');
const jsdom = require('jsdom');
const readline = require('readline');
const ReadHasilSuara = require('./ReadHasilSuara');

var rl = readline.createInterface(process.stdin, process.stdout);

var top;
var bottom;
var css;
var script;

var readHasilSuara;
var card;

rl.setPrompt('Masukkan nama business network card: ');
rl.prompt();
rl.on('line', function(line) {
	rl.close();
	readHasilSuara = new ReadHasilSuara(line);
});

fs.readFile('./top.html', function(err, data) { top = data; });
fs.readFile('./bottom.html', function(err, data) { bottom = data; });
fs.readFile('./style.css', function(err, data) { css = data; });
fs.readFile('./script.js', function(err, data) { script = data; });

http.createServer(function(request, response) {
	var q = url.parse(request.url, true);
	var filename = '.' + q.pathname;
	if (filename === './') {
		filename = './index.html';
	}

	switch (filename) {
		case './index.html':
			readHasilSuara.listen(response, top, bottom).then(function(){
				readHasilSuara.commitTransaction();
			});
			break;
		case './hasil.html':
			response.writeHead(200, {"Content-Type": "text/css"});
			response.write(top + bottom);
			response.end();
			break;
		case './style.css':
			response.writeHead(200, {"Content-Type": "text/css"});
			response.write(css);
			response.end();
			break;
		case './script.js':
			response.writeHead(200, {"Content-Type": "text/javascript"});
			response.write(script);
			response.end();
			break;
		default:
			response.write("404 Page Not Found");
			response.end();
	}
}).listen(8000);
