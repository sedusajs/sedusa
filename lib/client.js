const irc = require("irc");

class Client {
	constructor(parent, id, options) {
		this._parent = parent;
		this._id = id;
		this._options = options;

		let client = new irc.Client(options.server, options.nick, options.settings);
		console.log("ok done");

		this._client = client;

		client.on("message", (nick, to, message, raw) => {
			let returnTo = to == client.nick ? nick : to;
			client.say(returnTo, "You said: " + message);
		});

		client.on("raw", function(m) {
			//console.log(m.rawCommand);
		});

		client.on("error", function(m) {
			console.log(m.rawCommand);
		});
	}

	static fromConfig(parent, config) {
		return new Client(parent, config.id, config);
	}
}

Client._clientsCreated = 0;

module.exports = Client;