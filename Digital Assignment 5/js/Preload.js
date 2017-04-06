function preloadState(game) {
    
    var background = null;
    var loadingBar = null;
    
    var preloadProgressStyle;
    var preloadProgressText;
    
    function preload() {
        // Add preload background image
        background = game.add.sprite(game.width / 2, game.height / 2, 'PreloadBackground');
        background.width = game.width;
        background.anchor.setTo(0.5, 0.5);
        
        // Add preload loading bar image
        loadingBar = game.add.sprite(game.width / 2, game.height / 1.10, 'PreloadLoadingBar');
        loadingBar.anchor.setTo(0.5, 0.5);
        
        // Crop the loading bar from 0 to full-width as the assets load
        game.load.setPreloadSprite(loadingBar);
        
        // Load main menu assets
        game.load.image('MainMenuBackground', 'assets/Main Menu/MainMenuBackground.jpg');
        game.load.image('MainMenuLogo', 'assets/Main Menu/PokemonLogo.png');
        game.load.spritesheet('NewGameButton', 'assets/Main Menu/MainMenuNewGameButton.png', 186, 29, 3);
        game.load.spritesheet('RaiseVolume', 'assets/Main Menu/RaiseVolume.png', 250, 29, 3);
        game.load.spritesheet('LowerVolume', 'assets/Main Menu/LowerVolume.png', 250, 29, 3);
        
        game.load.audio('MainMenuMusic', ['assets/Main Menu/MainMenuMusic.mp3']); 
        
        game.load.image('Oak1', 'assets/Main Menu/Oak1.png');
        game.load.image('TextBox', 'assets/Main Menu/TextBox.png');
        
        // Load game assets
        
        //  ** World **
        game.load.audio('Music1', ['assets/Music/Pallet Town.mp3']);
        game.load.audio('Music2', ['assets/Music/Pewter City.mp3']);
        game.load.audio('Music3', ['assets/Music/Road to Viridian City.mp3']);
        game.load.audio('VictoryMusic', ['assets/Music/Victory Theme.mp3']);
        game.load.audio('PokemonCaughtAudio', ['assets/Music/PokemonCaughtAudio.mp3']);
        
        game.load.image('PokeballSprite', 'assets/World/PokeballSprite.png');
        
        // TileMap
        game.load.tilemap('tilemap', 'assets/World/TileMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/World/PokemonTiledAssets.png');
        game.load.image('EmptySprite', 'assets/World/EmptySprite.png');
        
        //  ** Player **
        //  21x30 is the size of each frame
        //  There are 16 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
        //  blank frames at the end, so we tell the loader how many to load
        game.load.spritesheet('RedheadGirlSprite', 'assets/Characters/RedheadGirlSpritesheet.png', 21, 30);
        game.load.spritesheet('BoySprite', 'assets/Characters/BoySpritesheet.png', 64, 64);
        game.load.spritesheet('ProfessorOakSprite', 'assets/Characters/ProfessorOakSpritesheet.png', 31, 32);
        
        game.load.spritesheet('BulbasaurSprite', 'assets/Characters/BulbasaurSpritesheet.png', 30, 30);
        game.load.spritesheet('CharmanderSprite', 'assets/Characters/CharmanderSpritesheet.png', 30, 30);
        game.load.spritesheet('SquirtleSprite', 'assets/Characters/SquirtleSpritesheet.png', 30, 30);
        game.load.spritesheet('PikachuSprite', 'assets/Characters/PikachuSpritesheet.png', 30, 30);
        game.load.spritesheet('VulpixSprite', 'assets/Characters/VulpixSpritesheet.png', 30, 30);
        
        preloadProgressStyle = { font: "18px Verdana", fill: "#ffffff", align: "center" };
        preloadProgressText = game.add.text(game.width / 2, game.height / 1.095, "", preloadProgressStyle);
        preloadProgressText.anchor.setTo(0.5, 0.5);
    }
    
    function create() {
        loadingBar.cropEnabled = false;
    }
    
    function update() {
        if(game.cache.isSoundDecoded('MainMenuMusic')) {
            game.state.start("mainGame");
            //game.state.start("mainMenu");
        }
    }
    
    function loadUpdate() {
        var preloadProgress = game.load.progress;
        preloadProgressText.setText(preloadProgress);
    }
    
    return {"preload": preload, "create": create, "update": update, "loadUpdate": loadUpdate};
}