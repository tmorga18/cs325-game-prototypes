function preloadState(game) {
    
    function preload() {
        // Load game assets
        game.load.image('TileSprite', 'assets/World/Tile.png');
        game.load.spritesheet('WerebearSpritesheet', 'assets/World/WerebearSpritesheet.png', 100, 100);
        
    }
    
    function create() {
        
    }
    
    function update() {
        game.state.start("mainMenu");
    }
    
    return {"preload": preload, "create": create, "update": update};
}