const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const issuer = require('./IdentityIssuer.js');

class TambahPemilih {

	constructor(cardName) {
		this.cardname = cardName;
	}

	commitTransaction(uname, nik, nama, tempatLahir, tanggalLahir) {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.evote.pemilihan';
		let registryName = 'TambahPemilih';
		let cardname = this.cardname;

		return bizNetworkConnection.connect(cardname).then(function() {
			console.log("TambahPemilih Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);
			newTransaction.nik = nik;
			newTransaction.nama = nama;
			newTransaction.tempatLahir = tempatLahir;
			var date = tanggalLahir.split('-');
			newTransaction.tanggalLahir = new Date(date[0], date[1]-1, date[2]);

			return bizNetworkConnection.submitTransaction(newTransaction).then(function() {
				issuer(cardname, uname, newTransaction.nik, namespace + '.Pemilih', false);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}
module.exports = TambahPemilih;
