const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const issuer = require('./IdentityIssuer.js');


class CreateMonitoringWebServer {

	constructor(cardName) {
		this.cardname = cardName;
	}

	commitTransaction(address, uname, id) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.pemilu.pemilihan';
		let registryName = 'BuatMonitoringWebServer';
		let cardname = this.cardname;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("BuatMonitoringWebServer Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.monitoringWebServerId = id;
			newTransaction.alamat = address;

			return bizNetworkConnection.submitTransaction(newTransaction).then(function() {
				issuer(cardname, uname, newTransaction.monitoringWebServerId, namespace + '.MonitoringWebServer', false);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = CreateMonitoringWebServer;
