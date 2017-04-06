function mainMenuState(game) {    
    
    var background = null;
    var newGameButton;
    
    function create() {
        
        // Add main menu background image
        background = game.add.sprite(game.width / 2, game.height / 2, 'MainMenuBackground');
        background.width = game.width;
        background.height = game.height;
        background.anchor.setTo(0.5, 0.5);
        
        // Add main menu logo
        background = game.add.sprite(game.width / 2, 100, 'MainMenuLogo');
        background.anchor.setTo(0.5, 0.5);
        
        // Add the New Game Button
        newGameButton = game.add.button(500, 480, 'NewGameButton', startGame, this, 3, 1, 2, 3);
        newGameButton.anchor.setTo(0, 0);
        // Add the Raise Volume Button
        raiseVolume = game.add.button(500, 520, 'RaiseVolume', raiseVolume, this, 3, 1, 2, 3);
        raiseVolume.anchor.setTo(0, 0);
        // Add the Lower Volume Button
        lowerVolume = game.add.button(500, 560, 'LowerVolume', lowerVolume, this, 3, 1, 2, 3);
        lowerVolume.anchor.setTo(0, 0);
        
        // Add the music and then play it
        introMusic = game.add.audio('MainMenuMusic');
        introMusic.volume = musicVolume;
        introMusic.play();
    }
    
    function update() {
        
    }
    
    function lowerVolume() {
        musicVolume = musicVolume - 0.1;
        if(musicVolume <= minVolume) {
            musicVolume = 0;
        }
        introMusic.volume = musicVolume;
    }
    
    function raiseVolume() {
        musicVolume = musicVolume + 0.1;
        if(musicVolume >= maxVolume) {
            musicVolume = maxVolume;
        }
        introMusic.volume = musicVolume;
    }
    
    function startGame() {
        game.state.start("intro");
        
        //introMusic.stop();
        //game.state.start("main");
    }
    
    return {"create": create, "update": update, "startGame": startGame};
}