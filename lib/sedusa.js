const EventEmitter = require("events");
const winston = require("winston");

const Client = require("./client");
const Plugin = require("./plugin");

class Sedusa extends EventEmitter {
  constructor(options = {}) {
    super();
    options = Object(options);
    this.options = options;
    const logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(),
      ],
    });

    this.logger = logger.info;

    this.clients = new Map();
    this.plugins = new Map();

    this.Plugin = Plugin;

    if("clients" in options) {
      if(options.clients !== null && options.clients !== undefined && typeof options.clients[Symbol.iterator] === "function") {
        for(const clientOptions of options.clients) {
          this.processClientConfig(clientOptions);
        }
      } else {
        throw new Error("'clients' property is not iterable");
      }
    }

    if("plugins" in options) {
      if(typeof options.plugins === "object" && options.plugins !== null) {
        for(const [modulePath, settings] of Object.entries(options.plugins)) {
          this.loadPlugin(modulePath, settings);
        }
      }
    }
  }

  processClientConfig(clientConfig) {
    clientConfig = Object(clientConfig);
    if(!("id" in clientConfig)) {
      throw new Error("Client config must include an 'id' property.");
    }

    const client = Client.fromConfig(this, clientConfig);
    this.addClient(clientConfig.id, client);
  }

  addClient(id, client) {
    if(this.clients.has(id)) {
      throw new Error("Client ID must be unique.");
    }
    this.clients.set(id, client);
    this.emit("clientadded", id, client);
  }

  removeClient(id) {
    if(!this.clients.has(id)) {
      return false;
    }
    const client = this.clients.get(id);
    client.destroy();
    this.clients.delete(id);
    this.emit("clientremoved", id, client);
    return true;
  }

  loadPlugin(modulePath, settings) {
    /* eslint import/no-dynamic-require: "off", global-require: "off" */
    const pluginModule = require(modulePath);
    if(typeof pluginModule !== "function") {
      throw new TypeError(`Could not initialize plugin ${modulePath} because its module does not export a function.`);
    }
    const plugin = pluginModule(this, settings);
    this.plugins.set(modulePath, plugin);
    this.logger(`Loaded plugin ${modulePath}`);
  }
}

module.exports = Sedusa;
