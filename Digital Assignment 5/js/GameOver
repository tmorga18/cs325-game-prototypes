function gameOverState(game) {
    
    var victoryMusic;
    var timer = 0;
    
    function create() {
        // Add main menu background image
        var background = game.add.sprite(game.width / 2, game.height / 2, 'MainMenuBackground');
        background.width = game.width;
        background.height = game.height;
        background.anchor.setTo(0.5, 0.5);
        
        // Add the "to be continued" text
        var style = { font: "30px Verdana", fill: "#111111", align: "center" };
        var text = game.add.text(game.width / 2, 200, "To be continued....", style);
        text.anchor.setTo(0.5, 0.5);
        
        // Add the New Game Button
        //var newGameButton = game.add.button(500, 500, 'NewGameButton', restartGame, this, 3, 1, 2, 3);
        
        // Add the music and then play it
        victoryMusic = game.add.audio('VictoryMusic');
        victoryMusic.volume = musicVolume;
        victoryMusic.play();
        
        game.time.events.loop(Phaser.Timer.SECOND, incrementTimer);
    }
    
    function incrementTimer() {
        timer++;
        if(timer >= 5) {
            restartGame();
        }
    }
    
    function restartGame() {
        //victoryMusic.stop();
        //game.state.start("mainMenu", false);
        //game.state.start("main", false);
        
    }
    
    return {"create": create};
}