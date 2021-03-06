const electron = require('electron');
const {
	ipcRenderer
} = electron;

let username;

var kandidatList = document.getElementById('kandidat-list');
var pemilihList = document.getElementById('pemilih-list');

var addPemilihForm = document.querySelector('#addPemilih-modal form');
var modalPemilih = document.getElementById('addPemilih-modal');
var btnPemilih = document.getElementById("addPemilih-button");
var spanPemilih = document.getElementsByClassName("close")[1];

var addKddtForm = document.querySelector('#addKddt-modal form');
var modal = document.getElementById('addKddt-modal');
var btn = document.getElementById("addKddt-button");
var span = document.getElementsByClassName("close")[0];

var logoutBtn = document.getElementById('logout-btn');

ipcRenderer.on('login', function(e, userLoggedIn) {
	username = userLoggedIn.username;
});

btn.onclick = function() {
	modal.style.display = "block";
}

span.onclick = function() {
	modal.style.display = "none";
}

spanPemilih.onclick = function() {
	modalPemilih.style.display = "none";
}

btnPemilih.onclick = function() {
	modalPemilih.style.display = "block";
}

window.onclick = function(event) {
	if (event.target == modal || event.target == modalPemilih) {
		modal.style.display = "none";
		modalPemilih.style.display = "none";
	}
}

addKddtForm.addEventListener('submit', function(event) {
	event.preventDefault();
	let uname = document.querySelector('#unameKddt').value;
	let id = document.querySelector('#IDKddt').value;
	let nomor = document.querySelector('#nomortKddt').value;
	let nama = document.querySelector('#namaKddt').value;
	let namaWakil = document.querySelector('#namaWakilKddt').value;
	let nik = document.querySelector('#nikKddt').value;
	let nikWakil = document.querySelector('#nikWakilKddt').value;

	let data = [uname, id, nomor, nama, namaWakil, nik, nikWakil];
	ipcRenderer.send('add:kandidat', data);
	modal.style.display = "none";
});

addPemilihForm.addEventListener('submit', function(event) {
	event.preventDefault();
	let uname = document.querySelector('#unamePemilih').value;
	let nik = document.querySelector('#nikPemilih').value;
	let nama = document.querySelector('#namaPemilih').value;
	let tempatLahir = document.querySelector('#tempatLahirPemilih').value;
	let tglLahir = document.querySelector('#tglLahirPemilih').value;

	let data = [uname, nik, nama, tempatLahir, tglLahir];
	ipcRenderer.send('add:pemilih', data);
	modalPemilih.style.display = "none";
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

ipcRenderer.on('refresh:pemilih', function(event, resources) {
	pemilihList.innerHTML = "";
	for (let i = 0; i < resources.length; i++) {
		pemilihList.innerHTML += `<tr>
			<td>${resources[i].nomor}</td>
			<td>${resources[i].nik}</td>
			<td>${resources[i].nama}</td>
			<td>${resources[i].tempatLahir}</td>
			<td>${resources[i].tanggalLahir}</td>
		</tr>`;
	}
});

logoutBtn.addEventListener('click', function(event) {
	ipcRenderer.send('logout', null);
});
