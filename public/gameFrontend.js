var softgames = new Softgames();
softgames.ready(function() {
  $("#ready").html("Ready.");

  $("#getCurrentUser").click(function() {
    softgames.getCurrentUser({include_friends: true}, printResult);
  });
  $("#startInvite").click(function() {
    // Stop your game
    softgames.startInvite({title: "Play!", message: "Play example game with me."}, function() {
      printResult("Invite closed.");
      // Continue the game
    });
  });
  $("#startPayment").click(function() {
    // Stop your game
    softgames.startPayment();
  });
});

printResult = function(result) {
  $("#result").html(JSON.stringify(result));
};