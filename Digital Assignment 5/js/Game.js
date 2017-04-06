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
        var infoTextBox;
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
    
    // NPC Variables
        var friend;
        var walkLeftFriend;
        var idleLeftFriend;

    
    
    
    
    
    
    
    /************************************* CREATE *************************************/
    
    function create() {
        
        // ****************** CREATE WORLD ******************
        
        //  Enlarge our game world to fit all the different levels (the default is to match the game size)
            game.world.setBounds(0, 0, 1600, 600);
        
        addMusic();
        
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
        
            /*for(var i = 0; i < friendWaypointsGroup.length; i++) {
                console.log(friendWaypointsGroup.children[i].name + ": " + friendWaypointsGroup.children[i].x + ", " + friendWaypointsGroup.children[i].y);
                friendWaypointsGroup.children[i].anchor.setTo(0.5, 0.5);
            }*/
    
        
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
        player = game.add.sprite(750, 510, 'ProfessorOakSprite', 0);
        player.name = playerName;
        player.characterType = "NPC";

        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player);
        player.body.setSize(13, 26, 4, 3);
        player.scale.set(1);
        player.body.fixedRotation = true;
        //player.body.collideWorldBounds = true;
        depthGroup.add(player);
        
        // Allow the player to mouse over the pokemon to see it's stats
        player.inputEnabled = true;
        player.events.onInputOver.add(characterInfo, this);
        player.events.onInputOut.add(characterInfoExit, this);
        
        //game.camera.follow(player);
        
        idle = player.animations.add('idle', [0], 3, true, true);
        //var idleDown = pokemon.sprite.animations.add('idleDown', [0], 4, true, true);
        //var idleUp = pokemon.sprite.animations.add('idleUp', [4], 4, true, true);
        //var idleLeft = pokemon.sprite.animations.add('idleLeft', [8], 4, true, true);
        //var idleRight = pokemon.sprite.animations.add('idleRight', [12], 4, true, true);
        walkDown = player.animations.add('walkDown', [1, 2], 3, true, true);
        walkUp = player.animations.add('walkUp', [4, 5], 3, true, true);
        walkLeft = player.animations.add('walkLeft', [7, 8], 3, true, true);
        walkRight = player.animations.add('walkRight', [10, 11], 3, true, true);
        
        //*** PLAYER CONTROLS ***
        
        game.input.keyboard.addKeys( {
            'up': Phaser.KeyCode.W,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A,
            'right': Phaser.KeyCode.D
        });
        
        // ****************** CREATE NPCs ******************
        function NPC(name, spriteName,  x, y) {
            var npc = {};

            // Create the NPC
                npc.sprite = game.add.sprite(x, y, spriteName);

            // Add attributes
                npc.characterType = "NPC";
                npc.name = name;
                npc.spriteName = spriteName;
                npc.wandering = false;
                npc.walkSpeed = 25;
                npc.horizontalSpeed = 0;
                npc.verticalSpeed = 0;
                npc.text = "You need to capture a Pokemon\n before you head out of town!";

            // Add physics
                game.physics.arcade.enable(npc.sprite);
                npc.sprite.scale.set(0.5);
                npc.sprite.anchor.setTo(0.5, 0.5);
                npc.sprite.body.fixedRotation = true;
                npc.sprite.body.immovable = true;
                depthGroup.add(npc.sprite);

            // Allow the player to mouse over the pokemon to see it's stats
                npc.sprite.inputEnabled = true;
                npc.sprite.events.onInputOver.add(characterInfo, this);
                npc.sprite.events.onInputOut.add(characterInfoExit, this);

            // Add animations
                var idleLeft = npc.sprite.animations.add('idleLeft', [4], 3, true, true);
                var walkLeft = npc.sprite.animations.add('walkLeft', [5, 6, 7], 3, true, true);

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
                            npc.sprite.animations.play('idleLeft', 4, true);
                            npc.horizontalSpeed = 0;
                            npc.verticalSpeed = 0;
                            break;
                        case 2:
                            npc.sprite.animations.play('walkLeft', 4, true);
                            npc.horizontalSpeed = 0;
                            npc.verticalSpeed = 0;
                            break;
                    }
                }

            // Function that..
                var dest = friendWaypointsGroup.children[0];

                var i = 0;
                function chooseDestination() {
                    console.log(friendWaypointsGroup.length);

                    if(i < friendWaypointsGroup.length) {
                        dest = friendWaypointsGroup.children[i];
                        console.log(dest.name);

                        game.physics.arcade.moveToXY(friend, dest.x, dest.y);
                    }
                }

            // Update function for the npc
                npc.update = function() {
                    //npc.body.velocity.x = npc.horizontalSpeed;                    //npc.body.velocity.y = npc.verticalSpeed;
                    if(game.physics.arcade.distanceBetween(npc, dest) < 5) {
                            console.log("hello");
                            i++;
                            friend.body.velocity.x = 0;
                            friend.body.velocity.y = 0;
                            chooseDestination();
                        }
                };
            return npc;
        }
    
    
        
        
        allPokemon[0] = Pokemon('Bulbasaur', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[1] = Pokemon('Charmander', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[2] = Pokemon('Squirtle', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[3] = Pokemon('Pikachu', game.rnd.integerInRange(1, 4), 0, 0);
        allPokemon[4] = Pokemon('Vulpix', game.rnd.integerInRange(1, 4), 0, 0);
        
        friend = NPC('Thomas', 'BoySprite', 790, 510);
        friend.sprite.animations.play('walkLeft', 4, true);
        //friend.chooseDestination;
        
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
            infoTextBox = game.add.image(700, 562, "TextBox");
            infoTextBox.scale.set(0.3);
            infoTextBox.anchor.setTo(0.5, 0.5);
            infoTextBox.alpha = 0.5;
            infoTextBox.visible = false;
        
            infoStyle = { font: "18px Verdana", fill: "#111111", align: "center" };
        
            infoText = game.add.text(700, 565, "", infoStyle);
            infoText.stroke = '#000000';
            infoText.strokeThickness = 1.5;
            infoText.anchor.setTo(0.5, 0.5);
        
    }
    
    
    
    
    
    
    
    
    /***************************** UPDATE *****************************/
    function update() {
        if(player.position.x > 0 && player.position.x < 800) {
            game.camera.x = 200;
        } else if(player.position.x > 800 && player.position.x < 1600) {
            game.camera.x = 800;
        }
        
        // Collision between player and pokemon
            for(var i = 0; i < allPokemon.length; i++) {
                game.physics.arcade.collide(player, allPokemon[i].sprite, allPokemon[i].catchPokemon);
            }
        
        // Collision between player and world
            game.physics.arcade.collide(player, hillsLayer);
            game.physics.arcade.collide(player, treesLayer);
            game.physics.arcade.collide(player, buildingsLayer);
            game.physics.arcade.collide(player, waterAnimatedLayer);
        
        // Collision between player and friend
            /*if(game.physics.arcade.collide(player, friend)) {
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
            }*/
        
        // Collision between pokemon and the world
            for(var i = 0; i < allPokemon.length; i++) {
                game.physics.arcade.collide(allPokemon[i].sprite, hillsLayer);
                game.physics.arcade.collide(allPokemon[i].sprite, treesLayer);
                game.physics.arcade.collide(allPokemon[i].sprite, buildingsLayer);
                game.physics.arcade.collide(allPokemon[i].sprite, waterAnimatedLayer);

                // Collision between all pokemon
                for(var j = 0; j < allPokemon.length; j++) {
                    game.physics.arcade.collide(allPokemon[i].sprite, allPokemon[j].sprite);
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
    
    
    // *** CREATE POKEMON ***
        function Pokemon(name, level, x, y) {
            var pokemon = {};

            // Create pokemon sprite and give spawn it in a random position
                var chooseSpawnPoint = game.rnd.integerInRange(0, spawnPointsGroup.children.length - 1);
                x = spawnPointsGroup.children[chooseSpawnPoint].x;
                y = spawnPointsGroup.children[chooseSpawnPoint].y;
                if(name === "Bulbasaur") {
                    pokemon.sprite = game.add.sprite(x, y, "BulbasaurSprite");
                    pokemon.spriteName = 'BulbasaurSprite';
                }
                if(name === "Charmander") {
                    pokemon.sprite = game.add.sprite(x, y, "CharmanderSprite");
                    pokemon.spriteName = 'CharmanderSprite';
                }
                if(name === "Squirtle") {
                    pokemon.sprite = game.add.sprite(x, y, "SquirtleSprite");
                    pokemon.spriteName = 'SquirtleSprite';
                }
                if(name === "Pikachu") {
                    pokemon.sprite = game.add.sprite(x, y, "PikachuSprite");
                    pokemon.spriteName = 'PikachuSprite';
                }
                if(name === "Vulpix") {
                    pokemon.sprite = game.add.sprite(x, y, "VulpixSprite");
                    pokemon.spriteName = 'VulpixSprite';
                }
                spawnPointsGroup.removeChildAt(chooseSpawnPoint);

            // Add attributes
                pokemon.characterType = "Pokemon";
                pokemon.name = name;
                pokemon.level = level;
                pokemon.caught = false;
                pokemon.walkSpeed = 25;
                pokemon.horizontalSpeed = 0;
                pokemon.verticalSpeed = 0;

            // Add physics
                game.physics.arcade.enable(pokemon.sprite);
                pokemon.sprite.body.setSize(17, 20, 6, 8);
                pokemon.sprite.scale.set(0.8);
                pokemon.sprite.body.fixedRotation = true;
                pokemon.sprite.anchor.setTo(0.5, 0.5);
                pokemon.sprite.body.drag.setTo(500, 500);
                pokemon.sprite.body.collideWorldBounds = true;

                depthGroup.add(pokemon.sprite);

            // Allow the player to mouse over the pokemon to see it's stats
                pokemon.sprite.inputEnabled = true;
                pokemon.sprite.events.onInputOver.add(characterInfo, pokemon);
                pokemon.sprite.events.onInputOut.add(characterInfoExit, pokemon);

            // Add animations
                var idleDown = pokemon.sprite.animations.add('idleDown', [0], 4, true, true);
                var idleUp = pokemon.sprite.animations.add('idleUp', [4], 4, true, true);
                var idleLeft = pokemon.sprite.animations.add('idleLeft', [8], 4, true, true);
                var idleRight = pokemon.sprite.animations.add('idleRight', [12], 4, true, true);
                var walkDown = pokemon.sprite.animations.add('walkDown', [2, 3], 4, true, true);
                var walkUp = pokemon.sprite.animations.add('walkUp', [6, 7], 4, true, true);
                var walkLeft = pokemon.sprite.animations.add('walkLeft', [10, 11], 4, true, true);
                var walkRight = pokemon.sprite.animations.add('walkRight', [14, 15], 4, true, true);
                var happy = pokemon.sprite.animations.add('happy', [16, 17, 18], 4, true, true);

            // Increment a timer, which will then trigger actions and animations
                game.time.events.loop(Phaser.Timer.SECOND, incrementTimer, pokemon);
            
                function incrementTimer() {
                    var chooseActionTimer = 2;
                    
                    if(pokemon.caught === false) {
                        chooseActionTimer++;
                        if(chooseActionTimer >= 3) {
                            pokemon.chooseAction();
                            chooseActionTimer = 0;
                        }
                    }
                }

            // Function that will choose a random direction, and either idle or move/animate in that direction
            // Can also declare it like this:
            pokemon.chooseAction = function() {
               //function chooseAction() {
                    var randomAction = game.rnd.integerInRange(1, 8);

                    switch(randomAction) {
                        case 1:
                            pokemon.sprite.animations.play('idleDown', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 2:
                            pokemon.sprite.animations.play('idleUp', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 3:
                            pokemon.sprite.animations.play('idleLeft', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 4:
                            pokemon.sprite.animations.play('idleRight', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 5:
                            pokemon.sprite.animations.play('walkDown', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = pokemon.walkSpeed;
                            break;
                        case 6:
                            pokemon.sprite.animations.play('walkUp', 4, true);
                            pokemon.horizontalSpeed = 0;
                            pokemon.verticalSpeed = -pokemon.walkSpeed;
                            break;
                        case 7:
                            pokemon.sprite.animations.play('walkLeft', 4, true);
                            pokemon.horizontalSpeed = -pokemon.walkSpeed;
                            pokemon.verticalSpeed = 0;
                            break;
                        case 8:
                            pokemon.sprite.animations.play('walkRight', 4, true);
                            pokemon.horizontalSpeed = pokemon.walkSpeed;
                            pokemon.verticalSpeed = 0;
                            break;
                    }
                }
            
            pokemon.catchPokemon = function(player, pokemonSprite) {
                if(pokemon.caught === false && currentPokemon.length <= 6) {
                    console.log('caught!');
                    // Add the music and then play it
                    music.pause();
                    var pokemonCaughtAudio = game.add.audio('PokemonCaughtAudio');
                    pokemonCaughtAudio.volume = musicVolume;
                    pokemonCaughtAudio.play();
                    pokemonCaughtAudio.onStop.add(resumeMusic, this);

                    pokemon.sprite.animations.play('happy', 4, true);
                    pokemon.horizontalSpeed = 0;
                    pokemon.verticalSpeed = 0;

                    var ballLevelStyle = { font: "20px Verdana", fill: "#111111", align: "center" };
                    var ballLevelText = game.add.text(currentPokeballs[currentPokemon.length].x + 20, currentPokeballs[currentPokemon.length].y - 35, "Lvl " + pokemon.level, ballLevelStyle);
                    ballLevelText.anchor.setTo(0.5, 0.5);
                    var ballPokemonImage = game.add.image(currentPokeballs[currentPokemon.length].x + 16, currentPokeballs[currentPokemon.length].y - 15, pokemon.spriteName);
                    ballPokemonImage.anchor.setTo(0.5, 0.5);

                    currentPokeballs[currentPokemon.length].visible = true;
                    currentPokemon[currentPokemon.length] = pokemon;
                    pokemon.caught = true;

                    if(currentPokemon.length >= allPokemon.length) {
                        //game.physics.arcade.moveToXY(friend, 760, 510);
                    }
                }
            }

            // Update function for the pokemon
                pokemon.sprite.update = function update() {
                    pokemon.sprite.body.velocity.x = pokemon.horizontalSpeed;
                    pokemon.sprite.body.velocity.y = pokemon.verticalSpeed;
                    if(pokemon.caught === true) {
                        if(game.physics.arcade.distanceBetween(pokemon.sprite, player) > 50) {
                            game.physics.arcade.moveToXY(pokemon.sprite, player.x, player.y);
                        }
                    }
                }
            return pokemon;
        }
    
    
    function characterInfo(character) {
                if(character.characterType === "NPC") {
                    infoText.setText(character.name);
                    infoTextBox.visible = true;
                } else if(character.characterType === "Pokemon") {
                    infoText.setText(character.name + "\n Level: " + character.level);
                    infoTextBox.visible = true;
                }
            }
        
            function characterInfoExit(character) {
                infoText.setText("");
                infoTextBox.visible = false;
            }
    
    
    // Add the music and then play a random song
    function addMusic() {
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
    }
    
    
    function resumeMusic() {
        music.resume();
    }
    
    
    function render() {
        // Input debug info
        //game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.inputInfo(32, 32);
        //game.debug.spriteInfo(player, 32, 130);
        //game.debug.pointer( game.input.activePointer );
        
        //game.debug.body(player);
        //game.debug.body(allPokemon[0]);
        //game.debug.body(allPokemon[1]); 
    }
    
    
    return {"create": create, "update": update, "render": render};
}