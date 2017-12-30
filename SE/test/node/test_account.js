var chai = require('chai');
var assert = chai.assert;
var expect = require('chai').expect;

var account = require('../../node/account.js');


describe('Testing account.js', function () {

    describe('etAccountType( account )', function () {
        it('getAccountType( root )', async function () {
            assert.equal(await account.getAccountType('root'), 'boss');
        });

        it('getAccountType( boss )', async function () {
            assert.equal(await account.getAccountType('boss'), 'boss');
        });

        it('getAccountType( client )', async function () {
            assert.equal(await account.getAccountType('client'), null);
        });
    });

    it('login( account, password )', async function () {
        assert.equal(await account.login('root', 'root'), true);
    });

});
