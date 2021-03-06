const electron = require('electron');
const url = require('url');
const path = require('path');

const CreateMonitoringWebServer = require('./lib/CreateMonitoringWebServer.js');
const AddVotingOrganizer = require('./lib/AddVotingOrganizer.js');
const TambahKandidat = require('./lib/TambahKandidat.js');
const TambahPemilih = require('./lib/TambahPemilih.js');
const TambahSuara = require('./lib/TambahSuara.js');
const GunakanSuara = require('./lib/GunakanSuara.js');

const ReadHasilSuara = require('./lib/ReadHasilSuara.js');
const ReadPemilih = require('./lib/ReadPemilih.js');
const ReadKandidat = require('./lib/ReadKandidat.js');
const ReadMonitoringWebServer = require('./lib/ReadMonitoringWebServer.js');
const ReadVotingOrganizer = require('./lib/ReadVotingOrganizer.js');


const {
	app,
	BrowserWindow,
	ipcMain
} = electron;

let window;
let userLoggedIn;
let networkName = "pemilu-network";

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
	if (username === "dyahayu" && password === "organizer") {
		userLoggedIn = {
			"username": "dyahayu",
			"role": "organizer",
			"cardname": "dyahayu@" + networkName
		};
	} else if (username === "bukanDyahAyu" && password === "pemilih") {
		userLoggedIn = {
			"username": "bukanDyahAyu",
			"role": "voter",
			"cardname": "bukanDyahAyu@" + networkName
		};
	} else if (username === "bukanDyahAyu2" && password === "pemilih") {
		userLoggedIn = {
			"username": "bukanDyahAyu2",
			"role": "voter",
			"cardname": "bukanDyahAyu2@" + networkName
		};
	} else if (username === "bob" && password === "admin") {
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
	} else if (username === "monitoring1" && password === "monitor") {
		userLoggedIn = {
			"username": "monitoring1",
			"role": "monitor",
			"cardname": "monitoring1@" + networkName
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
			} else if (userLoggedIn.role === "organizer") {
				let readKandidat = new ReadKandidat(userLoggedIn.cardname);
				readKandidat.read().then(function(resources) {
					window.webContents.send('refresh:kandidat', resources);
					let readPemilih = new ReadPemilih(userLoggedIn.cardname);
					readPemilih.read().then(function(resources) {
						window.webContents.send('refresh:pemilih', resources);
					});
				});
			} else if (userLoggedIn.role === "voter") {
				let readKandidat = new ReadKandidat(userLoggedIn.cardname);
				readKandidat.read().then(function(resources) {
					window.webContents.send('refresh:kandidat', resources);
				});
			} else if (userLoggedIn.role === "monitor") {
				let readHasilSuara = new ReadHasilSuara(userLoggedIn.cardname);
				readHasilSuara.read().then(function(resources) {
					window.webContents.send('refresh:monitor', resources);
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

ipcMain.on('add:votingOrganizer', function(event, data) {
	let addVO = new AddVotingOrganizer(userLoggedIn.cardname);
	addVO.commitTransaction(data[0], data[1], data[2]).then(function() {
		let readVO = new ReadVotingOrganizer(userLoggedIn.cardname);
		readVO.read().then(function(resources) {
			window.webContents.send('refresh:votingOrganizer', resources);
		});
	});
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

ipcMain.on('pilih:kandidat', function(event, data){
	let gunakanSuara = new GunakanSuara(userLoggedIn.cardname);
	gunakanSuara.commitTransaction(data[0]);
});
