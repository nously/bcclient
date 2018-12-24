const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
	event.preventDefault();
	const username = document.querySelector('#username').value;
	const password = document.querySelector('#password').value;
	ipcRenderer.send('login', {'username': username, 'password': password});
});

ipcRenderer.on('login', function(e, item) {
	console.log("sdasdads");
});
