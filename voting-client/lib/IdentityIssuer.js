const IdentityIssue = require('composer-cli').Identity.Issue;

function issue(cardname, uname, userId, model, isIssuer) {
	let options = {
	  card: cardname,
	  file: uname,
	  newUserId: uname,
	  participantId: 'resource:' + model + "#" + userId,
	  issuer: isIssuer
	};
	IdentityIssue.handler(options);
}
module.exports = issue;
