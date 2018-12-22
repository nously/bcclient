const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const issuer = require('./IdentityIssuer.js');

class AddVotingOrganizer {

	constructor(cardName) {
		this.cardname = cardName;
	}

	commitTransaction(name, uname, id) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.pemilu.pemilihan';
		let registryName = 'TambahVotingOrganizer';
		let cardname = this.cardname;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("TambahVotingOrganizer Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.votingOrganizerId = id;
			newTransaction.nama = name;

			return bizNetworkConnection.submitTransaction(newTransaction).then(function() {
				issuer(cardname, uname, newTransaction.votingOrganizerId, namespace + '.VotingOrganizer', true);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = AddVotingOrganizer;
