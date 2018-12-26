const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class TambahSuara {

	constructor(cardName) {
		this.cardname = cardName;
		TambahSuara.number = 0;
	}

	commitTransaction(nik) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.evote.pemilihan';
		let registryName = 'TambahSuara';
		let cardname = this.cardname;
		var number = TambahSuara.number;
		TambahSuara.number = TambahSuara.number + 1;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("TambahSuara Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.pemilih = factory.newRelationship(namespace, 'Pemilih', nik);
			newTransaction.x = nik + number;

			return bizNetworkConnection.submitTransaction(newTransaction);
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = TambahSuara;
