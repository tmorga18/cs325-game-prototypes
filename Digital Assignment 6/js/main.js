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
    
    function preload() {
        // *** MAIN MENU***
        game.load.image('MainMenuBackground', 'assets/Main Menu/PeonPoster.jpg' );
        game.load.audio('Music', ['assets/Main Menu/Warcraft 3 Soundtrack - Orc.mp3']);
        game.load.spritesheet('StartGameButton', 'assets/Main Menu/StartButton.png', 250, 29, 3);
        
        
        // *** WORLD ***
        game.load.image('GrassSprite', 'assets/World/GrassSprite.jpg' );
        game.load.spritesheet('TreeSprite', 'assets/World/Pine-Tree-Sprite.png', 141, 223);
        game.load.spritesheet('House', 'assets/World/houses.png', 160, 160);
        
        // *** PLAYER ***
        game.load.spritesheet('Lumberjack', 'assets/Characters/GoblinLumberjack.png', 64, 65);
        
        // *** UI ***
        game.load.image('OrcSprite', 'assets/World/Orc.png');
        game.load.image('PeonSprite', 'assets/World/Peon.png');
        game.load.image('RedX', 'assets/World/RedX.png');
        game.load.spritesheet('UpgradeButton', 'assets/World/UpgradeButton.png', 85, 85);
    }
    
    function create() {
        game.state.start("mainMenu");
    }
    
    function update() {
        
    }
    
    return {"preload": preload, "create": create, "update": update};
}

/*****************************************************************************************
                                    END OF: PRELOAD STATE
 *****************************************************************************************/




/*************************************************************************************
 ********************************** MAIN MENU STATE **********************************
 *************************************************************************************/

function mainMenuState(game) {
    
    function create() {
        var background = game.add.sprite(game.width / 2, game.height / 2, 'MainMenuBackground');
        background.width = game.width / 1.5;
        background.height = game.height;
        background.anchor.setTo(0.5, 0.5);
        
        // Add the New Game Button
        var startGameButton = game.add.button(game.width / 2, 570, 'StartGameButton', startGame, this, 3, 1, 2, 3);
        startGameButton.anchor.setTo(0.5, 0.5);
        
        startGameButton.alpha = 0;
        game.add.tween(startGameButton).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 3000);
        
        // Add the music and then play it
        var music = game.add.audio('Music');
        music.volume = 0.1;
        music.play();
    }
    
    function update() {
        
    }
    
    function startGame() {
        game.state.start("intro");
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
    
    var textStyle;
    var text;
    
    var orc;
    var peon;
    
    function create() {
        /*var graphics = game.add.graphics(100, 300);
        
        graphics.lineStyle(10, 0xffffff, 1);
        graphics.drawRect(0, -150, 600, 300);
        
        graphics.lineStyle(300, 0x111111, 0.9);
        graphics.moveTo(0, 0);
        graphics.lineTo(600, 0);
        
        window.graphics = graphics;*/
        
        textStyle = { font: "26px Verdana", fill: "#ffffff", align: "left" };
        text = game.add.text(260, game.height / 2, "", textStyle);
        text.anchor.setTo(0.5, 0.5);
        
        game.time.events.add(Phaser.Timer.SECOND * 1, orc, this);
    }
    
    function orc() {
        text.setText("Son, I must prepare for war.\n\nI need you to build us\na temporary home here.");
        
        orc = game.add.sprite(630, 300, 'OrcSprite');
        orc.anchor.set(0.5, 0.5);
        orc.scale.set(0.5);
        
        game.time.events.add(Phaser.Timer.SECOND * 4, peon, this);
    }
    
    function peon() {
        orc.alpha = 0;
        
        text.x = 460;
        text.setText("Zug zug father.");
        
        peon = game.add.sprite(230, 300, 'PeonSprite');
        peon.anchor.set(0.5, 0.5);
        peon.scale.set(0.5);
        
        game.time.events.add(Phaser.Timer.SECOND * 4, startGame, this);
    }
    
    function startGame() {
        game.state.start("main");
    }
    
    return {"create": create, "startGame": startGame};
}

/*****************************************************************************************
                                    END OF: INTRO STATE
 *****************************************************************************************/




/*************************************************************************************
 ********************************** MAIN GAME STATE **********************************
 *************************************************************************************/

function mainGameState(game) {
    
    
    // World variables
    var house;
    var houseFrame0, houseFrame1, houseFrame2, houseFrame3;
    
    var treeFull, treeStump;
    var wood = 0;
    var woodInHand = 0;
    var woodTextStyle;
    var woodText;
    var woodGainedTextStyle;
    var woodGainedText;
    var currentTree;
    
    // Player Variables
    var player;
    var walkSpeed = 75;
    var idleDown, idleUp, idleLeft, idleRight;
    var walkDown, walkUp, walkLeft, walkRight;
    var chopDown, chopUp, chopLeft, chopRight;
    var walkWoodDown, walkWoodUp, walkWoodLeft, walkWoodRight;
    var idleWoodDown, idleWoodUp, idleWoodLeft, idleWoodRight;
    var direction;
    var chopping = false;
    var timer = 0;
    
    // *** UI ***
    var messageText;
    
    var redX;
    var upgradeButton;
    var upgradeNum = 0;
    
    var depthGroup;
    
    var gameOverBool = false;
    
    /************************************* CREATE *************************************/
    
    function create() {
        
        // *** ADD PHYSICS ***
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = "#ffffff";
        
        var grassSprite = game.add.tileSprite(0, 0, game.width, game.height, 'GrassSprite');
        
        house = game.add.sprite(game.width / 2, game.height / 2, 'House', 0);
        house.scale.set(1.5);
        house.anchor.setTo(0.5, 0.8);
        game.physics.enable(house);
        house.body.setSize(60, 5, 50, 110);
        house.body.immovable = true;
        house.inputEnabled = true;
        house.input.useHandCursor = true;
        
        houseFrame0 = house.animations.add('houseFrame0', [0], 0, true, true);
        houseFrame1 = house.animations.add('houseFrame1', [1], 0, true, true);
        houseFrame2 = house.animations.add('houseFrame2', [2], 0, true, true);
        houseFrame3 = house.animations.add('houseFrame3', [3], 0, true, true);
        
        depthGroup = game.add.group();
        
        function Tree(x, y) {
            var tree = game.add.sprite(x, y, 'TreeSprite');
            
            treeFull = tree.animations.add('tree', [0], 0, true, true);
            treeStump = tree.animations.add('treeStump', [1], 0, true, true);
            
            tree.anchor.setTo(0.5, 0.8);
            game.physics.enable(tree);
            tree.body.setSize(80, 30, 30, 150);
            tree.body.immovable = true;
            tree.inputEnabled = true;
            tree.input.useHandCursor = true;
            depthGroup.add(tree);
            tree.amountOfWood = game.rnd.integerInRange(5, 15);
            return tree;
        }
        
        var tree1 = new Tree(650, 200);
        currentTree = tree1;
        var tree2 = new Tree(750, 300);
        var tree3 = new Tree(100, 200);
        var tree4 = new Tree(120, 420);
        var tree5 = new Tree(650, 550);
        var tree5 = new Tree(400, 100);
        
        game.time.events.loop(Phaser.Timer.SECOND, gainWood);
        
        //*** CREATE PLAYER ***
        
        player = game.add.sprite(game.width / 2, game.height / 2 + 100, 'Lumberjack', 0);
        player.anchor.setTo(0.5, 0.5);
        player.scale.set(2);
        
        game.physics.enable(player);
        player.body.setSize(30, 35, 18, 13);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;
        
        depthGroup.add(player);
        
        //*** PLAYER ANIMATIONS ***
        
        idleDown = player.animations.add('idleDown', [152, 153, 154, 155], 3, true, true);
        idleUp = player.animations.add('idleUp', [0, 1, 2, 3], 3, true, true);
        idleLeft = player.animations.add('idleLeft', [228, 229, 230, 231], 3, true, true);
        idleRight = player.animations.add('idleRight', [76, 77, 78, 79], 3, true, true);
        
        walkDown = player.animations.add('walkDown', [156, 157, 158, 159, 160, 161, 162, 163], 3, true, true);
        walkUp = player.animations.add('walkUp', [4, 5, 6, 7, 8, 9, 10, 11], 3, true, true);
        walkLeft = player.animations.add('walkLeft', [232, 233, 234, 235, 236, 237, 238, 239], 3, true, true);
        walkRight = player.animations.add('walkRight', [80, 81, 82, 83, 84, 85, 86, 87], 3, true, true);
        
        chopDown = player.animations.add('chopDown', [172, 173, 174, 175, 176, 177], 8, true, true);
        chopUp = player.animations.add('chopUp', [20, 21, 22, 23, 24, 25], 8, true, true);
        chopLeft = player.animations.add('chopLeft', [248, 249, 250, 251, 252, 253], 8, true, true);
        chopRight = player.animations.add('chopRight', [96, 97, 98, 99, 100, 101], 8, true, true);
        
        walkWoodDown = player.animations.add('walkWoodDown', [164, 165, 166, 167, 168, 169, 170, 171], 8, true, true);
        walkWoodUp = player.animations.add('walkWoodUp', [12, 13, 14, 15, 16, 17, 18, 19], 8, true, true);
        walkWoodLeft = player.animations.add('walkWoodLeft', [240, 241, 242, 243, 244, 245, 246, 247], 8, true, true);
        walkWoodRight = player.animations.add('walkWoodRight', [88, 89, 90, 91, 92, 93, 94, 95], 8, true, true);
        
        idleWoodDown = player.animations.add('idleWoodDown', [178, 179], 8, true, true);
        idleWoodUp = player.animations.add('idleWoodUp', [26, 27], 8, true, true);
        idleWoodLeft = player.animations.add('idleWoodLeft', [254, 255], 8, true, true);
        idleWoodRight = player.animations.add('idleWoodRight', [102, 103], 8, true, true);
        
        player.animations.play('idleDown', 4, true);
        
        
        // *** PLAYER ACTIONS ***
        game.input.onDown.add(movePlayer, this);
        
        function movePlayer() {
            if(gameOverBool === false) { 
                if(game.input.mousePointer.y > 40) {
                    redX.alpha = 0.9;

                    chopping = false;
                    redX.x = game.input.mousePointer.x;
                    redX.y = game.input.mousePointer.y;
                    game.physics.arcade.moveToXY(player, redX.x, redX.y, 75);

                    game.add.tween(redX).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
                }
            }
        }

        depthGroup.sort();
        
        
        // *** UI ***
        
        var graphics = game.add.graphics(0, 15);
        
        graphics.lineStyle(50, 0x3f2815);
        graphics.moveTo(0,0);
        graphics.lineTo(800, 0);
        
        graphics.lineStyle(30, 0x6e514c);
        graphics.moveTo(5, 5);
        graphics.lineTo(195, 5);
        
        graphics.lineStyle(30, 0xffffff);
        graphics.moveTo(game.width / 2 - 200, 5);
        graphics.lineTo(game.width / 2 + 200, 5);
        
        graphics.lineStyle(30, 0x6e514c);
        graphics.moveTo(605, 5);
        graphics.lineTo(795, 5);
        
        window.graphics = graphics;
        
        var messageTextStyle = { font: "16px Verdana", fill: "#000000", align: "center" };
        messageText = game.add.text(game.width / 2, 22, "", messageTextStyle);
        messageText.anchor.setTo(0.5, 0.5);
        
        var treeIcon = game.add.sprite(30, 28, 'TreeSprite');
        treeIcon.anchor.setTo(0.5, 0.8);
        treeIcon.scale.set(0.12);
        
        woodTextStyle = { font: "18px Verdana", fill: "#ffffff", align: "center" };
        woodText = game.add.text(90, 7, "0", woodTextStyle);
        woodText.stroke = '#000000';
        woodText.strokeThickness = 1.5;
        
        woodGainedTextStyle = { font: "18px Verdana", fill: "#712f07", align: "center" };
        woodGainedText = game.add.text(-50, -50, "+1 wood", woodGainedTextStyle);
        woodGainedText.stroke = '#000000';
        woodGainedText.strokeThickness = 1.5;
        game.physics.enable(woodGainedText);
        
        var upgradeTextStyle = { font: "16px Verdana", fill: "#ffffff", align: "center" };
        var upgradeText = game.add.text(680, 23, "Upgrade house:", upgradeTextStyle);
        upgradeText.anchor.setTo(0.5, 0.5);
        
        upgradeButton = game.add.button(755, 7, 'UpgradeButton', upgradeHouse, this, 1, 0, 2, 3);
        upgradeButton.scale.set(0.3);
        
        redX = game.add.sprite(-10, -10, 'RedX');
        redX.scale.set(0.3);
        redX.anchor.setTo(0.5, 0.5);
        
    }
    /***************************** UPDATE *****************************/
    
    function update() {
        for(var i = 0; i < depthGroup.length; i++) {
            game.physics.arcade.collide(player, depthGroup.children[i], chopWood);
        }
        
        game.physics.arcade.collide(player, house, depositWood);
        
        woodText.setText("" + wood);
        
        // Stop the player from running off
        if(game.physics.arcade.distanceBetween(player, redX) < 5) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }
        
        // Player movement controls
        if (player.body.velocity.y > 0 && (absoluteValue(player.y - redX.y) > absoluteValue(player.x - redX.x))) {
            if(woodInHand > 0) {
                player.animations.play('walkWoodDown', 4, true);
            } else {
                player.animations.play('walkDown', 4, true);
            }
            direction = "down";
            
        } else if (player.body.velocity.y < 0 && (absoluteValue(player.y - redX.y) > absoluteValue(player.x - redX.x))) {
            if(woodInHand > 0) {
                player.animations.play('walkWoodUp', 4, true);
            } else {
                player.animations.play('walkUp', 4, true);
            }
            direction = "up";
            
        } else if (player.body.velocity.x < 0 && (absoluteValue(player.y - redX.y) < absoluteValue(player.x - redX.x))) {
            if(woodInHand > 0) {
                player.animations.play('walkWoodLeft', 4, true);
            } else {
                player.animations.play('walkLeft', 4, true);
            }
            direction = "left";
            
        } else if (player.body.velocity.x > 0 && (absoluteValue(player.y - redX.y) < absoluteValue(player.x - redX.x))) {
            if(woodInHand > 0) {
                player.animations.play('walkWoodRight', 4, true);
            } else {
                player.animations.play('walkRight', 4, true);
            }
            direction = "right";
            
        } else if(chopping == true) {
            switch(direction) {
            case "down":
                player.animations.play('chopDown', 8, true);
                break;
            case "up":
                player.animations.play('chopUp', 8, true);
                break;
            case "left":
                player.animations.play('chopLeft', 8, true);
                break;
            case "right":
                player.animations.play('chopRight', 8, true);
                break;
            }
        } else {
            switch(direction) {
            case "down":
                if(woodInHand > 0) {
                    player.animations.play('idleWoodDown', 2, true);
                } else {
                    player.animations.play('idleDown', 4, true);
                }
                break;
            case "up":
                if(woodInHand > 0) {
                    player.animations.play('idleWoodUp', 2, true);
                } else {
                    player.animations.play('idleUp', 4, true);
                }
                break;
            case "left":
                if(woodInHand > 0) {
                    player.animations.play('idleWoodLeft', 2, true);
                } else {
                    player.animations.play('idleLeft', 4, true);
                }
                break;
            case "right":
                if(woodInHand > 0) {
                    player.animations.play('idleWoodRight', 2, true);
                } else {
                    player.animations.play('idleRight', 4, true);
                }
                break;
            }
        }
        
        depthGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    }
    
    
    function chopWood(player, tree) {
        currentTree = tree;
        
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        if(woodInHand < 10 && tree.amountOfWood > 0) {
            chopping = true;
        } else {
            chopping = false;
        }
    }
    
    
    function gainWood() {
        if(woodInHand < 10 && currentTree.amountOfWood > 0) {
            if(chopping) {
                woodGainedText.alpha = 1;
                
                woodGainedText.x = player.x - 40;
                woodGainedText.y = player.y - 60;
                woodGainedText.body.velocity.y = -30;
                
                game.add.tween(woodGainedText).to({alpha: 0}, 750, Phaser.Easing.Linear.None, true);
                
                woodInHand++;
                currentTree.amountOfWood = currentTree.amountOfWood - 1;
                
                if(currentTree.amountOfWood === 0) {
                    currentTree.animations.play('treeStump', 0, true);
                }
            }
        } else {
            chopping = false;
        }
    }
    
    
    function depositWood() {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        wood = wood + woodInHand;
        woodInHand = 0;
    }
    
    
    function upgradeHouse() {
        if(wood >= 10) {
            upgradeNum++;
            switch(upgradeNum) {
            case 1:
                house.animations.play('houseFrame1', 0, true);
                message("House upgraded to level 2", 1000);
                break;
            case 2:
                house.animations.play('houseFrame2', 0, true);
                message("House upgraded to level 3", 1000);
                break;
            case 3:
                house.animations.play('houseFrame3', 0, true);
                message("House complete!", 10000);
                    
                game.time.events.add(Phaser.Timer.SECOND * 5, gameOver, this);
                break;
            } 
            wood = wood - 10;
        } else {
            message("Not enough wood to upgrade your house.", 1000);
        }
    }
    
    
    function message(text, delay) {
        messageText.alpha = 1;
        messageText.setText(text);
        game.add.tween(messageText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1000);
    }
    
    
    function absoluteValue(num) {
        if(num < 0) {
            num = num * -1;
        }
        return num;
    }
    
    
    function gameOver() {
        gameOverBool = true;
        
        var graphics = game.add.graphics(50, 300);
        
        graphics.lineStyle(10, 0x111111, 1);
        graphics.drawRect(0, -150, 400, 300);
        
        graphics.lineStyle(300, 0x111111, 0.9);
        graphics.moveTo(0, 0);
        graphics.lineTo(400, 0);
        
        window.graphics = graphics;
        
        var textStyle = { font: "26px Verdana", fill: "#ffffff", align: "center" };
        var text = game.add.text(game.width / 2 - 150, game.height / 2, "I knew I could count on you.\n\n Good work son.", textStyle);
        text.anchor.setTo(0.5, 0.5);
        
        var orc = game.add.sprite(630, 300, 'OrcSprite');
        orc.anchor.set(0.5, 0.5);
        orc.scale.set(0.5);
    }
    
    
    function render() {
        // Input debug info
        //game.debug.inputInfo(32, 32);
        //game.debug.spriteInfo(player, 32, 430);
        //game.debug.spriteInfo(treeSprite, 32, 130);
        //game.debug.pointer( game.input.activePointer );
        
        //game.debug.body(player);
        //game.debug.body(house);
        //game.debug.body(tree1);
        //game.debug.body(tree2);
    }
        
    
    return {"create": create, "update": update, "render": render};
}

/*****************************************************************************************
                                    END OF: MAIN GAME STATE
 *****************************************************************************************/
