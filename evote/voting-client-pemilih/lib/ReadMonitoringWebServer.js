const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class ReadMonitoringWebServer {

	constructor(cardName) {
		this.cardname = cardName;
	}

	read() {
		let bizNetworkConnection = new BusinessNetworkConnection();
		let namespace = 'org.pemilu.pemilihan';
		let registryName = 'MonitoringWebServer';
		let resources = [];

		return bizNetworkConnection.connect(this.cardname).then(function() {
			console.log("Connected Successfully!!!");
			return bizNetworkConnection.getParticipantRegistry(namespace + '.' + registryName).then(function(registry) {
				return registry.resolveAll().then(function(resourceCollection) {
					for (let i = 0; i < resourceCollection.length; i++) {
						resources.push({
							"i": i,
							"monitoringWebServerId" : resourceCollection[i].monitoringWebServerId,
							"alamat": resourceCollection[i].alamat
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
module.exports = ReadMonitoringWebServer;