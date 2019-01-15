const electron = require('electron');
const url = require('url');
const path = require('path');
const axios = require('axios');

const CreateMonitoringWebServer = require('./lib/CreateMonitoringWebServer.js');
const TambahKandidat = require('./lib/TambahKandidat.js');
const TambahPemilih = require('./lib/TambahPemilih.js');
const TambahSuara = require('./lib/TambahSuara.js');

const ReadPemilih = require('./lib/ReadPemilih.js');
const ReadKandidat = require('./lib/ReadKandidat.js');
const ReadMonitoringWebServer = require('./lib/ReadMonitoringWebServer.js');


const {
	app,
	BrowserWindow,
	ipcMain
} = electron;

let window;
let userLoggedIn;
let networkName = "evote-network";
var localserver = "http://localhost:8001";

app.on('ready', function() {
	window = new BrowserWindow({});

	window.loadURL(url.format({
		pathname: path.join(__dirname, 'login', 'login.html'),
		protocol: 'file:',
		slashes: true
	}));

	window.setFullScreen(true);
});

ipcMain.on('login', function(event, userIdentity) {
	let username = userIdentity.username;
	let password = userIdentity.password;

	axios.post(localserver + '/login', {
		username: userIdentity.username,
		password: userIdentity.password
	}, {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).then(function(response) {
		userLoggedIn = response.data.userData;

		if (userLoggedIn !== null) {
			window.loadURL(url.format({
				pathname: path.join(__dirname, userLoggedIn.role, 'home.html'),
				protocol: 'file:',
				slashes: true
			}));
	
			window.webContents.once('dom-ready', () => {
				window.webContents.send('refresh:kandidat', response.data.kandidatData);
				window.webContents.send('refresh:pemilih', response.data.pemilihData);
				window.webContents.send('refresh:monitoringWebServer', response.data.operatorData);
			});
		}
	});
});

ipcMain.on('logout', function(event, x) {
	userLoggedIn = null;
	window.loadURL(url.format({
		pathname: path.join(__dirname, 'login', 'login.html'),
		protocol: 'file:',
		slashes: true
	}));
});

ipcMain.on('add:monitoringWebServer', function(event, data) {
	axios.post(localserver + '/operator/create', {
		cardname: userLoggedIn.cardname,
		address: data[0],
		uname: data[1],
		id: data[2]
	}, {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).then(function(response) {
		window.webContents.send('refresh:monitoringWebServer', response.data);
	});
});

ipcMain.on('add:kandidat', function(event, data) {
	axios.post(localserver + '/kandidat/create', {
		cardname: userLoggedIn.cardname,
		uname: data[0],
		id: data[1],
		nomor: data[2],
		nama: data[3],
		namaWakil: data[4],
		nik: data[5],
		nikWakil: data[6]
	}, {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).then(function(response) {
		window.webContents.send('refresh:kandidat', response.data);
	});
});

ipcMain.on('add:pemilih', function(event, data) {
	axios.post(localserver + '/pemilih/create', {
		cardname: userLoggedIn.cardname,
		uname: data[0],
		password: data[5],
		nik: data[1],
		nama: data[2],
		tempatLahir: data[3],
		tglLahir: data[4]
	}, {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).then(function(response) {
		window.webContents.send('refresh:pemilih', response.data);
	});
});
