'use strict';

/***************** GLOBAL VARIABLES *****************/


/*
    WINDOW.ONLOAD:
        - Runs when the page finishes loading

        - Window.onload is only needed if you include your JavaScript at the top of the html page (i.e. in the <head> tag) - you'd do this to load your JavaScript up-front to do something important with your page before it's loaded. If you don't need to do this (which turns out to be the case most of the time) you can put your JavaScript at the bottom of the page (usually just before the closing </body> tag) and this will mean by the time the JavaScript loads, the rest of the page has already loaded.
*/

window.onload = function () {
    
    var game = new Phaser.Game( 800, 600, Phaser.CANVAS, 'game' );
    
    game.state.add("preload", preloadState(game));
    game.state.add("mainMenu", mainMenuState(game));
    game.state.add("mainGame", mainGameState(game));
    
    game.state.start("preload");
};