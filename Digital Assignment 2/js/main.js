window.onload = function() {
    
    
    "use strict";
    
    
    var game = new Phaser.Game( 800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render } );
    
    
    function preload() {
        
        game.world.setBounds(0,0, game.width * 2, game.height * 2);
        
        // *** CHARACTER ***
        //  37x45 is the size of each frame
        //  There are 16 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
        //  blank frames at the end, so we tell the loader how many to load
        game.load.spritesheet('CharacterSprite', 'assets/CharacterSpriteSheet.png', 39, 51, 16);
        
        // *** OBJECTS***
        game.load.image( 'House1Sprite', 'assets/House1.png' );
        game.load.image( 'House2Sprite', 'assets/House2.png' );
        game.load.image( 'House3Sprite', 'assets/House3.png' );
        game.load.image( 'House4Sprite', 'assets/House4.png' );
        
        game.load.image( 'Tree1Sprite', 'assets/Tree1.png' );
        game.load.image( 'Tree2Sprite', 'assets/Tree2.png' );
        game.load.image( 'Tree3Sprite', 'assets/Tree3.png' );
        game.load.image( 'Tree4Sprite', 'assets/Tree4.png' );
        game.load.image( 'Tree5Sprite', 'assets/Tree5.png' );
        game.load.image( 'Tree6Sprite', 'assets/Tree6.png' );
        game.load.image( 'Tree7Sprite', 'assets/Tree7.png' );
        game.load.image( 'Tree8Sprite', 'assets/Tree8.png' );
        
        //game.load.image( 'DotSprite', 'assets/dot.png' );
        
        // *** BACKGROUNDS
        game.load.image( 'BackgroundWorld', 'assets/BackgroundWorld.jpg' );
        game.load.image( 'GrassSprite', 'assets/Grass.png' );
    }

    var counter = 0;
    var counterText;
    var timer = 0;
    var timerText;
    var x = 0;
    var y = 0;
    var positionText;
    var style
    //var dot;
    
    var grassSprite;
    var House1Sprite;
    var House2Sprite;
    var House3Sprite;
    var House4Sprite;
    var houseCounter = 0;
    var TreeSprite;
    var group;
    
    // *** CHARACTER ***
    var character;
    var evilTwin;
    var evilTwinSpeed = 50;
    var lastKey = 0;
    var isWalking = false;
    var walkDown;
    var walkRight;
    var walkLeft;
    var walkUp;
    var walkSpeed = 2;
    
    function create() {
        grassSprite = game.add.tileSprite(0, 0, game.width * 2, game.height * 2, 'GrassSprite');
        
        style = { font: "20px Verdana", fill: "#ffffff", align: "center" };
        counterText = game.add.text( 30, 30, "Counter: 0", style );
        
        timerText = game.add.text( 30, 70, "Timer: 0", style );
        
        positionText = game.add.text( 30, 110, "x = 0    y = 0", style );
        //dot = game.add.sprite(1, 1, 'DotSprite');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        group = game.add.physicsGroup(Phaser.Physics.ARCADE);
        
        for(var i = 0; i < 5; i++) {
            spawnHouse();
        }

        // Spawn trees randomly
        /*
        for(var i = 0; i < 10; i++) {
            if(game.physics.arcade.collide(TreeSprite, group) === false) {
                TreeSprite = group.create(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), 'Tree1Sprite');
                TreeSprite.scale.set(2);
                TreeSprite.anchor.setTo(0.5, 0.5);
                TreeSprite.body.immovable = true;
            } else {
                updateText();
            }
        }
        */
        
        character = group.create(game.world.centerX, game.world.centerY, 'CharacterSprite', 1);
        character.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(character);
        
        evilTwin = group.create(game.rnd.integerInRange(0, game.world.width), game.rnd.integerInRange(0, game.world.height), 'CharacterSprite', 1);
        evilTwin.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(evilTwin);
        
        game.camera.follow(character);
        
        //  Here we add a new animation called 'walk'
        //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
        walkDown = character.animations.add('walkDown', [0, 1, 2, 3], 3, true, true);
        walkRight = character.animations.add('walkRight', [4, 5, 6, 7], 3, true, true);
        walkLeft = character.animations.add('walkLeft', [8, 9, 10, 11], 3, true, true);
        walkUp = character.animations.add('walkUp', [12, 13, 14, 15], 3, true, true);
        
        idleDown = character.animations.add('idleDown', [1], 3, true, true);
        idleRight = character.animations.add('idleRight', [5], 3, true, true);
        idleLeft = character.animations.add('idleLeft', [8], 3, true, true);
        idleUp = character.animations.add('idleUp', [13], 3, true, true);
        
        //********* INPUT CONTROLS *********
        
        // To be able to use the keyboard arrows
        //var cursors = game.input.keyboard.createCursorKeys();
        
        game.input.keyboard = addKeys( {
            'up': Phaser.KeyCode.W,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A,
            'right': Phaser.KeyCode.D
        });
        
        // To add single keys
        // game.input.keyboard.addKey(Phaser.Keyboard.A);
        
        group.sort();
    }
    
    
    function update() {
        
        incrementTimer();
        if(timer > 100) {
            incrementCounter();
            timer = 0;
            
            evilTwinSpeed = evilTwinSpeed + 15;
            moveEvilTwinToPoint();
        }
        
        //evilTwin.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 200);
        
        game.physics.arcade.collide(character, group, collisionHandler, null, this);
        game.physics.arcade.collide(evilTwin, group, collisionHandler, null, this);
        
        character.body.velocity.x = 0;
        character.body.velocity.y = 0;
        
        evilTwin.animations.play('walkDown', 3, true);
        
        // UP
        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            //character.y -= walkSpeed;
            character.body.velocity.y = -200;
            character.animations.play('walkUp', 4, true);
            isWalking = false;
            lastKey = 0;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            //character.y += walkSpeed;
            character.body.velocity.y = 200;
            character.animations.play('walkDown', 4, true);
            isWalking = false;
            lastKey = 1;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            //character.x -= walkSpeed;
            character.body.velocity.x = -200;
            character.animations.play('walkLeft', 4, true);
            isWalking = false;
            lastKey = 2;
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            //character.x += walkSpeed;
            character.body.velocity.x = 200;
            character.animations.play('walkRight', 4, true);
            isWalking = false;
            lastKey = 3;
        } else {
            isWalking = false;
        }
        
        /*if(isWalking == false) {
            if(lastKey === 0) {
                character.animations.play('idleUp', 3, true);
            } else if(lastKey === 1) {
                character.animations.play('idleDown', 3, true);
            } else if(lastKey === 2) {
                character.animations.play('idleLeft', 3, true);
            } else {
                character.animations.play('idleRight', 3, true);
            }
        }*/
        
        // To be able to use the keyboard arrows
        /*if (cursors.down.isDown) {
            character.y += walkSpeed;
            character.animations.play('walkDown', 3, true);
        }
        if (cursors.right.isDown) {
            character.x += walkSpeed;
            character.animations.play('walkRight', 3, true);
        }
        if (cursors.left.isDown) {
            character.x -= walkSpeed;
            character.animations.play('walkLeft', 3, true);
        }
        if (cursors.up.isDown) {
            character.y -= walkSpeed;
            character.animations.play('walkUp', 3, true);
        }*/
        
        group.sort('y', Phaser.Group.SORT_ASCENDING);
    }
    
    
    function spawnHouse() {
        var houseNumber = game.rnd.integerInRange(0, 3);
        switch(houseNumber) {
            case 0:
                House1Sprite = group.create(100 + (houseCounter * 300), game.rnd.integerInRange(0, game.world.height), 'House1Sprite');
                House1Sprite.body.setSize(98, 38, 5, 45);
                House1Sprite.anchor.setTo(0.5, 0.5);
                House1Sprite.scale.set(2.5);
                House1Sprite.body.immovable = true;
                break;
            case 1:
                House2Sprite = group.create(100 + (houseCounter * 300), game.rnd.integerInRange(0, game.world.height), 'House2Sprite');
                House2Sprite.body.setSize(55, 25, 3, 25);
                House2Sprite.anchor.setTo(0.5, 0.5);
                House2Sprite.scale.set(3);
                House2Sprite.body.immovable = true;
                break;
            case 2:
                House3Sprite = group.create(100 + (houseCounter * 300), game.rnd.integerInRange(0, game.world.height), 'House3Sprite');
                House3Sprite.body.setSize(58, 45, 2, 30);
                House3Sprite.anchor.setTo(0.5, 0.5);
                House3Sprite.scale.set(3);
                House3Sprite.body.immovable = true;
                break;
            case 3:
                House4Sprite = group.create(100 + (houseCounter * 300), game.rnd.integerInRange(0, game.world.height), 'House4Sprite');
                House4Sprite.body.setSize(55, 25, 3, 25);
                House4Sprite.anchor.setTo(0.5, 0.5);
                House4Sprite.scale.set(3);
                House4Sprite.body.immovable = true;
                break;
            default:
                game.stage.backgroundColor = '#009090';
        }
        houseCounter++;
    }
    
    function collisionHandler (object1, object2) {

        if(object1 === character && object2 === evilTwin) {
            gameOver();
        }

    }
    
    
    function incrementCounter() {
        counter++;
        counterText.setText("Counter: " + counter);
    }
    
    
    function incrementTimer() {
        timer++;
        timerText.setText("Timer: " + timer);
    }
        
        
    function moveEvilTwinToPoint() {
        //dot.destroy();
        //var x = game.rnd.integerInRange(0, game.world.width * 2);
        //var y = game.rnd.integerInRange(0, game.world.height * 2);
        //positionText.setText("x = " + x + "    y = " + y);
        //dot = game.add.sprite(x, y, 'DotSprite');
        
        //game.physics.arcade.moveToXY(evilTwins, x, y, 5, 7000);
        game.physics.arcade.moveToXY(evilTwin, character.x, character.y, evilTwinSpeed);
    }
    
    
    function gameOver() {
        evilTwin.position = new Phaser.Point(game.world.centerX, game.world.centerY);
        var gameOverText = game.add.text( character.x, character.y, "GAME OVER", style );
        var gameOverText2 = game.add.text( character.x, character.y - 100, "You lasted for " + timer + " seconds", style );
        gameOverText.font = 'Arial';
        gameOverText.fontWeight = 'bold';
        gameOverText.fontSize = 70;
        gameOverText.fill = '#ffffff';
    }
    
    
    function render() {
        // Input debug info
        //game.debug.inputInfo(32, 32);
        //game.debug.spriteInfo(character, 32, 130);
        //game.debug.pointer( game.input.activePointer );
        
        //game.debug.body(character);
        //game.debug.body(House1Sprite);
        //game.debug.body(House2Sprite);
        //game.debug.body(House3Sprite);
        //game.debug.body(House4Sprite);
        //game.debug.body(TreeSprite);
    }
};
