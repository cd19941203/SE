var chai = require('chai');
var assert = chai.assert;
var expect = require('chai').expect;

var account = require('../../node/account.js');


describe('Testing account.js', function () {

    it('getAccountType', async function () {
        assert.equal(await account.getAccountType('root'), 'boss');
        assert.equal(await account.getAccountType('boss'), 'boss');
        assert.equal(await account.getAccountType('client'), null);
    });

    it('login', async function () {
        assert.equal(await account.login('root', 'root'), true);
    });

});
