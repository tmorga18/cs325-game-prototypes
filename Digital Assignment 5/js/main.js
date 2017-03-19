/*
    PRELOAD:
        - This function is called first. It should contain code to handle the loading of assets needed by your game. I.e. game.load.image(), etc. Note: while 'preload' is running the game doesn't call the update or render functions, instead it calls 2 special functions (if they exist): loadUpdate and loadRender.

        - You don't have to put just loader specific code in the preload function. You could also do things like set the stage background color or scale modes. However to keep it clean and logical I would suggest you do limit it to just loading assets.

        - Note that you don't need to tell Phaser to start the load, it happens automatically.
        
    CREATE:
        - The create function is called automatically once the preload has finished. Equally if you don't actually load any assets at all or don't have a preload function then create is the first function called by Phaser. In here you can safely create sprites, particles and anything else you need that may use assets the preload will now have loaded for you. Typically this function would contain the bulk of your set-up code, creating game objects and the like.
        
    UPDATE:
        - The update (and render) functions are called every frame. So on a desktop that'd be around 60 time per second. In update this is where you'd do things like poll for input to move a player, check for object collision, etc. It's the heart of your game really.

    RENDER:
        - The render function is called AFTER the WebGL/canvas render has taken place, so consider it the place to apply post-render effects or extra debug overlays. For example when building a game I will often put the game into CANVAS mode only and then use the render function to draw lots of debug info over the top of my game.

        - Once render has completed the frame is over and it returns to update again.
*/

'use strict';




/*****************************************************************************************
 ************************************ GLOBAL VARIABLES ***********************************
 *****************************************************************************************/

var introMusic;
var playerName = "";
var musicVolume = 0.1;
var maxVolume = 1.0;
var minVolume = 0.0;
var listOfPokemon = ["Pikachu", "Vulpix"];
var currentPokemon = [];
var pokeball1, pokeball2, pokeball3, pokeball4, pokeball5, pokeball6;
var currentPokeballs = [];

var allNPCs = [];

var allPokemon = [];

/*****************************************************************************************
                                    END OF: GLOBAL VARIABLES
 *****************************************************************************************/




/*****************************************************************************************
 ************************************ WINDOW.ONLOAD **************************************
 *****************************************************************************************/

/*
    WINDOW.ONLOAD:
        - Runs when the page finishes loading

        - Window.onload is only needed if you include your JavaScript at the top of the html page (i.e. in the <head> tag) - you'd do this to load your JavaScript up-front to do something important with your page before it's loaded. If you don't need to do this (which turns out to be the case most of the time) you can put your JavaScript at the bottom of the page (usually just before the closing </body> tag) and this will mean by the time the JavaScript loads, the rest of the page has already loaded.
*/

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

/*****************************************************************************************
                                    END OF: WINDOW.ONLOAD
 *****************************************************************************************/




/*************************************************************************************
 ************************************ BOOT STATE *************************************
 *************************************************************************************/

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

/*****************************************************************************************
                                    END OF: BOOT STATE
 *****************************************************************************************/




/*************************************************************************************
 *********************************** PRELOAD STATE ***********************************
 *************************************************************************************/

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
            game.state.start("main");
            //game.state.start("mainMenu");
        }
    }
    
    function loadUpdate() {
        var preloadProgress = game.load.progress;
        preloadProgressText.setText(preloadProgress);
    }
    
    return {"preload": preload, "create": create, "update": update, "loadUpdate": loadUpdate};
}

/*****************************************************************************************
                                    END OF: PRELOAD STATE
 *****************************************************************************************/




/*************************************************************************************
 ********************************** MAIN MENU STATE **********************************
 *************************************************************************************/

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

/*****************************************************************************************
                                    END OF: MAIN MENU STATE
 *****************************************************************************************/




/*************************************************************************************
 ********************************** INTRO STATE **********************************
 *************************************************************************************/

function introState(game) {
    
    var oak;
    var text;
    var timer = 0;
    var counter = 0;
    var oakText = ["Hello there!", "Welcome to the world of Pokemon.", "My name is Professor Oak.", "What is your name?", " ", " **this will change** ", "This world is populated by creatures\n called Pokemon.", "Your job is to catch them all!", "Your very own Pokemon adventure\n is about to unfold.", "Let's go!", ""];
    
    function create() {
        game.stage.backgroundColor = "#ffffff";
        
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
            if(counter === 4) {
                promptName();
            }
            text.setText(oakText[counter]);
            counter++;
            timer = 0;
        }
    }
    
    function promptName() {
        playerName = prompt("Please enter your name", "");
        
        sessionStorage.setItem("playerName", playerName);
        
        oakText[5] = "Nice to meet you " + playerName + ".";
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

/*****************************************************************************************
                                    END OF: INTRO STATE
 *****************************************************************************************/




/*************************************************************************************
 ********************************** MAIN GAME STATE **********************************
 *************************************************************************************/

function mainGameState(game) {
    
    
    
    
    // World variables
        var music;
    
        var groundLayer;
        var hillsLayer;
        var treesLayer;
        var buildingsLayer;
        var waterAnimatedLayer;
        var riverbankLayer;
        var spawnPointsGroup;
        var friendWaypointsGroup;
        var friendWaypoints = [];
    
        var depthOverLayer;
        var doorsLayer;
        var depthUnderLayer;
        var depthGroup;
    
    
        var mainTextBox;
        var mainTextStyle;
        var mainText;
        var infoText = "";
        var infoStyle;
    
    // Player variables
        var player;
    
        // Movement
        var idle;
        var walkDown;
        var walkRight;
        var walkLeft;
        var walkUp;
        var walkSpeed = 75;

    // Pokemon variables
        // Movement
        var idleDown;
        var idleRight;
        var idleLeft;
        var idleUp;
        var followPlayer = false;
    
    // NPC Variables
        var friend;
        var walkLeftFriend;
        var idleLeftFriend;

    
    
    
    /************************************* CREATE *************************************/
    
    function create() {
        
        // ****************** CREATE WORLD ******************
        
        //  Enlarge our game world to fit all the different levels (the default is to match the game size)
            game.world.setBounds(0, 0, 1600, 600);
        
        // Add the music and then play a random song
            var randomSong = game.rnd.integerInRange(1, 3);
            switch(randomSong) {
                case 1:
                    music = game.add.audio('Music1');
                    music.volume = musicVolume;
                    music.play();
                    break;
                case 2:
                    music = game.add.audio('Music2');
                    music.volume = musicVolume;
                    music.play();
                    break;
                case 3:
                    music = game.add.audio('Music3');
                    music.volume = musicVolume;
                    music.play();
                    break;
            }
        
        // Start the Arcade Physics
            game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Add the tilemap to the game
            var map = game.add.tilemap('tilemap');
            map.addTilesetImage('PokemonTiledAssets', 'tiles');
        
        // Add all the layers to collide with
            groundLayer = map.createLayer('Ground');
            depthOverLayer = map.createLayer('DepthOver');
            doorsLayer = map.createLayer('Doors');
            depthUnderLayer = map.createLayer('DepthUnder');
            hillsLayer = map.createLayer('Hills');
            treesLayer = map.createLayer('Trees');
            buildingsLayer = map.createLayer('Buildings');
            waterAnimatedLayer = map.createLayer('Water Animated');
            riverbankLayer = map.createLayer('RiverBank');
            //hillsLayer.debug = true;
            //treesLayer.debug = true;
            //buildingsLayer.debug = true;
            //riverbankLayer.debug = true;
        
        // Activate the spawn points from the tilemap
            spawnPointsGroup = game.add.group();
            //spawnPointsGroup.enableBody = true;
            map.createFromObjects('SpawnPoints', 248, 'EmptySprite', 0, true, false, spawnPointsGroup);
        
            friendWaypointsGroup = game.add.group();
            map.createFromObjects('FriendWaypoints', 3442, 'PokeballSprite', 0, true, false, friendWaypointsGroup);
        
            for(var i = 0; i < friendWaypointsGroup.length; i++) {
                console.log(friendWaypointsGroup.children[i].name + ": " + friendWaypointsGroup.children[i].x + ", " + friendWaypointsGroup.children[i].y);
            }
        
        // Resize the world to...
            //groundLayer.resizeWorld();
        
        // Turn on the layer' collisions
        map.setCollisionBetween(1, 10000, true, 'Hills');
        map.setCollisionBetween(1, 10000, true, 'Trees');
        map.setCollisionBetween(1, 15000, true, 'Buildings');
        map.setCollisionBetween(1, 15000, true, 'Water Animated');
        
        for(var p = 0; p < 6; p++) {
            currentPokeballs[p] = game.add.image(10 + p * 60, 560, "PokeballSprite");
            currentPokeballs[p].visible = false;
        }
        
        // Create a group so that the player will sort behind objects
        depthGroup = game.add.group();
        depthGroup.add(depthUnderLayer);
        
        
        
        
        // *** CREATE PLAYER ***
            player = game.add.sprite(750, 510, 'RedheadGirlSprite', 0);
            player.name = playerName;
            player.characterType = "NPC";
        
            player.anchor.setTo(0.5, 0.5);
            game.physics.enable(player);
            player.body.setSize(13, 26, 4, 3);
            player.scale.set(0.8);
            player.body.fixedRotation = true;
            //player.body.collideWorldBounds = true;
            depthGroup.add(player);
        
        // Allow the player to mouse over the pokemon to see it's stats
                player.inputEnabled = true;
                player.events.onInputOver.add(info, this);
                player.events.onInputOut.add(infoExit, this);
        
        //game.camera.follow(player);
        
        idle = player.animations.add('idle', [0], 3, true, true);
        walkDown = player.animations.add('walkDown', [2, 3], 3, true, true);
        walkUp = player.animations.add('walkUp', [7, 8], 3, true, true);
        walkLeft = player.animations.add('walkLeft', [12, 13], 3, true, true);
        walkRight = player.animations.add('walkRight', [16, 17], 3, true, true);
        
        //*** PLAYER CONTROLS ***
        
        game.input.keyboard.addKeys( {
            'up': Phaser.KeyCode.W,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A,
            'right': Phaser.KeyCode.D
        });
        
        // *** CREATE POKEMON ***
        
        function Pokemon(name, level, x, y) {
            var pokemon;
            
            // Create pokemon sprite and give spawn it in a random position
                var chooseSpawnPoint = game.rnd.integerInRange(0, spawnPointsGroup.children.length - 1);
                x = spawnPointsGroup.children[chooseSpawnPoint].x;
                y = spawnPointsGroup.children[chooseSpawnPoint].y;
                if(name === "Bulbasaur") {
                    pokemon = game.add.sprite(x, y, "BulbasaurSprite");
                    pokemon.sprite = 'BulbasaurSprite';
                }
                if(name === "Charmander") {
                    pokemon = game.add.sprite(x, y, "CharmanderSprite");
                    pokemon.sprite = 'CharmanderSprite';
                }
                if(name === "Squirtle") {
                    pokemon = game.add.sprite(x, y, "SquirtleSprite");
                    pokemon.sprite = 'SquirtleSprite';
                }
                if(name === "Pikachu") {
                    pokemon = game.add.sprite(x, y, "PikachuSprite");
                    pokemon.sprite = 'PikachuSprite';
                }
                if(name === "Vulpix") {
                    pokemon = game.add.sprite(x, y, "VulpixSprite");
                    pokemon.sprite = 'VulpixSprite';
                }
                spawnPointsGroup.removeChildAt(chooseSpawnPoint);
            
            // Add attributes
                pokemon.name = name;
                pokemon.characterType = "Pokemon";
                pokemon.level = level;
                pokemon.walkSpeed = 25;
                pokemon.horizontalSpeed = 0;
                pokemon.verticalSpeed = 0;
                pokemon.caught = false;
            
            // Add physics
                game.physics.arcade.enable(pokemon);
                pokemon.body.setSize(17, 20, 6, 8);
                pokemon.scale.set(0.8);
                pokemon.body.fixedRotation = true;
                pokemon.anchor.setTo(0.5, 0.5);
                pokemon.body.drag.setTo(500, 500);
                pokemon.body.collideWorldBounds = true;
            
                depthGroup.add(pokemon);
            
            // Allow the player to mouse over the pokemon to see it's stats
                pokemon.inputEnabled = true;
                pokemon.events.onInputOver.add(info, this);
                pokemon.events.onInputOut.add(infoExit, this);

            // Add animations
                var idleDown = pokemon.animations.add('idleDown', [0], 4, true, true);
                var idleUp = pokemon.animations.add('idleUp', [4], 4, true, true);
                var idleLeft = pokemon.animations.add('idleLeft', [8], 4, true, true);
                var idleRight = pokemon.animations.add('idleRight', [12], 4, true, true);
                var walkDown = pokemon.animations.add('walkDown', [2, 3], 4, true, true);
                var walkUp = pokemon.animations.add('walkUp', [6, 7], 4, true, true);
                var walkLeft = pokemon.animations.add('walkLeft', [10, 11], 4, true, true);
                var walkRight = pokemon.animations.add('walkRight', [14, 15], 4, true, true);
                var happy = pokemon.animations.add('happy', [16, 17, 18], 4, true, true);
            
            // Increment a timer, which will then trigger actions and animations
                game.time.events.loop(Phaser.Timer.SECOND, incrementTimer);
                var chooseActionTimer = 2;
                function incrementTimer() {
                    if(pokemon.caught == false) {
                        chooseActionTimer++;
                        if(chooseActionTimer >= 3) {
                            chooseAction();
                            chooseActionTimer = 0;
                        }
                    }
                }
            
            // Function that will choose a random direction, and either idle or move/animate in that direction
                function chooseAction() {
                    var randomAction = game.rnd.integerInRange(1, 8);

                    switch(randomAction) {
                        case 1:
                            pokemon.animations.play('idleDown', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 2:
                            pokemon.animations.play('idleUp', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 3:
                            pokemon.animations.play('idleLeft', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 4:
                            pokemon.animations.play('idleRight', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 5:
                            pokemon.animations.play('walkDown', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = pokemon.walkSpeed;
                            break;
                        case 6:
                            pokemon.animations.play('walkUp', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = -pokemon.walkSpeed;
                            break;
                        case 7:
                            pokemon.animations.play('walkLeft', 4, true);
                            pokemon.horizontalSpeed = -pokemon.walkSpeed;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 8:
                            pokemon.animations.play('walkRight', 4, true);
                            pokemon.horizontalSpeed = pokemon.walkSpeed;
                            pokemon.verticalSpeed = 0;
                            break;
                    }
                }
            
            // Update function for the pokemon
                pokemon.update = function() {
                    pokemon.body.velocity.x = pokemon.horizontalSpeed;
                    pokemon.body.velocity.y = pokemon.verticalSpeed;

                    if(pokemon.caught === true) {
                        if(game.physics.arcade.distanceBetween(pokemon, player) > 50) {
                            game.physics.arcade.moveToXY(pokemon, player.x, player.y);
                        }
                    }
                };
            
            return pokemon;
        }
        
        allPokemon[0] = new Pokemon('Bulbasaur', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[1] = new Pokemon('Charmander', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[2] = new Pokemon('Squirtle', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[3] = new Pokemon('Pikachu', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[4] = new Pokemon('Vulpix', game.rnd.integerInRange(1, 4), 0, 0);
        
        
        // ****************** CREATE NPCs ******************
        
        // Friend
        
        function NPC(name, npcSprite,  x, y) {
            var npc;
            
            // Create the NPC
                npc = game.add.sprite(x, y, npcSprite);
            
            // Add attributes
                npc.name = name;
                npc.characterType = "NPC";
                npc.sprite = npcSprite;
                npc.walkSpeed = 25;
                npc.horizontalSpeed = 0;
                npc.verticalSpeed = 0;
                npc.wandering = false;
                npc.text = "You need to capture a Pokemon\n before you head out of town!";
            
            // Add physics
                game.physics.arcade.enable(npc);
                npc.scale.set(0.5);
                npc.anchor.setTo(0.5, 0.5);
                npc.body.fixedRotation = true;
                npc.body.immovable = true;
                depthGroup.add(npc);
            
            // Allow the player to mouse over the pokemon to see it's stats
                npc.inputEnabled = true;
                npc.events.onInputOver.add(info, this);
                npc.events.onInputOut.add(infoExit, this);

            // Add animations
                var idleLeft = npc.animations.add('idleLeft', [4], 3, true, true);
                var walkLeft = npc.animations.add('walkLeft', [5, 6, 7], 3, true, true);
            
            // Increment a timer, which will then trigger actions and animations
                game.time.events.loop(Phaser.Timer.SECOND, incrementTimer);
                var chooseActionTimer = 2;
                function incrementTimer() {
                    if(npc.wandering === true) {
                        chooseActionTimer++;
                        if(chooseActionTimer >= 3) {
                            chooseAction();
                            chooseActionTimer = 0;
                        }
                    }
                }
            
            // Function that will choose a random direction, and either idle or move/animate in that direction
                function chooseAction() {
                    var randomAction = game.rnd.integerInRange(1, 2);

                    switch(randomAction) {
                        case 1:
                            npc.animations.play('idleLeft', 4, true);
                            npc.horizontalSpeed = 0;
                            npc.verticalSpeed = 0;
                            break;
                        case 2:
                            npc.animations.play('walkLeft', 4, true);
                            npc.horizontalSpeed = 0;
                            npc.verticalSpeed = 0;
                            break;
                    }
                }
            
            // Update function for the pokemon
                npc.update = function() {
                    //npc.body.velocity.x = npc.horizontalSpeed;
                    //npc.body.velocity.y = npc.verticalSpeed;
                };
            
            return npc;
        }
        
        friend = new NPC('Thomas', 'BoySprite', 790, 510);
        friend.animations.play('idleLeft', 4, true);
        
        
        depthGroup.add(depthOverLayer);
        
        
        // Add the text box
            mainTextBox = game.add.image(game.width / 2, game.height / 2, "TextBox");
            mainTextBox.scale.set(1);
            mainTextBox.anchor.setTo(0.5, 0.5);
            mainTextBox.alpha = 0.5;
            mainTextBox.visible = false;
        
            mainTextStyle = { font: "18px Verdana", fill: "#111111", align: "center" };
        
            mainText = game.add.text(mainTextBox.x, mainTextBox.y, "", mainTextStyle);
            mainText.stroke = '#000000';
            mainText.strokeThickness = 1;
            mainText.anchor.setTo(0.5, 0.5);
        
        // Add the info text
            var infoTextBox = game.add.image(700, 562, "TextBox");
            infoTextBox.scale.set(0.3);
            infoTextBox.anchor.setTo(0.5, 0.5);
            infoTextBox.alpha = 0.5;
            infoTextBox.visible = false;
        
            var infoStyle = { font: "18px Verdana", fill: "#111111", align: "center" };
        
            var infoText = game.add.text(700, 565, "", infoStyle);
            infoText.stroke = '#000000';
            infoText.strokeThickness = 1.5;
            infoText.anchor.setTo(0.5, 0.5);
        
            function info(character) {
                if(character.characterType === "NPC") {
                    infoText.setText(character.name);
                    infoTextBox.visible = true;
                } else if(character.characterType === "Pokemon") {
                    infoText.setText(character.name + "\n Level: " + character.level);
                    infoTextBox.visible = true;
                }
            }
            function infoExit(character) {
                infoText.setText("");
                infoTextBox.visible = false;
            }
    }
    
    
    /***************************** UPDATE *****************************/
    
    function update() {
        
        if(player.position.x > 0 && player.position.x < 800) {
            game.camera.x = 500;
        } else if(player.position.x > 800 && player.position.x < 1600) {
            game.camera.x = 800;
        }
        
        // Collision between player and pokemon
            for(var i = 0; i < allPokemon.length; i++) {
                game.physics.arcade.collide(player, allPokemon[i], catchPokemon);
            }
        
        // Collision between player and world
            game.physics.arcade.collide(player, hillsLayer);
            game.physics.arcade.collide(player, treesLayer);
            game.physics.arcade.collide(player, buildingsLayer);
            game.physics.arcade.collide(player, waterAnimatedLayer);
        
        // Collision between player and friend
            if(game.physics.arcade.collide(player, friend, NPCMoveToDestination)) {
                if(currentPokemon.length >= 1) {
                    friend.body.immovable = false;
                    //friend.horizontalSpeed = 50;
                    
                    
                } else {
                    mainTextBox.visible = true;
                    mainText.setText(friend.text);
                }
            } else {
                mainTextBox.visible = false;
                mainText.setText("");
            }
        
        // Collision between pokemon and the world
            for(var i = 0; i < allPokemon.length; i++) {
                game.physics.arcade.collide(allPokemon[i], hillsLayer, allPokemon[i].chooseAction);
                game.physics.arcade.collide(allPokemon[i], treesLayer, allPokemon[i].chooseAction);
                game.physics.arcade.collide(allPokemon[i], buildingsLayer, allPokemon[i].chooseAction);
                game.physics.arcade.collide(allPokemon[i], waterAnimatedLayer, allPokemon[i].chooseAction);

                // Collision between all pokemon
                for(var j = 0; j < allPokemon.length; j++) {
                    game.physics.arcade.collide(allPokemon[i], allPokemon[j]);
                }
            }
        
        // Stop the player from running off
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        

        // Player movement controls
            if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                player.body.velocity.y = -walkSpeed;
                player.animations.play('walkUp', 4, true);
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                player.body.velocity.y = walkSpeed;
                player.animations.play('walkDown', 4, true);
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                player.body.velocity.x = -walkSpeed;
                player.animations.play('walkLeft', 4, true);
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                player.body.velocity.x = walkSpeed;
                player.animations.play('walkRight', 4, true);
            } else {
                player.animations.play('idle', 4, true);
            }
    }
    
    
    function catchPokemon(player, pokemon) {
        if(pokemon.caught === false && currentPokemon.length <= 6) {
            // Add the music and then play it
            music.pause();
            var pokemonCaughtAudio = game.add.audio('PokemonCaughtAudio');
            pokemonCaughtAudio.volume = musicVolume;
            pokemonCaughtAudio.play();
            pokemonCaughtAudio.onStop.add(resumeMusic, this);
            
            pokemon.animations.play('happy', 4, true);
            pokemon.horizontalSpeed = 0;
            pokemon.verticalSpeed = 0;
            
            var ballLevelStyle = { font: "20px Verdana", fill: "#111111", align: "center" };
            var ballLevelText = game.add.text(currentPokeballs[currentPokemon.length].x + 20, currentPokeballs[currentPokemon.length].y - 35, "Lvl " + pokemon.level, ballLevelStyle);
            ballLevelText.anchor.setTo(0.5, 0.5);
            var ballPokemonImage = game.add.image(currentPokeballs[currentPokemon.length].x + 16, currentPokeballs[currentPokemon.length].y - 15, pokemon.sprite);
            ballPokemonImage.anchor.setTo(0.5, 0.5);
            
            currentPokeballs[currentPokemon.length].visible = true;
            currentPokemon[currentPokemon.length] = pokemon;
            pokemon.caught = true;
            
            if(currentPokemon.length >= allPokemon.length) {
                game.physics.arcade.moveToXY(friend, 760, 510);
            }
        }
    }
    
    
    function NPCMoveToDestination() {
        console.log(friendWaypointsGroup.length);
        
        for(var i = 0; i < friendWaypointsGroup.length; i++) {
            var dest = friendWaypointsGroup.children[i];
            
            console.log(dest.name);

            game.physics.arcade.moveToXY(friend, dest.x, dest.y);

            if(game.physics.arcade.distanceBetween(friend, dest) < 5) {
                console.log("hello");
            }
        }
    }
    
    
    function resumeMusic() {
        music.resume();
    }
    
    
    function render() {
        // Input debug info
        //game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.inputInfo(32, 32);
        //game.debug.spriteInfo(player, 32, 130);
        game.debug.pointer( game.input.activePointer );
        
        //game.debug.body(player);
        //game.debug.body(allPokemon[0]);
        //game.debug.body(allPokemon[1]); 
    }
    
    
    return {"create": create, "update": update, "render": render};
}

/*****************************************************************************************
                                    END OF: MAIN GAME STATE
 *****************************************************************************************/




/*************************************************************************************
 ********************************** GAME OVER STATE **********************************
 *************************************************************************************/

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

/*****************************************************************************************
                                    END OF: GAME OVER STATE
 *****************************************************************************************/
