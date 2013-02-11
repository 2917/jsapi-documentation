
var rest = require('restler'),
    util = require('util'),
    GameBackend = require('../lib/gameBackend');

require('should');

get = function(url, cb) {
  rest.get(url, {followRedirects: false}).on('complete', function(data, res) {
    cb(data, res);
  });
};

describe('gameBackend', function() {

  var app;
  before(function(done) {
    app = new GameBackend(5000, done);
  });

  describe('#index', function() {
    it('should return 200 with a valid signature', function(done) {
      get('http://localhost:5000?user_id=test&sig=3bc8fd56f812cca20851785161d85ddf', function(data, res) {
        res.statusCode.should.equal(200);
        done();
      });
    });
    it('should return 403 with an invalid signature', function(done) {
      get('http://localhost:5000?sig=invalid', function(data, res) {
        res.statusCode.should.equal(403);
        done();
      });
    });
    it('should return 403 with no signature', function(done) {
      get('http://localhost:5000', function(data, res) {
        res.statusCode.should.equal(403);
        done();
      });
    });
  });
});