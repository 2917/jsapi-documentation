
var rest = require('restler'),
    util = require('util'),
    GameBackend = require('../lib/gameBackend');

require('should');

var host = "http://localhost:5000";

describe('gameBackend', function() {

  var app;
  before(function(done) {
    app = new GameBackend(5000, done);
  });

  describe('#index', function() {
    it('should return 200 with a valid signature', function(done) {
      rest.get(host + '?user_id=test&sig=3bc8fd56f812cca20851785161d85ddf').on('complete', function(data, res) {
        res.statusCode.should.equal(200);
        done();
      });
    });
    it('should return 403 with an invalid signature', function(done) {
      rest.get(host + '?sig=invalid').on('complete', function(data, res) {
        res.statusCode.should.equal(403);
        done();
      });
    });
    it('should return 403 with no signature', function(done) {
      rest.get(host).on('complete', function(data, res) {
        res.statusCode.should.equal(403);
        done();
      });
    });
  });

  describe('#notifications', function() {
    it('should return 200 and *OK* with a valid signature', function(done) {
      var data = {
        type: "finalize-payment",
        payment_id: "1",
        user_id: "1",
        item_id: "1",
        price_tier: "1",
        custom_data: "fff",
        timestamp: "000",
        sig: "2452e2207c18f5282da971854c28e9d5"
      };

      rest.post(host + '/notifications', {data: data}).on('complete', function(data, res) {
        res.statusCode.should.equal(200);
        data.should.equal("*OK*");
        done();
      });
    });
    it('should return 404 for an invalid notification type', function(done) {
      var data = {
        type: "invalid",
        sig: "6fd82e6c0eeb3f69360e57772f04b66e"
      };

      rest.post(host + '/notifications', {data: data}).on('complete', function(data, res) {
        res.statusCode.should.equal(404);
        done();
      });
    });
    it('should return 403 with an invalid signature', function(done) {
      var data = {
        sig: "invalid"
      };
      rest.post(host + '/notifications', {data: data}).on('complete', function(data, res) {
        res.statusCode.should.equal(403);
        done();
      });
    });
  });
});