var express = require('express'), crypto = require('crypto'), App;

GameBackend = module.exports = (function() {

  function GameBackend(port, callback) {
    var _this = this;
    this.app = express();
    
    // Start the server
    require('http').createServer(this.app).listen(port, callback);

    // Configure static folder, body parser and template engine
    this.app.use(express["static"]('public'));
    this.app.use(express.bodyParser());
    this.app.engine('.html', require('ejs').__express);

    // Define the game route
    this.app.get("/", function(request, response) {
      if (!_this.validSignature(request.query)) {
        response.send(403, "Invalid signature.");
        return;
      }
      console.log("User \"" + request.query.user_id + "\" entered the game.");
      response.render('index.ejs', {softgames_api: request.query.js_api});
    });

    // Endpoint for notifications
    this.app.post("/notifications", function(request, response) {
      if (!_this.validSignature(request.body)) {
        response.send(403, "Invalid signature.");
        return;
      }

      var notification = request.body;
      if (notification.type == "finalize-payment") {
        console.log("Received payment notification.");
        console.log("- User: \"" + notification.user_id + "\"");
        console.log("- Item: \"" + notification.item_id + "\"");
        console.log("- Tier: \"" + notification.price_tier + "\"");
      }
      else {
        response.send(404, "Unknown notification.");
        return;
      }
      response.send("*OK*");
    });
  }

  GameBackend.prototype.validSignature = function(queryParameters) {
    // Validate the signature
    var keys = (Object.keys(queryParameters)).sort(),
        sha256 = crypto.createHash('sha256'),
        text = "";

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key != "sig") {
        text += queryParameters[key] + "|";
      }
    }
    text += "secret";
    sha256.update(text);
    var calculatedSignature = sha256.digest('hex');
    return (calculatedSignature == queryParameters.sig);
  };

  return GameBackend;

})();

