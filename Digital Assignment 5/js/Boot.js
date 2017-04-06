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