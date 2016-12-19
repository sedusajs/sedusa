const assert = require('chai').assert;
const expect = require('chai').expect;
const requireSubvert = require('require-subvert')(__dirname);
const sinon = require('sinon');

const irc = require("irc");

const Sedusa = require('../lib/sedusa');
const Client = require('../lib/client');

describe('Client', function() {
    describe('#constructor()', function() {
        it("should create a new irc.Client instance", function() {
            let stubbedIrcClient = sinon.createStubInstance(irc.Client);
            let stub = sinon.stub(irc, "Client").returns(stubbedIrcClient);
            try {
                new Client({}, "him", {});
                expect(stub.calledOnce).to.be.true;
            } finally {
                stub.restore();
            }
        });
    });

    describe('#fromConfig()', function() {
        it('should return a Client instance', function() {
            let stubbedIrcClient = sinon.createStubInstance(irc.Client);
            let stub = sinon.stub(irc, "Client").returns(stubbedIrcClient);
            try {
                expect(Client.fromConfig({}, {id: "mojo"})).to.be.an.instanceOf(Client);
            } finally {
                stub.restore();
            }
        });
    });
});