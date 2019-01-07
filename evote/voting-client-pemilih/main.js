const electron = require('electron');
const url = require('url');
const path = require('path');

const GetBusinessCardName = require('./lib/GetBusinessCardName.js');

const GunakanSuara = require('./lib/GunakanSuara.js');
const ReadKandidat = require('./lib/ReadKandidat.js');

const {
	app,
	BrowserWindow,
	ipcMain
} = electron;

let window;
var userLoggedIn;
let networkName = "evote-network";
let getBusinessCardName = new GetBusinessCardName("guest@evote-network");

app.on('ready', function() {
	window = new BrowserWindow({});

	window.loadURL(url.format({
		pathname: path.join(__dirname, 'login', 'login.html'),
		protocol: 'file:',
		slashes: true
	}));

	getBusinessCardName.listen(window, userLoggedIn);
	window.setFullScreen(true);
});

ipcMain.on('login', function(event, userIdentity) {
	let username = userIdentity.username;
	let password = userIdentity.password;

	getBusinessCardName.commitTransaction(username, password);
});

ipcMain.on('login:dataTransfer', function(event, userData) {
	userLoggedIn = userData;
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
	let gunakanSuara = new GunakanSuara(userLoggedIn.cardname);
	gunakanSuara.commitTransaction(data[0]);
});
