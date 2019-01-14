const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class GunakankanSuara {

	constructor(cardName) {
		this.cardname = cardName;
	}

	commitTransaction(idKandidat) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.evote.pemilihan';
		let registryName = 'GunakanSuara';
		let cardname = this.cardname;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("GunakankanSuara Connected Successfully!!!");
			return bizNetworkConnection.getAssetRegistry(namespace + '.Suara').then(function(registry) {
				return registry.resolveAll().then(function(resourceCollection) {
					const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
					let newTransaction = factory.newTransaction(namespace, registryName);
					newTransaction.kandidat = factory.newRelationship(namespace, 'Kandidat', idKandidat);
					newTransaction.suara = factory.newRelationship(namespace, 'Suara', resourceCollection[0].suaraId);

					return bizNetworkConnection.submitTransaction(newTransaction);
				});
			});
		});
	}
}
module.exports = GunakankanSuara;
