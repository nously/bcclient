const electron = require('electron');
const url = require('url');
const path = require('path');

const GunakanSuara = require('./lib/GunakanSuara.js');
const ReadKandidat = require('./lib/ReadKandidat.js');



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
	if (username === "bukanDyahAyu" && password === "pemilih") {
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

			if (userLoggedIn.role === "voter") {
				let readKandidat = new ReadKandidat(userLoggedIn.cardname);
				readKandidat.read().then(function(resources) {
					window.webContents.send('refresh:kandidat', resources);
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

ipcMain.on('pilih:kandidat', function(event, data){
	let gunakanSuara = new GunakanSuara(userLoggedIn.cardname);
	gunakanSuara.commitTransaction(data[0]);
});
