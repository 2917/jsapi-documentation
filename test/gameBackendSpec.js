
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
      var url = host + '?user_id=test&sig=3fdb39a7fa614dbb5e1f214e25588a6a737964251d1da77488a927459079d96e';
      rest.get(url).on('complete', function(data, res) {
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
    it('should return 200 and *OK* with a valid signature and notification type', function(done) {
      var data = {
        type: "finalize-payment",
        payment_id: "1",
        user_id: "1",
        item_id: "1",
        price_tier: "1",
        custom_data: "fff",
        timestamp: "000",
        sig: "0732414788ad722faa73b184c6664e7ac68a796802e2fe80d261500312bd8112"
      };

      rest.post(host + '/notifications', {data: data}).on('complete', function(data, res) {
        res.statusCode.should.equal(200);
        data.should.equal("*OK*");
        done();
      });
    });
    it('should return 200 and *OK* with a valid signature and notification type', function(done) {
      var data = {
        type: "invite-accept",
        invited_by_user_id: "1",
        invited_user_id: "2",
        timestamp: "1361373960",
        sig: "94e2cc66c4beba08afe6c2b8640291a16255a6797c68d362cfd17ce194c1dd78"
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
        sig: "6948df77c2f3d4b9ce8b225be11ec1e9fb4985256bd4bd240b1d05f7d595c3d1"
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