const axios = require('axios');

var get = function (username, password) {
	return axios.post("http://localhost:5984/blockchain_evote/_design/account/_view/get-card-name",
 				{"keys":[[username,password]]},
				{headers:
					{'Content-Type': 'application/json',
					"Authorization": "Basic bG9jYWxzZXJ2ZXI6dGhpczE1bG9jYWxzZXJ2ZXI="}
				})
				.then(function(user) {
					// return new Promise(function(resolve, reject) {
					// 	resolve(user.data.rows[0].value));
					// };
					return user.data.rows[0].value;
				});
}

var add = function (username, password, role) {
	return axios.get("http://localhost:5984/_uuids")
				.then(function (resp) {
					let id = resp.data.uuids[0];
					return axios.put(
						"http://localhost:5984/blockchain_evote/"+id,
						{"username": username, "password": password, "role": role, "cardname": username + "@evote-network"},
						{headers:
							{'Content-Type': 'application/json',
							"Authorization": "Basic bG9jYWxzZXJ2ZXI6dGhpczE1bG9jYWxzZXJ2ZXI="}
						}).then(function (result) {
							console.log(result);
							return result.data;
						});
				});
}

module.exports.get = get;
module.exports.add = add;
