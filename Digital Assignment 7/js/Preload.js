function preloadState(game) {
    
    function preload() {
        
        // Load main menu assets
        game.load.image('BoxBackground', 'assets/Main Menu/box.png');
        game.load.image('MainMenuLogo', 'assets/Main Menu/PokemonLogo.png');
        game.load.spritesheet('NewGameButton', 'assets/Main Menu/MainMenuNewGameButton.png', 186, 29, 3);
        
        // Load game assets
        game.load.spritesheet('DiceSpritesheet', 'assets/Game/dice.png', 64, 64, 6);
        game.load.spritesheet('RollDiceButtonSprite', 'assets/Game/RollDiceButton.png', 182, 32, 3);
        
        game.load.spritesheet('CardsSpritesheet', 'assets/Game/CardSpritesheet.png', 99, 134, 56);
    }
    
    function create() {
        
    }
    
    function update() {
        game.state.start("mainMenu");
    }
    
    return {"preload": preload, "create": create, "update": update};
}