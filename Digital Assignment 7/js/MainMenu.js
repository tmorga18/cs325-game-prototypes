function mainMenuState(game) {    
    
    var background = null;
    var newGameButton;
    
    function create() {
        // Set background color
        game.stage.backgroundColor = "#e6e6fa";
        
        // Add main menu background image
        background = game.add.sprite(game.width / 2, game.height / 2, 'BoxBackground');
        background.width = game.width / 1.5;
        background.height = game.height / 1.5;
        background.anchor.setTo(0.5, 0.5);
        
        // Add main menu logo
        //background = game.add.sprite(game.width / 2, 100, 'MainMenuLogo');
        //background.anchor.setTo(0.5, 0.5);
        
        // Add the New Game Button
        newGameButton = game.add.button(500, 480, 'NewGameButton', startGame, this, 3, 1, 2, 3);
        newGameButton.anchor.setTo(0, 0);
        
        game.state.start("mainGame");
    }
    
    function update() {
        
    }
    
    function startGame() {
        game.state.start("mainGame");
    }
    
    return {"create": create, "update": update, "startGame": startGame};
}