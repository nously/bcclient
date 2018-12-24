const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const issuer = require('./IdentityIssuer.js');

class TambahKandidat {

	constructor(cardName) {
		this.cardname = cardName;
	}

	commitTransaction(uname, id, nomor, nama, namaWakil, nik, nikWakil) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.pemilu.pemilihan';
		let registryName = 'TambahKandidat';
		let cardname = this.cardname;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("TambahKandidat Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.kandidatId = id;
			newTransaction.namaCalon = nama;
			newTransaction.namaWakilCalon = namaWakil;
			newTransaction.nikCalon = nik;
			newTransaction.nikWakilCalon = nikWakil;
			newTransaction.nomorUrut = parseInt(nomor);

			return bizNetworkConnection.submitTransaction(newTransaction).then(function() {
				issuer(cardname, uname, newTransaction.kandidatId, namespace + '.Kandidat', false);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = TambahKandidat;
