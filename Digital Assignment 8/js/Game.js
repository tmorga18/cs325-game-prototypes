function mainGameState(game) {
    
    // Global Variables
    var grid = [];
    var gridWidth = 5;
    var gridHeight = 5;
    
    var selectedTile;
    var selectedTileText;
    
    var player1;
    
    function create() {
        game.stage.backgroundColor = "#99ddff";
        
        // Create the grid
        var gridNumber = 0;
        for(var row = 0; row < gridHeight; row++) {
            grid[row] = [];
            for(var column = 0; column < gridWidth; column++) {
                grid[row][column] = Tile(100 + (column * 100), 100 + (row * 100), gridNumber);
                gridNumber++;
            }
        }
        
        selectedTile = grid[0][0];
        
        // Text for the selected tile
        CreateSelectedTileText(580, 20);
        
        player1 = Werebear(grid[0][0].sprite.x, grid[0][0].sprite.y);
    }
    
    
    function update() {
        
    }
    
    
    function Tile(x, y, gridNumber) {
        var tile = {};
        
        tile.selected = false;
        tile.gridNumber = gridNumber;
        
        tile.sprite = game.add.sprite(x, y, "TileSprite");
        tile.sprite.anchor.setTo(0.5, 0.5);
        tile.sprite.scale.set(2);
        
        var text = game.add.text(x, y, gridNumber, { font: "24px Arial", fill: "#ff0044", align: "center"});
        text.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(tile.sprite);
        tile.sprite.inputEnabled = true;
        tile.sprite.events.onInputDown.add(selectTile, tile);
        
        function selectTile() {
            selectedTile.sprite.tint = 0xffffff;
            selectedTile = tile;
            selectedTile.sprite.tint = 0xffcccc;
            selectedTileText.setText("Selected Tile:\n" + selectedTile.gridNumber);
            
            player1.sprite.x = selectedTile.sprite.x;
            player1.sprite.y = selectedTile.sprite.y;
        }

        return tile;
    }
    
    
    function CreateSelectedTileText(x, y) {
        var graphics = game.add.graphics(x, y);
        
        graphics.lineStyle(5, "#111111", 1);
        graphics.drawRect(0, 0, 200, 100);
        
        //graphics.lineStyle(100, "#ffffff", 0.9);
        //graphics.moveTo(0, -100);
        //graphics.lineTo(200, -100);
        
        window.graphics = graphics;
        
        selectedTileText = game.add.text(x + 25, y + 10, "Selected Tile:\n", { font: "24px Arial", fill: "#ff0044", align: "center"});
        //selectedTileText.anchor.setTo(0.5, 0.5);
    }
    
    
    function Werebear(x, y) {
        var werebear = {};

        werebear.sprite = game.add.sprite(x, y, "WerebearSpritesheet", 0);

        // Attributes


        // Add physics
        game.physics.arcade.enable(werebear.sprite);
        //werebear.sprite.body.setSize(17, 20, 6, 8);
        //werebear.sprite.scale.set(0.8);
        werebear.sprite.body.fixedRotation = true;
        werebear.sprite.anchor.setTo(0.5, 0.5);
        werebear.sprite.body.collideWorldBounds = true;

        // Allow the player to mouse over the pokemon to see it's stats
        werebear.sprite.inputEnabled = true;

        // Add animations
        var idleDown = werebear.sprite.animations.add('idleDown', [0], 4, true, true);
        var idleUp = werebear.sprite.animations.add('idleUp', [4], 4, true, true);
        var idleLeft = werebear.sprite.animations.add('idleLeft', [8], 4, true, true);
        var idleRight = werebear.sprite.animations.add('idleRight', [12], 4, true, true);
        var walkDown = werebear.sprite.animations.add('walkDown', [2, 3], 4, true, true);
        var walkUp = werebear.sprite.animations.add('walkUp', [6, 7], 4, true, true);
        var walkLeft = werebear.sprite.animations.add('walkLeft', [10, 11], 4, true, true);
        var walkRight = werebear.sprite.animations.add('walkRight', [14, 15], 4, true, true);
        var happy = werebear.sprite.animations.add('happy', [16, 17, 18], 4, true, true);

        return werebear;
    }
    
    
    function render() {
        //game.debug.pointer( game.input.activePointer );
        //game.debug.body(grid[0][0].sprite);
    }
    
    
    return {"create": create, "update": update, "render": render};
}