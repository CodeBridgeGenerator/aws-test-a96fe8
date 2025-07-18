const assert = require('assert');
const app = require('../../src/app');

describe('\'cartitem\' service', () => {
  it('registered the service', () => {
    const service = app.service('cartitem');

    assert.ok(service, 'Registered the service (cartitem)');
  });
});
