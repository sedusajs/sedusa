const Client = require("./client");

class Sedusa {
	constructor(options = {}) {
		options = Object(options);
		this.options = options;

		this._clients = new Map();

		if("clients" in options) {
			if(typeof options.clients[Symbol.iterator] == "function") {
				for(let clientOptions of options.clients) {
					this.processClientConfig(clientOptions);
				}
			} else {
				throw new Error("'clients' property is not iterable");
			}
		}
	}

	processClientConfig(clientConfig) {
		if(!("id" in clientConfig)) {
			throw new Error("Client config must include an 'id' property.");
		}

		// TODO: hook for plugins to create custom clients

		let client = Client.fromConfig(this, clientConfig);
		this.addClient(clientConfig.id, client);
	}

	addClient(id, client) {
		if(this._clients.has(id)) {
			throw new Error("Client ID must be unique.");
		}
		this._clients.set(id, client);
	}

	removeClient(id) {
		if(!this._clients.has(id)) {
			return false;
		}
		this._clients.delete(id);
		return true;
	}
}

module.exports = Sedusa;