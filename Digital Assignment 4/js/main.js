'use strict';

var introMusic;
var playerName;

// Runs when the page finishes loading
window.onload = function () {
    
    var game = new Phaser.Game( 800, 600, Phaser.CANVAS, 'game' );
    
    game.state.add("boot", bootState(game));
    game.state.add("preload", preloadState(game));
    game.state.add("mainMenu", mainMenuState(game));
    game.state.add("intro", introState(game));
    game.state.add("main", mainGameState(game));
    game.state.add("gameOver", gameOverState(game));
    
    game.state.start("boot");
};


// ***************** BOOT STATE *****************


function bootState(game) {
    function preload() {
        game.load.image('PreloadBackground', 'assets/Preload/PreloadBackground.jpg');
        game.load.image('PreloadLoadingBar', 'assets/Preload/PreloadLoadingBar.png');
    }
    
    function create() {
        game.state.start("preload");
    }
    
    return {"preload": preload, "create": create};
}


// ***************** PRELOAD STATE *****************


function preloadState(game) {
    
    var background = null;
    var loadingBar = null;
    var ready = false;
    
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
        game.load.audio('MainMenuMusic', ['assets/Main Menu/MainMenuMusic.mp3']); 
        
        game.load.image('Oak1', 'assets/Main Menu/Oak1.png');
        
        
        // Load game assets
        
        //  ** World **
        game.load.audio('Music1', ['assets/Music/Pallet Town.mp3']);
        game.load.audio('Music2', ['assets/Music/Pewter City.mp3']);
        game.load.audio('Music3', ['assets/Music/Road to Viridian City.mp3']);
        game.load.audio('VictoryMusic', ['assets/Music/Victory Theme.mp3']);
        
        // TileMap
        game.load.tilemap('tilemap', 'assets/World/TileMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/World/PokemonTiledAssets.png');
        
        //  ** Characters **
        //  21x30 is the size of each frame
        //  There are 16 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
        //  blank frames at the end, so we tell the loader how many to load
        game.load.spritesheet('MainCharacterSprite', 'assets/Characters/MainCharacterSpritesheet.png', 21, 30);
        
        game.load.spritesheet('VulpixSprite', 'assets/Characters/VulpixSpritesheet.png', 25, 25);
        
        game.load.spritesheet('BoySprite', 'assets/Characters/BoySpritesheet.png', 64, 64);
    }
    
    function create() {
        loadingBar.cropEnabled = false;
    }
    
    function update() {
        if(game.cache.isSoundDecoded('MainMenuMusic') && ready == false) {
            ready = true;
            game.state.start("mainMenu");
        }
    }
    
    return {"preload": preload, "create": create, "update": update};
}


// ***************** MAIN MENU STATE *****************


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
        newGameButton = game.add.button(500, 500, 'NewGameButton', startGame, this, 3, 1, 2, 3);
        
        // Add the music and then play it
        introMusic = game.add.audio('MainMenuMusic');
        introMusic.volume = 0.01;
        introMusic.play();
    }
    
    function update() {
        
    }
    
    function startGame() {
        //music.stop();
        //game.state.start("main");
        game.state.start("intro");
    }
    
    return {"create": create, "update": update, "startGame": startGame};
}


// ***************** INTRO STATE *****************


function introState(game) {
    
    var oak;
    var text;
    var timer = 0;
    var counter = 0;
    var oakText = ["Hello there!", "Welcome to the world of Pokemon.", "My name is Professor Oak.", "What's your name?", " ", "Nice to meet you " + localStorage.getItem("playerName"), "This world is populated by creatures called Pokemon", "Your job is to catch them all!", " "];
    
    function create() {
        game.stage.backgroundColor = "#ffffff"
        
        // Add Professor Oak image
        oak = game.add.sprite(game.width / 2, 250, 'Oak1');
        oak.anchor.setTo(0.5, 0.5);
        
        // Add the text
        var style = { font: "30px Verdana", fill: "#111111", align: "center" };
        text = game.add.text(game.width / 2, 500, "", style);
        text.anchor.setTo(0.5, 0.5);
        
        game.time.events.loop(Phaser.Timer.SECOND, incrementTimer);
    }
    
    function update() {
        if(counter >= oakText.length) {
            startGame();
        }
        
        if(timer >= 2 && counter < oakText.length) {
            if(counter == 4) {
                promptName();
            }
            text.setText(oakText[counter]);
            counter++;
            timer = 0;
        }
    }
    
    function promptName() {
        playerName = prompt("Please enter your name", "name");
        localStorage.setItem("playerName", playerName);
    }
    
    function incrementTimer() {
        timer++;
    }
    
    function startGame() {
        introMusic.stop();
        game.state.start("main");
    }
    
    return {"create": create, "update": update, "startGame": startGame};
}


// ***************** MAIN GAME STATE *****************


function mainGameState(game) {
    
    // World variables
        var music;
    
        var groundLayer;
        var hillsLayer;
        var treesLayer;
        var buildingsLayer;
        var waterAnimatedLayer;
        var riverbankLayer;
        var depthLayer;
        var depthGroup;
    
    // Character variables
        var character;
    // Movement
        var idle;
        var walkDown;
        var walkRight;
        var walkLeft;
        var walkUp;
        var walkSpeed = 75;
    
    // Pokemon variables
        var vulpix1;
        var vulpix2;
        var vulpix3;
    
        var vulpix1Caught = false;
        var vulpix2Caught = false;
        var vulpix3Caught = false;
    // Movement
        var idleDown;
        var idleRight;
        var idleLeft;
        var idleUp;
        var followCharacter = false;
    
    // Boy
        var boy;
        var walkLeftBoy;
        var idleLeftBoy;
    
    function create() {
        
        var randomSong = game.rnd.integerInRange(1, 3);
        
        // Add the music and then play it
        switch(randomSong) {
            case 1:
                music = game.add.audio('Music1');
                music.volume = 0.01;
                music.play();
                break;
            case 2:
                music = game.add.audio('Music2');
                music.volume = 0.01;
                music.play();
                break;
            case 3:
                music = game.add.audio('Music3');
                music.volume = 0.01;
                music.play();
                break;
        }
        
        
        // ****************** CREATE WORLD ******************
        
        
        // Start the Arcade Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Add the tilemap to the game
        var map = game.add.tilemap('tilemap');
        map.addTilesetImage('PokemonTiledAssets', 'tiles');
        
        // Add all the layers to collide with
        groundLayer = map.createLayer('Ground');
        depthLayer = map.createLayer('Depth');
        hillsLayer = map.createLayer('Hills');
        treesLayer = map.createLayer('Trees');
        buildingsLayer = map.createLayer('Buildings');
        waterAnimatedLayer = map.createLayer('Water Animated');
        riverbankLayer = map.createLayer('RiverBank');
        hillsLayer.resizeWorld();
        
        //hillsLayer.debug = true;
        //treesLayer.debug = true;
        //buildingsLayer.debug = true;
        //riverbankLayer.debug = true;
        
        // Turn on the layer' collisions
        map.setCollisionBetween(1, 10000, true, 'Hills');
        map.setCollisionBetween(1, 10000, true, 'Trees');
        map.setCollisionBetween(1, 15000, true, 'Buildings');
        map.setCollisionBetween(1, 15000, true, 'Water Animated');
        
        
        // ****************** CREATE CHARACTER ******************
        
        
        character = game.add.sprite(472, 170, 'MainCharacterSprite', 0);
        character.anchor.setTo(0.5, 0.5);
        character.scale.set(0.9);
        game.physics.enable(character);
        character.body.fixedRotation = true;
        character.body.collideWorldBounds = true;
        
        idle = character.animations.add('idle', [0], 3, true, true);
        walkDown = character.animations.add('walkDown', [2, 3], 3, true, true);
        walkUp = character.animations.add('walkUp', [7, 8], 3, true, true);
        walkLeft = character.animations.add('walkLeft', [12, 13], 3, true, true);
        walkRight = character.animations.add('walkRight', [16, 17], 3, true, true);
        
        //********* CHARACTER CONTROLS *********
        
        game.input.keyboard.addKeys( {
            'up': Phaser.KeyCode.W,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A,
            'right': Phaser.KeyCode.D
        });
        
        // ****************** CREATE VULPIX ******************
        vulpix1 = game.add.sprite(500, 550, 'VulpixSprite', 0);
        createVulpix(vulpix1);
        game.time.events.loop(Phaser.Timer.SECOND, turnVulpix);
        
        vulpix2 = game.add.sprite(200, 450, 'VulpixSprite', 0);
        createVulpix(vulpix2);
        
        vulpix3 = game.add.sprite(390, 50, 'VulpixSprite', 0);
        createVulpix(vulpix3);
        
        // ****************** CREATE BOY ******************
        
        boy = game.add.sprite(810, 510, 'BoySprite', 0);
        boy.anchor.setTo(0.5, 0.5);
        boy.scale.set(0.5);
        game.physics.enable(boy);
        boy.body.fixedRotation = true;
        
        idleLeftBoy = boy.animations.add('idleLeftBoy', [4], 3, true, true);
        walkLeftBoy = boy.animations.add('walkLeftBoy', [5, 6, 7], 3, true, true);
        
        // Create a group so that the character will sort behind objects
        depthGroup = game.add.group();
        depthGroup.add(vulpix1);
        depthGroup.add(vulpix2);
        depthGroup.add(vulpix3);
        depthGroup.add(character);
        depthGroup.add(depthLayer);
    }
    
    
    function update() {
        // Collision between character and vulpix
        game.physics.arcade.collide(character, vulpix1, petVulpix1);
        game.physics.arcade.collide(character, vulpix2, petVulpix2);
        game.physics.arcade.collide(character, vulpix3, petVulpix3);
        game.physics.arcade.collide(character, boy, gameOver);
        
        // Collision between character and world
        game.physics.arcade.collide(character, hillsLayer);
        game.physics.arcade.collide(character, treesLayer);
        game.physics.arcade.collide(character, buildingsLayer);
        game.physics.arcade.collide(character, waterAnimatedLayer);
        
        // Collision between vulpix and world
        game.physics.arcade.collide(vulpix1, vulpix2);
        game.physics.arcade.collide(vulpix1, vulpix3);
        game.physics.arcade.collide(vulpix1, hillsLayer);
        game.physics.arcade.collide(vulpix1, treesLayer);
        game.physics.arcade.collide(vulpix1, buildingsLayer);
        game.physics.arcade.collide(vulpix1, waterAnimatedLayer);
        
        // Collision between vulpix and world
        game.physics.arcade.collide(vulpix2, vulpix1);
        game.physics.arcade.collide(vulpix2, vulpix3);
        game.physics.arcade.collide(vulpix2, hillsLayer);
        game.physics.arcade.collide(vulpix2, treesLayer);
        game.physics.arcade.collide(vulpix2, buildingsLayer);
        game.physics.arcade.collide(vulpix2, waterAnimatedLayer);
        
        // Collision between vulpix and world
        game.physics.arcade.collide(vulpix3, vulpix1);
        game.physics.arcade.collide(vulpix3, vulpix1);
        game.physics.arcade.collide(vulpix3, hillsLayer);
        game.physics.arcade.collide(vulpix3, treesLayer);
        game.physics.arcade.collide(vulpix3, buildingsLayer);
        game.physics.arcade.collide(vulpix3, waterAnimatedLayer);
        
        // Stop the character from running off
        character.body.velocity.x = 0;
        character.body.velocity.y = 0;
        

        // Character movement controls
        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            character.body.velocity.y = -walkSpeed;
            character.animations.play('walkUp', 4, true);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            character.body.velocity.y = walkSpeed;
            character.animations.play('walkDown', 4, true);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            character.body.velocity.x = -walkSpeed;
            character.animations.play('walkLeft', 4, true);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            character.body.velocity.x = walkSpeed;
            character.animations.play('walkRight', 4, true);
        } else {
            character.animations.play('idle', 4, true);
        }
        
        
        // Make vulpix follow the player
        if(vulpix1Caught == true) {
            if(game.physics.arcade.distanceBetween(vulpix1, character) > 50) {
                game.physics.arcade.moveToXY(vulpix1, character.x, character.y);
            }
        }
        if(vulpix2Caught == true) {
            if(game.physics.arcade.distanceBetween(vulpix2, character) > 50) {
                game.physics.arcade.moveToXY(vulpix2, character.x, character.y);
            }
        }
        if(vulpix3Caught == true) {
            if(game.physics.arcade.distanceBetween(vulpix3, character) > 50) {
                game.physics.arcade.moveToXY(vulpix3, character.x, character.y);
            }
        }
        if(vulpix1Caught == true && vulpix2Caught == true && vulpix3Caught == true) {
            var atDest = false;
            if(atDest == false) {
                game.physics.arcade.moveToXY(boy, 760, 510);
                atDest = true;
            }
            
            if(boy.x == 760) {
                boy.animations.play('idleLeftBoy', 4, true);
            }
        } else {
            boy.animations.play('walkLeftBoy', 4, true);
        }
    }
    
    
    function createVulpix(vulpix) {
        vulpix.scale.set(0.8);
        game.physics.arcade.enable(vulpix);
        vulpix.body.fixedRotation = true;
        vulpix.anchor.setTo(0.5, 0.5);
        vulpix.body.drag.setTo(500, 500);
        vulpix.body.collideWorldBounds = true;
        
        // Add animations for Vulpix
        idleDown = vulpix.animations.add('idleDown', [0, 1], 3, true, true);
        idleUp = vulpix.animations.add('idleUp', [2, 3], 3, true, true);
        idleLeft = vulpix.animations.add('idleLeft', [4], 3, true, true);
        idleRight = vulpix.animations.add('idleRight', [5], 3, true, true);
    }
    
    
    // Make vulpix look around
    function turnVulpix() {
        var randomDirection = game.rnd.integerInRange(1, 3);
        
        switch(randomDirection) {
            case 1:
                vulpix1.animations.play('idleUp', 4, true);
                vulpix2.animations.play('idleLeft', 4, true);
                vulpix3.animations.play('idleRight', 4, true);
                break;
            case 2:
                vulpix1.animations.play('idleLeft', 4, true);
                vulpix2.animations.play('idleRight', 4, true);
                vulpix3.animations.play('idleUp', 4, true);
                break;
            case 3:
                vulpix1.animations.play('idleRight', 4, true);
                vulpix2.animations.play('idleUp', 4, true);
                vulpix3.animations.play('idleLeft', 4, true);
                break;
        }
    }
    
    
    function petVulpix1() {
        vulpix1.animations.play('idleDown', 4, true);
        vulpix1Caught = true;
    }
    function petVulpix2() {
        vulpix2.animations.play('idleDown', 4, true);
        vulpix2Caught = true;
    }
    function petVulpix3() {
        vulpix3.animations.play('idleDown', 4, true);
        vulpix3Caught = true;
    }
    
    
    function gameOver() {
        music.stop();
        game.state.start("gameOver");
    }
    
    
    function render() {
        // Input debug info
        //game.debug.inputInfo(32, 32);
        //game.debug.spriteInfo(character, 32, 130);
        //game.debug.pointer( game.input.activePointer );
        
        //game.debug.body(character);
        //game.debug.body(vulpix);
    }
    
    
    return {"create": create, "update": update, "render": render};
    
    //console.log("hello");
}

function gameOverState(game) {
    
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
        var music = game.add.audio('VictoryMusic');
        music.volume = 0.01;
        music.play();
    }
    
    function restartGame() {
        game.state.start("mainMenu");
    }
    
    return {"create": create};
}
