
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('asteroids_background', 'assets/asteroids_background_image.jpg');
		this.load.image('start', 'assets/start.png');
		this.load.audio('bang_audio', ['assets/bang.wav']);
        this.load.audio('rumble_audio', ['assets/rumble.wav']);
        this.load.audio('alien_abduction', ['assets/alien_abduction.mp3']);
		//	+ lots of other required assets here
        this.load.image( 'earth_image', 'assets/earth.png' );
        this.load.image( 'asteroid_image', 'assets/asteroid1.png' );
        this.load.image( 'explosion_image', 'assets/explosion.png' );
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
        this.ready = true;
        this.state.start('MainMenu');
		//if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		//{
			//this.ready = true;
			//this.state.start('MainMenu');
            //this.state.start('Game');
		//}

	}

};
