const electron = require('electron');
const {
	ipcRenderer
} = electron;

let username;

var organizerList = document.getElementById('organizer-list');
var monitorList = document.getElementById('monitor-list');

var addVOForm = document.querySelector('#addVO-modal form');
var modal = document.getElementById('addVO-modal');
var btn = document.getElementById("addVO-button");
var span = document.getElementsByClassName("close")[0];

var addMWSForm = document.querySelector('#addMWS-modal form');
var modalMWS = document.getElementById('addMWS-modal');
var btnMWS = document.getElementById("addMWS-button");
var spanMWS = document.getElementsByClassName("close")[1];

var logoutBtn = document.getElementById('logout-btn');

ipcRenderer.on('login', function(e, userLoggedIn) {
	username = userLoggedIn.username;
});

btn.onclick = function() {
	modal.style.display = "block";
}

span.onclick = function() {
	var addVOForm = document.querySelector('#addVO-modal form');
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target == modal || event.target == modalMWS) {
		modal.style.display = "none";
		modalMWS.style.display = "none";
	}
}

btnMWS.onclick = function() {
	modalMWS.style.display = "block";
}

spanMWS.onclick = function() {
	var addMWSForm = document.querySelector('#addMWS-modal form');
	modalMWS.style.display = "none";
}

addVOForm.addEventListener('submit', function(event) {
	event.preventDefault();
	let name = document.querySelector('#namaVo').value;
	let uname = document.querySelector('#unameVo').value;
	let id = document.querySelector('#IDVo').value;
	let data = [name, uname, id];
	ipcRenderer.send('add:votingOrganizer', data);
	modal.style.display = "none";
});

addMWSForm.addEventListener('submit', function(event) {
	event.preventDefault();
	let address = document.querySelector('#alamatMWS').value;
	let uname = document.querySelector('#unameMWS').value;
	let id = document.querySelector('#IDMWS').value;
	let data = [address, uname, id];
	ipcRenderer.send('add:monitoringWebServer', data);
	modalMWS.style.display = "none";
});

ipcRenderer.on('refresh:votingOrganizer', function(event, resources) {
	organizerList.innerHTML = "";
	for (let i = 0; i < resources.length; i++) {
		organizerList.innerHTML += `<tr>
			<td>${resources[i].i + 1}</td>
			<td>${resources[i].votingOrganizerId}</td>
			<td>${resources[i].nama}</td>
		</tr>`;
	}
});

ipcRenderer.on('refresh:monitoringWebServer', function(event, resources) {
	monitorList.innerHTML = "";
	for (let i = 0; i < resources.length; i++) {
		monitorList.innerHTML += `<tr>
			<td>${resources[i].i + 1}</td>
			<td>${resources[i].monitoringWebServerId}</td>
			<td>${resources[i].alamat}</td>
		</tr>`;
	}
});

logoutBtn.addEventListener('click', function(event) {
	ipcRenderer.send('logout', null);
});
