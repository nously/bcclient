const electron = require('electron');
const {
	ipcRenderer
} = electron;

let username;

var logoutBtn = document.getElementById('logout-btn');
var hasilList = document.getElementById('hasil-list')

ipcRenderer.on('login', function(e, userLoggedIn) {
	username = userLoggedIn.username;
});

logoutBtn.addEventListener('click', function(event) {
	ipcRenderer.send('logout', null);
});

ipcRenderer.on('refresh:monitor', function(event, resources) {
	hasilList.innerHTML = "";
	for (let i = 0; i < resources.length; i++) {
		hasilList.innerHTML += `<tr>
			<td>${resources[i].nomorUrut}</td>
			<td>${resources[i].namaCalon}</td>
			<td>${resources[i].namaWakilCalon}</td>
			<td>${resources[i].jumlahSuara}</td>
		</tr>`;
	}
});
