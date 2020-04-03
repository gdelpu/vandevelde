'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const Hapi = require('@hapi/hapi');

const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const Vandevelde = require('..');

describe('Vandevelde', () => {

    let server;
    const myObjectModule = { test1: () => 'test1', test2: 'abcd' };
    const myFunctModule = () => {

        return myObjectModule;
    };

    beforeEach(() => {

        // init server
        server = new Hapi.server({ port: 80 });
    });

    afterEach(() => {

        server.stop();
    });

    it('should export register method', () => {

        const { plugin: { register } } = Vandevelde;
        expect(register).to.exist();
        expect(typeof register).to.equal('function');
    });

    it('should validate register options', () => {

        const callRegister = function () {

            Vandevelde.plugin.register({});
        };

        expect(callRegister).to.throw();
    });

    it('should accept single object as option', () => {

        const callRegister = async function () {

            const myModule = { test1: () => 'test1', test2: () => 'test2' };

            await server.register({
                plugin: Vandevelde,
                options: {
                    name: 'myModule',
                    module: myModule,
                    decorate: ['server']
                }
            });
        };

        expect(callRegister).not.to.throw();
    });

    it('should accept array of objects as option', () => {

        const callRegister = async function () {

            await server.register([{
                plugin: Vandevelde,
                options: {
                    name: 'myModule',
                    module: myObjectModule,
                    decorate: ['server']
                }
            }]);
        };

        expect(callRegister).not.to.throw();
    });

    it('should accept objects as module', () => {

        const callRegister = async function () {

            await server.register([{
                plugin: Vandevelde,
                options: {
                    name: 'myModule',
                    module: myObjectModule,
                    decorate: ['server']
                }
            }]);
        };

        expect(callRegister).not.to.throw();
    });

    it('should accept function as module', () => {

        const callRegister = async function () {

            await server.register([{
                plugin: Vandevelde,
                options: {
                    name: 'myModule',
                    module: myFunctModule,
                    decorate: ['server']
                }
            }]);
        };

        expect(callRegister).not.to.throw();
    });

    it('should create a hosting property named after options.name', async () => {

        const callRegister = async function () {

            await server.register([{
                plugin: Vandevelde,
                options: {
                    name: 'myModule',
                    module: myObjectModule,
                    decorate: ['server']
                }
            }]);
        };

        await callRegister();
        expect(server.myModule).to.exist();
    });

    it('should decorate with module\'s exported objects', async () => {

        const callRegister = async function () {

            await server.register([{
                plugin: Vandevelde,
                options: {
                    name: 'myModule',
                    module: myObjectModule,
                    decorate: ['server']
                }
            }]);
        };

        await callRegister();
        expect(server.myModule).to.exist();
        expect(server.myModule.test1).to.be.instanceOf(Function);
        expect(server.myModule.test2).to.equal(myObjectModule.test2);
    });
});
