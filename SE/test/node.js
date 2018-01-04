var chai = require('chai');
var assert = chai.assert;
var expect = require('chai').expect;

var database = require('../node/database.js');
var account = require('../node/account.js');

describe('Testing database.js', function () {
    it('connect()', function () {
        assert.notEqual(database.connect, database.dbConnectionError);
        assert.notEqual(database.connect, database.dbManipulationError);
    });

});
/*
describe('Testing account.js', function () {

    it('login( account, password)', async function () {
        assert.equal(await account.login('root', 'root'), true);
    });
    
});
*/
