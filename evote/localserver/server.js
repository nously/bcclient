const http = require('http');
const url = require('url');
const fs = require('fs');
const jsdom = require('jsdom');
const { parse } = require('querystring');

const CreateMonitoringWebServer = require('./lib/CreateMonitoringWebServer.js');
const TambahKandidat = require('./lib/TambahKandidat.js');
const TambahPemilih = require('./lib/TambahPemilih.js');
const TambahSuara = require('./lib/TambahSuara.js');
const GunakanSuara = require('./lib/GunakanSuara.js');

const ReadPemilih = require('./lib/ReadPemilih.js');
const ReadKandidat = require('./lib/ReadKandidat.js');
const ReadMonitoringWebServer = require('./lib/ReadMonitoringWebServer.js');


function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(body);
        });
    }
    else {
        callback(null);
    }
}


http.createServer(function(request, response) {
	var q = url.parse(request.url, true);
	var path = q.pathname;

	switch (path) {
		case '/operator/create':
			if (request.method === 'POST') {
				collectRequestData(request, function(result) {
					result=JSON.parse(result);
					console.log(result);
					let addMWS = new CreateMonitoringWebServer(result.cardname);
					addMWS.commitTransaction(result.address, result.uname, result.id).then(function() {
						let readMWS = new ReadMonitoringWebServer(result.cardname);
						readMWS.read().then(function(resources) {
							response.setHeader('Content-Type', 'application/json');
							response.write(JSON.stringify(resources));
							response.end();
						});
					});
				});
			}
			break;
		case '/pemilih/create':
			if (request.method === 'POST') {
				collectRequestData(request, function(result) {
					result=JSON.parse(result);
					console.log(result);
					let addPemilih = new TambahPemilih(result.cardname);
					addPemilih.commitTransaction(
						result.uname,
						result.nik,
						result.nama,
						result.tempatLahir,
						result.tglLahir)
						.then(function() {
							let tambahSuara = new TambahSuara(result.cardname);
							tambahSuara.commitTransaction(result.nik);

							let readPemilih = new ReadPemilih(result.cardname);
							readPemilih.read().then(function(resources) {
								response.setHeader('Content-Type', 'application/json');
			    				response.write(JSON.stringify(resources));
								response.end();
							});
						});
				});
			}
			break;
		case '/kandidat/create':
			if (request.method === 'POST') {
				collectRequestData(request, function(result) {
					result=JSON.parse(result);
					console.log(result);
					let addKddt = new TambahKandidat(result.cardname);
					addKddt.commitTransaction(
						result.uname,
						result.id,
						result.nomor,
						result.nama,
						result.namaWakil,
						result.nik,
						result.nikWakil)
						.then(function() {
						let readKddt = new ReadKandidat(result.cardname);
						readKddt.read().then(function(resources) {
							response.setHeader('Content-Type', 'application/json');
							response.write(JSON.stringify(resources));
							response.end();
						});
					});
				});
			}
			break;
		case '/kandidat/vote':
			if (request.method === 'POST') {
				collectRequestData(request, function(result) {
					result=JSON.parse(result);
					console.log(result);
					let gunakanSuara = new GunakanSuara(result.cardname);
					gunakanSuara.commitTransaction(
						result.id)
						.then(function() {
							response.setHeader('Content-Type', 'application/json');
							response.write('{"pesan":"Hak suara berhasil digunakan"}');
							response.end();
						}).catch(function(error) {
							response.setHeader('Content-Type', 'application/json');
							response.write('{"pesan":"Mohon maaf pemilihan gagal, hak suara sudah digunakan."}');
							response.end();
						});
				});
			}
			break;
		case '/login':
			response.writeHead(200, {"Content-Type": "text/javascript"});
			response.write(script);
			response.end();
			break;
		default:
			response.write("404 Page Not Found");
			response.end();
	}
}).listen(8001);
