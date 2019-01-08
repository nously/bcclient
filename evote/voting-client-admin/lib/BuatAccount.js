const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const issuer = require('./IdentityIssuer.js');

class BuatAccount {

	constructor(cardName) {
		this.cardname = cardName;
	}

	commitTransaction(uname, id, password, cardName, role) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.evote.pemilihan';
		let registryName = 'BuatAccount';
		let cardname = this.cardname;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("TambahPemilih Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.accountId = id;
			newTransaction.username = uname;
			newTransaction.password = password;
			newTransaction.cardName = cardName;
			newTransaction.role = role;

			return bizNetworkConnection.submitTransaction(newTransaction);
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = BuatAccount;
