const electron = require('electron');
const {
	ipcRenderer
} = electron;

let username;

var kandidatList = document.getElementById('kandidat-list');

var pilihKandidat = document.querySelector('#pilih-modal form');
var modal = document.getElementById('pilih-modal');
var btn = document.getElementById("masukkan-pilihan");
var span = document.getElementsByClassName("close")[0];

var logoutBtn = document.getElementById('logout-btn');

ipcRenderer.on('login:success', function(e, userLoggedIn) {
	console.log(userLoggedIn);
	ipcRenderer.send('login:dataTransfer', userLoggedIn);
});

btn.onclick = function() {
	modal.style.display = "block";
}

span.onclick = function() {
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

pilihKandidat.addEventListener('submit', function(event) {
	event.preventDefault();
	let id = document.querySelector('#idKandidat').value;

	let data = [id];
	ipcRenderer.send('pilih:kandidat', data);
	modal.style.display = "none";
});

logoutBtn.addEventListener('click', function(event) {
	ipcRenderer.send('logout', null);
});

ipcRenderer.on('refresh:kandidat', function(event, resources) {
	kandidatList.innerHTML = "";
	for (let i = 0; i < resources.length; i++) {
		kandidatList.innerHTML += `<tr>
			<td>${resources[i].nomor}</td>
			<td>${resources[i].ID}</td>
			<td>${resources[i].nama}</td>
			<td>${resources[i].namaWakil}</td>
			<td>${resources[i].nik}</td>
			<td>${resources[i].nikWakil}</td>
		</tr>`;
	}
});
