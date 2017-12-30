var chai = require('chai');
var assert = chai.assert;
var expect = require('chai').expect;

async function add(a, b) {
    return Promise.resolve(a + b);
}

describe('#add()', () => {
    it('2 + 2 is 4', async () => {
        const p = await add(2, 2)
        expect(p).to.equal(4);
    });

    it('3 + 3 is 6', async () => {
        const p = await add(3, 3)
        expect(p).to.equal(6);
    });
});
