const should = require('should');
const CMSOne = require('./index');

const apiURL = 'sample';
const collName = 'sampleprimarycollection';

describe('Unit tests for CMSOne Website backend', () => {
  describe('API Functions', () => {
    it('Main Setup', (done) => {
      CMSOne.Main.setup({
        get: () => { },
        post: () => { },
        delete: () => { },
        put: () => { },
        use: () => { }
      });
      CMSOne.Main.getVersion();
      done();
    });
  });
});
