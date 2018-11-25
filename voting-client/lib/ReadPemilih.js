'use strict'
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class ReadPemilih {

	constructor(cardName) {
		this.cardname = cardName;
	}

	read() {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.pemilu.pemilihan';
		let registryName = 'Pemilih';
		let resources = [];

		return bizNetworkConnection.connect(this.cardname).then(function() {
			console.log("Connected Successfully!!!");
			return bizNetworkConnection.getParticipantRegistry(namespace + '.' + registryName).then(function(registry) {
				return registry.resolveAll().then(function(resourceCollection) {
					for (let i = 0; i < resourceCollection.length; i++) {
						resources.push({
							"nomor": i + 1,
							"nik": resourceCollection[i].nik,
							"nama": resourceCollection[i].nama,
							"tempatLahir": resourceCollection[i].tempatLahir,
							"tanggalLahir": resourceCollection[i].tanggalLahir,
						});
					}
					return resources;
				});

			}).catch(function(error) {
				console.log(error);
			});
		}).catch((error) => {
			console.log(error);
		});
		console.log(resources);
	}
}
module.exports = ReadPemilih;
