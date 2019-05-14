const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const ReadKandidat = require('./ReadKandidat.js');

const url = require('url');
const path = require('path');


class GetBusinessCardName {

	constructor(cardName) {
		this.cardname = cardName;
		this.bizNetworkConnection = new BusinessNetworkConnection();
	}

	commitTransaction(username, password) {
		let bizNetworkConnection = this.bizNetworkConnection;
		let namespace = 'org.evote.pemilihan';
		let registryName = 'GetBusinessCardName';
		let cardname = this.cardname;

		bizNetworkConnection.connect(cardname).then(function() {
			console.log("BuatMonitoringWebServer Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.username = username;
			newTransaction.password = password;
			bizNetworkConnection.submitTransaction(newTransaction);
		}).catch((error) => {
			console.log(error);
		});
	}

	listen(window, userLoggedIn) {
		let bizNetworkConnection = this.bizNetworkConnection;
		let cardname = this.cardname;

		bizNetworkConnection.connect(cardname).then(function() {
			console.log("LISTEEEN!");
			bizNetworkConnection.on('event', (event) => {
				console.log(JSON.stringify(event));
				userLoggedIn = {
					"username": event.username,
					"role": event.role,
					"cardname": event.businessCardName
				}

				window.loadURL(url.format({
					pathname: __dirname + "/../voter/home.html",
					protocol: 'file:',
					slashes: true
				}));

				window.webContents.once('dom-ready', () => {
					window.webContents.send('login:success', userLoggedIn);
					if (userLoggedIn.role === "voter") {
						let readKandidat = new ReadKandidat(userLoggedIn.cardname);
						readKandidat.read().then(function(resources) {
							window.webContents.send('refresh:kandidat', resources);
						});
					}
				});
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = GetBusinessCardName;