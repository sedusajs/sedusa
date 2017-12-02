const EventEmitter = require("events");
const irc = require("irc");

class Client extends EventEmitter {
  constructor(parent, id, options) {
    super();
    this.parent = parent;
    this.id = id;
    this.options = options;
    this.destroyed = false;
    const log = parent.logger;

    const client = new irc.Client(options.server, options.nick, options.settings);
    
    this.client = client;
    
    const originalClientEmit = client.emit.bind(client);
    client.emit = (...args) => {
      log(`Event ${args[0]} emitted in hijacked emit.`);
      originalClientEmit(...args);
      this.emit(...args);
      
      return true;
    };

    log(`New client ${id} established`);
  }

  static fromConfig(parent, config) {
    return new Client(parent, config.id, config);
  }

  emit(...args) {
    const log = this.parent.logger;
    log(`Event ${args[0]} emitted in overridden emit.`);
    super.emit(...args);
    
    const [eventName, ...eventArgs] = args;
    this.parent.emit(...[`client:${eventName}`, this, ...eventArgs]);

    return true;
  }

  destroy() {
    if(!this.destroyed) {
      this.client.disconnect("Client destroyed");
      this.emit("destroy");
      this.destroyed = true;
      this.parent.logger(`Client ${this.id} has been destroyed.`);
    }
  }
}

module.exports = Client;
