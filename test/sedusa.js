const assert = require('chai').assert;
const expect = require('chai').expect;
const requireSubvert = require('require-subvert')(__dirname);
const sinon = require('sinon');

const Sedusa = require('../lib/sedusa');
const Client = require('../lib/client');

describe('Sedusa', function() {
    describe('#constructor()', function() {

        it('should accept options without a clients property', function() {
            let o = {};
            assert.doesNotThrow(() => new Sedusa({})); 
        });

        it('should throw if options argument has a non-iterable clients property value', function() {
            expect(() => new Sedusa({clients: null})).to.throw();
            expect(() => new Sedusa({clients: void(0)})).to.throw();
            expect(() => new Sedusa({clients: 1})).to.throw();
            expect(() => new Sedusa({clients: true})).to.throw();
            expect(() => new Sedusa({clients: Symbol()})).to.throw();
            expect(() => new Sedusa({clients: {}})).to.throw();
        });

        it('should not throw if options argument has an iterable clients property value', function() {
            expect(() => new Sedusa({clients: []})).not.to.throw();
            expect(() => new Sedusa({clients: ""})).not.to.throw();
            expect(() => new Sedusa({clients: new Map()})).not.to.throw();
            let iterable = {
                [Symbol.iterator]() {
                    return {
                        next() {
                            return {done: true};
                        }
                    };
                }
            };
            expect(() => new Sedusa({clients: iterable})).not.to.throw();
        });

        it('should set the options property to an object value', function() {
            let sedusa = new Sedusa({});
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');

            sedusa = new Sedusa();
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');

            sedusa = new Sedusa("");
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');

            sedusa = new Sedusa(1);
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');

            sedusa = new Sedusa(true);
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');

            sedusa = new Sedusa(null);
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');

            sedusa = new Sedusa(void(0));
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');

            sedusa = new Sedusa(Symbol("1"));
            expect(sedusa).to.have.property('options');
            expect(typeof sedusa.options).to.equal('object');
        });

        it('should set the options property equal to the options argument if it is an object', function() {
            let o = {};
            let sedusa = new Sedusa(o);
            expect(sedusa).to.have.property('options').that.equals(o);
        });

        it("should call processClientConfig", function() {
            let stub = sinon.stub(Sedusa.prototype, "processClientConfig");
            let config = {
                clients: [
                    {id: "mojo"}
                ]
            };
            let config2 = {
                clients: [
                    {id: "Mayor"},
                    {id: "Miss Bellum"}
                ]
            };

            let config3 = {
                clients: [
                    {id: "Bubbles"},
                    {id: "Blossom"},
                    {id: "Buttercup"}
                ]
            };
            try {
                new Sedusa(config);
                expect(stub.calledOnce).to.be.true;
                expect(stub.getCall(0).calledWith(config.clients[0])).to.be.true;

                stub.reset();

                new Sedusa(config2);
                expect(stub.calledTwice).to.be.true;
                expect(stub.getCall(0).calledWith(config2.clients[0])).to.be.true;
                expect(stub.getCall(1).calledWith(config2.clients[1])).to.be.true;

                stub.reset();

                new Sedusa(config3);
                expect(stub.calledThrice).to.be.true;
                expect(stub.getCall(0).calledWith(config3.clients[0])).to.be.true;
                expect(stub.getCall(1).calledWith(config3.clients[1])).to.be.true;
                expect(stub.getCall(2).calledWith(config3.clients[2])).to.be.true;
            } finally {
                stub.restore();
            }
        });
    });

    describe('#processClientConfig()', function() {
        it('should throw when a client config does not have an id property', function() {
            let stub = sinon.stub(Client, "fromConfig").returns({});
            try {
                expect(() => new Sedusa().processClientConfig({})).to.throw();

                expect(() => new Sedusa().processClientConfig({id: void(0)})).not.to.throw();
                expect(() => new Sedusa().processClientConfig({id: ""})).not.to.throw();
                expect(() => new Sedusa().processClientConfig({id: Symbol})).not.to.throw();
                expect(() => new Sedusa().processClientConfig({id: null})).not.to.throw();
            } finally {
                stub.restore();
            }
        });
    });
});