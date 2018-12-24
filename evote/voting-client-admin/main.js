const electron = require('electron');
const url = require('url');
const path = require('path');

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
	if (username === "bob" && password === "admin") {
		userLoggedIn = {
			"username": "bob",
			"role": "admin",
			"cardname": "bob@" + networkName
		};
	} else if (username === "alice" && password === "admin") {
		userLoggedIn = {
			"username": "alice",
			"role": "admin",
			"cardname": "alice@" + networkName
		};
	} else {
		userLoggedIn = null;
	}

	if (userLoggedIn !== null) {
		window.loadURL(url.format({
			pathname: path.join(__dirname, userLoggedIn.role, 'home.html'),
			protocol: 'file:',
			slashes: true
		}));

		window.webContents.once('dom-ready', () => {
			window.webContents.send('login', userLoggedIn);

			if (userLoggedIn.role === "admin") {
				let readMWS = new ReadMonitoringWebServer(userLoggedIn.cardname);
				readMWS.read().then(function(resources) {
					window.webContents.send('refresh:monitoringWebServer', resources);
					let readVO = new ReadVotingOrganizer(userLoggedIn.cardname);
					readVO.read().then(function(resources) {
						window.webContents.send('refresh:votingOrganizer', resources);
					});
				});
			}
		});
	}
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
	let addMWS = new CreateMonitoringWebServer(userLoggedIn.cardname);
	addMWS.commitTransaction(data[0], data[1], data[2]).then(function() {
		let readMWS = new ReadMonitoringWebServer(userLoggedIn.cardname);
		readMWS.read().then(function(resources) {
			window.webContents.send('refresh:monitoringWebServer', resources);
		});
	});
});

ipcMain.on('add:kandidat', function(event, data) {
	let addKddt = new TambahKandidat(userLoggedIn.cardname);
	addKddt.commitTransaction(data[0], data[1], data[2], data[3], data[4], data[5], data[6]).then(function() {
		let readKddt = new ReadKandidat(userLoggedIn.cardname);
		readKddt.read().then(function(resources) {
			window.webContents.send('refresh:kandidat', resources);
		});
	});
});

ipcMain.on('add:pemilih', function(event, data) {
	let addPemilih = new TambahPemilih(userLoggedIn.cardname);
	addPemilih.commitTransaction(data[0], data[1], data[2], data[3], data[4]).then(function() {
		let tambahSuara = new TambahSuara(userLoggedIn.cardname);
		tambahSuara.commitTransaction(data[1]);

		let readPemilih = new ReadPemilih(userLoggedIn.cardname);
		readPemilih.read().then(function(resources) {
			window.webContents.send('refresh:pemilih', resources);
		});
	});
});
