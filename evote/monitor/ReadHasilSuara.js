const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const https = require('https');


class ReadHasilSuara {

	constructor(cardName) {
		this.cardname = cardName;
		this.bizNetworkConnection = new BusinessNetworkConnection();
	}

	commitTransaction() {
		let bizNetworkConnection = this.bizNetworkConnection;
		let namespace = 'org.evote.pemilihan';
		let registryName = 'BacaHasilPemilihan';
		let cardname = this.cardname;

		bizNetworkConnection.connect(cardname).then(function() {
			console.log("BuatMonitoringWebServer Connected Successfully!!!");
			const factory = bizNetworkConnection.getBusinessNetwork().getFactory();
			let newTransaction = factory.newTransaction(namespace, registryName);

			bizNetworkConnection.submitTransaction(newTransaction);
		}).catch((error) => {
			console.log(error);
		});
	}

	listen(response, top, bottom) {
		let bizNetworkConnection = this.bizNetworkConnection;
		let cardname = this.cardname;

		bizNetworkConnection.connect(cardname).then(function() {
			console.log("LISTEEEN!");
			bizNetworkConnection.on('event', (event) => {
				console.log(JSON.stringify(event));
				var hasilSuara = "";
				for (let i = 0; i < event.nomorUrut.length; i++) {
					hasilSuara += `<tr>
						<td>${event.nomorUrut[i]}</td>
						<td>${event.namaCalon[i]}</td>
						<td>${event.namaWakilCalon[i]}</td>
						<td>${event.jumlahSuara[i]}</td>
					</tr>`;
				}
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write(top + hasilSuara + bottom);
			});
		}).catch((error) => {
			console.log(error);
		});
	}

	// read() {
	// 	let bizNetworkConnection = new BusinessNetworkConnection();
	// 	let resources = [];
	//
	// 	return bizNetworkConnection.connect(this.cardname).then(function() {
	// 		console.log("Connected Successfully!!!");
	// 		return bizNetworkConnection.getAssetRegistry('org.evote.pemilihan.Suara').then(function(suaraRegistry) {
	// 				return suaraRegistry.resolveAll().then(function(resourceCollection) {
	// 					return bizNetworkConnection.getParticipantRegistry('org.evote.pemilihan.Kandidat').then(async function(kandidatRegistry) {
	// 						for (let i = 0; i < resourceCollection.length; i++) {
	// 							let kandidatId = resourceCollection[i].owner.kandidatId;
	// 							var kandidat = await kandidatRegistry.get(kandidatId);
	//
	// 							if (resources.length > 0) {
	// 								for (let j = 0; j < resources.length; j++) {
	// 									if (resources[j].namaCalon === kandidat.namaCalon ||
	// 										resources[j].namaWakilCalon === kandidat.namaWakilCalon ||
	// 										resources[j].nomorUrut === kandidat.nomorUrut) {
	//
	// 										resources[j].jumlahSuara = resources[j].jumlahSuara + 1;
	// 									} else if (j === resources.length - 1) {
	// 										resources.push({
	// 											"namaCalon": kandidat.namaCalon,
	// 											"namaWakilCalon": kandidat.namaWakilCalon,
	// 											"nomorUrut": kandidat.nomorUrut,
	// 											"jumlahSuara": 1
	// 										});
	// 									}
	// 								}
	// 							} else {
	// 								resources.push({
	// 									"namaCalon": kandidat.namaCalon,
	// 									"namaWakilCalon": kandidat.namaWakilCalon,
	// 									"nomorUrut": kandidat.nomorUrut,
	// 									"jumlahSuara": 1
	// 								});
	// 							}
	// 						}
	// 						return resources;
	// 					});
	// 				});
	// 			})
	// 			.catch(function(error) {
	// 				console.error(error);
	// 			});
	// 	}).catch((error) => {
	// 		console.log(error);
	// 	});
	// 	console.log(resources);
	// }
}
module.exports = ReadHasilSuara;
