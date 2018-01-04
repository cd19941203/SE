var chai = require('chai');
var assert = chai.assert;
var expect = require('chai').expect;

var database = require('../../node/database.js');

describe('Testing database.js', function () {
    it('connect()', function () {
        assert.notEqual(database.connect, database.dbConnectionError);
        assert.notEqual(database.connect, database.dbManipulationError);
    });

});
