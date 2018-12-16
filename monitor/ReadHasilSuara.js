const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class ReadHasilSuara {

	constructor(cardName) {
		this.cardname = cardName;
	}

	read() {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let resources = [];

		return bizNetworkConnection.connect(this.cardname).then(function() {
			console.log("Connected Successfully!!!");
			return bizNetworkConnection.getAssetRegistry('org.pemilu.pemilihan.Suara').then(function(suaraRegistry) {
					return suaraRegistry.resolveAll().then(function(resourceCollection) {
						return bizNetworkConnection.getParticipantRegistry('org.pemilu.pemilihan.Kandidat').then(async function(kandidatRegistry) {
							for (let i = 0; i < resourceCollection.length; i++) {
								let kandidatId = resourceCollection[i].owner.kandidatId;
								var kandidat = await kandidatRegistry.get(kandidatId);

								if (resources.length > 0) {
									for (let j = 0; j < resources.length; j++) {
										if (resources[j].namaCalon === kandidat.namaCalon ||
											resources[j].namaWakilCalon === kandidat.namaWakilCalon ||
											resources[j].nomorUrut === kandidat.nomorUrut) {

											resources[j].jumlahSuara = resources.jumlahSuara + 1;
										} else if (j === resources.length - 1) {
											resources.push({
												"namaCalon": kandidat.namaCalon,
												"namaWakilCalon": kandidat.namaWakilCalon,
												"nomorUrut": kandidat.nomorUrut,
												"jumlahSuara": 1
											});
										}
									}
								} else {
									resources.push({
										"namaCalon": kandidat.namaCalon,
										"namaWakilCalon": kandidat.namaWakilCalon,
										"nomorUrut": kandidat.nomorUrut,
										"jumlahSuara": 1
									});
								}
							}
							return resources;
						});
					});
				})
				.catch(function(error) {
					console.error(error);
				});
		}).catch((error) => {
			console.log(error);
		});
		console.log(resources);
	}
}
module.exports = ReadHasilSuara;
