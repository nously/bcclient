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
	if (username === "pemilih1" && password === "pemilih") {
		userLoggedIn = {
			"username": "pemilih1",
			"role": "voter",
			"cardname": "pemilih1@" + networkName
		};
	} else if (username === "bukanDyahAyu2" && password === "pemilih") {
		userLoggedIn = {
			"username": "bukanDyahAyu2",
			"role": "voter",
			"cardname": "lkjijasd@" + networkName
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
