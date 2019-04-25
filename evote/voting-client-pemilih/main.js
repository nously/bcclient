const electron = require('electron');
const url = require('url');
const path = require('path');
const axios = require('axios');

const ReadKandidat = require('./lib/ReadKandidat.js');
const GunakanSuara = require('./lib/GunakanSuara.js');

const {
	app,
	BrowserWindow,
	ipcMain,
	dialog
} = electron;

let window;
let userLoggedIn;
let networkName = "evote-network";
var localserver = "http://localserver:8001";

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

ipcMain.on('pilih:kandidat', function(event, data){
	axios.post(localserver + '/kandidat/vote', {
		cardname: userLoggedIn.cardname,
		id: data[0]
	}, {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	}).then(function(response) {
		console.log(dialog.showMessageBox({
			type: 'info',
			title: 'Perhatian',
			message: response.data.pesan,
			buttons: ["OK"]
		}));
	});
});
