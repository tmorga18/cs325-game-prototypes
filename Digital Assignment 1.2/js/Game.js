
BasicGame.Game = function (game) {
    
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    
    // Create your own variables.
    this.earth;
    this.a;
    this.totalAsteroids;
    this.asteroidGroup;
    this.asteroidCounter;
    this.counterText;
    this.showDebug = true;
    this.bang;
    this.rumble;
    this.emitter;
    this.health;
};

BasicGame.Game.prototype = {
    // Runs once. Good for setting up stuff at the beginning.
    create: function () {
        this.totalAsteroids = 10;
        this.asteroidCounter = 0;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var titleText = this.game.add.text( this.game.world.centerX, 15, "Asteroids!", style );
        titleText.anchor.setTo(0.5, 0.0);
        
        this.counterText = this.game.add.text(this.game.world.centerX, 70, 'Asteroids destroyed: 0', { font: "22px Arial", fill: "#9999ff", align: "center" });
        this.counterText.anchor.setTo(0.5, 0.5);
        
        this.buildWorld();
        
        // When you click on the sprite, you go back to the MainMenu.
        //this.earth.inputEnabled = true;
        //this.earth.events.onInputDown.add( function() { this.state.start('MainMenu'); }, this );
        
        this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.spawnAsteroid, this);
        
        this.bang = this.add.audio('bang_audio');
        this.rumble = this.add.audio('rumble_audio');
        
        
    },
    
    buildWorld: function () {
        this.earth = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, 'earth_image' );
        this.earth.anchor.setTo( 0.5, 0.5 );
        
        this.game.physics.enable(this.earth, Phaser.Physics.ARCADE);
    },
    
    spawnAsteroid: function () {
        // This will declare asteroidGroup as a new group
        this.asteroidGroup = this.add.group();
        
        this.a = this.asteroidGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(0, this.world.height), 'asteroid_image');
        this.a.anchor.setTo(0.5, 0.5);
        
        this.a.scale.setTo(2, 2);

        this.game.physics.enable(this.a, Phaser.Physics.ARCADE);
        
        this.a.health = this.rnd.integerInRange(2, 10);

        this.a.enableBody = true;
        
        this.a.inputEnabled = true;
        this.a.events.onInputDown.add(this.destroyAsteroid, this);

        this.game.physics.arcade.moveToXY(
            this.a, 
            this.rnd.integerInRange(200, this.world.width - 200),
            this.rnd.integerInRange(200, this.world.height - 200),
            100
        );
        
        this.game.add.tween(this.a).to( { angle: this.rnd.integerInRange(-180, 180) }, 5000, Phaser.Easing.Linear.None, true);
        this.game.add.tween(this.a.scale).to( { x: 0, y: 0 }, 5000, Phaser.Easing.Linear.None, true);
        
        this.rumble.volume = 1;
        this.rumble.play();
        this.rumble.fadeOut(5000);
        
        this.game.camera.shake(0.02, 1000);
        
    },

    update: function () {
        
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //this.earth.rotation = this.game.physics.arcade.accelerateToPointer( this.earth, this.game.input.activePointer, 500, 500, 500 );
        
        //if(checkOverlap(this.earth, this.a)) {
            
        //}
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.emitter = this.game.add.emitter(0, 0, 100);
        this.emitter.makeParticles('explosion_image');
    },
    
    destroyAsteroid: function (sprite) {

        this.a.health--;
        if(this.a.health <= 0) {
            this.bang.play();

            this.asteroidCounter++;
            this.counterText.setText('Asteroids destroyed: ' + this.asteroidCounter);
            
            sprite.destroy();
        }
        
        //this.game.input.onDown.add(this.particleBurst, this);
        this.particleBurst(sprite);
    },
    
    particleBurst: function (pointer) {

        //  Position the emitter where the mouse/touch event was
        this.emitter.x = pointer.x;
        this.emitter.y = pointer.y;

        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        this.emitter.start(true, 2000, null, 10);

    },
    
    render: function () {

        //this.game.debug.text('Counter: ' + asteroidCounter, 32, 64);

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
