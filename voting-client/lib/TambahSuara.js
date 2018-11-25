const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class TambahSuara {

	constructor(cardName) {
		this.cardname = cardName;
	}

	commitTransaction(nik) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.pemilu.pemilihan';
		let registryName = 'TambahSuara';
		let cardname = this.cardname;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("TambahSuara Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.pemilih = factory.newRelationship(namespace, 'Pemilih', nik);

			return bizNetworkConnection.submitTransaction(newTransaction);
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = TambahSuara;
