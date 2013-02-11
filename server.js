/*
 Example usage of the Softgames JavaScript API
*/

var port = (process.env.PORT || 4000),
    GameBackend = require("./lib/gameBackend");

new GameBackend(port, function() {
    console.log("Server started on port: " + port);
});