function mainGameState(game) {
    
    // Global Variables
    var grid = [];
    var gridWidth = 5;
    var gridHeight = 5;
    
    var selectedTile;
    
    var player;
    var playerScore = 0;
    var playerScoreText;
    
    var ai;
    var aiScore = 0;
    var aiScoreText;
    
    var sign = 1;
    var signText = "+";
    
    var turnsLeft;
    var turnsLeftText;
    
    var botTurnTime = 100;
    var timer = botTurnTime;
    //var timerText;
    
    var botTurn = false;
    
    function create() {
        turnsLeft = game.rnd.integerInRange(10, 20);
        
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
        CreateScoresText(580, 20);
        
        player = Werebear(640, 400);
        ai = Werebear(720, 400);
        ai.sprite.tint = 0x233000;
    }
    
    
    function update() {
        playerScoreText.setText("Player Score:\n" + playerScore);
        aiScoreText.setText("AI Score:\n" + aiScore);
        turnsLeftText.setText("Turns Left:\n" + turnsLeft);
        //timerText.setText(timer);
        if(botTurn == true) {
            game.input.enabled = false;
            timer--;
            if(timer <= 0) {
                aiTurn();
                botTurn = false;
                game.input.enabled = true;
            }
        }
        
        if(turnsLeft <= 0) {
            var graphics = game.add.graphics(50, 300);
        
            graphics.lineStyle(10, 0x111111, 1);
            graphics.drawRect(0, -150, 400, 300);

            graphics.lineStyle(300, 0x111111, 0.9);
            graphics.moveTo(0, 0);
            graphics.lineTo(500, 0);

            window.graphics = graphics;
            
            var gameOverText = game.add.text(300, 300, "GAME OVER!", { font: "50px Arial", fill: "#ff0044", align: "center"});
            gameOverText.anchor.setTo(0.5, 0.5);
        }
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
            
            player.sprite.x = selectedTile.sprite.x;
            player.sprite.y = selectedTile.sprite.y;
            
            if(sign == 1) {
               playerScore += tile.gridNumber;
            } else {
               playerScore -= tile.gridNumber;
            }
            tile.gridNumber = 0;
            text.setText(0);
            
            turnsLeft--;
            
            chooseSign();
            botTurn = true;
            timer = botTurnTime;
        }

        return tile;
    }
    
    
    function aiTurn() {
        console.log("AI TURN");
        
        var randomX = game.rnd.integerInRange(0, 4);
        var randomY = game.rnd.integerInRange(0, 4);
        
        selectedTile = grid[randomX][randomY];
        ai.sprite.x = selectedTile.sprite.x;
        ai.sprite.y = selectedTile.sprite.y;
        
        console.log(selectedTile.gridNumber);
        
        if(sign == 1) {
           aiScore += selectedTile.gridNumber;
        } else {
           aiScore -= selectedTile.gridNumber;
        }
        
        turnsLeft--;
    }
    
    
    function chooseSign() {
        sign = game.rnd.integerInRange(1, 2);
        
        if(sign == 1) {
           signText.setText("Sign:\n+");
        } else {
           signText.setText("Sign:\n-");
        }
    }
    
    
    function CreateScoresText(x, y) {
        var graphics = game.add.graphics(x, y);
        
        graphics.lineStyle(5, "#111111", 1);
        graphics.drawRect(0, 0, 200, 80);
        
        graphics.drawRect(0, 80, 200, 80);
        
        graphics.drawRect(0, 160, 200, 80);
        
        graphics.drawRect(0, 240, 200, 80);
        
        //graphics.lineStyle(100, "#ffffff", 0.9);
        //graphics.moveTo(0, -100);
        //graphics.lineTo(200, -100);
        
        window.graphics = graphics;
        
        goalText = game.add.text(20, 10, "Try to keep your score as close to zero as you can!", { font: "24px Arial", fill: "#ff0044", align: "center"});
        
        playerScoreText = game.add.text(x + 100, y + 40, "Player Score:\n", { font: "24px Arial", fill: "#ff0044", align: "center"});
        playerScoreText.anchor.setTo(0.5, 0.5);
        
        aiScoreText = game.add.text(x + 100, y + 125, "AI Score:\n", { font: "24px Arial", fill: "#ff0044", align: "center"});
        aiScoreText.anchor.setTo(0.5, 0.5);
        
        signText = game.add.text(x + 100, y + 205, "Sign:\n+", { font: "24px Arial", fill: "#ff0044", align: "center"});
        signText.anchor.setTo(0.5, 0.5);
        
        turnsLeftText = game.add.text(x + 100, y + 285, "Turns Left:\n" + turnsLeft, { font: "24px Arial", fill: "#ff0044", align: "center"});
        turnsLeftText.anchor.setTo(0.5, 0.5);
        
        //timerText = game.add.text(x + 100, y + 500, timer, { font: "24px Arial", fill: "#ff0044", align: "center"});
    }
    
    
    function Werebear(x, y) {
        var werebear = {};

        werebear.sprite = game.add.sprite(x, y, "WerebearSpritesheet", 0);

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