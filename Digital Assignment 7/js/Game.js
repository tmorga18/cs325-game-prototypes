function mainGameState(game) {
    
    // World variables
    
    var rollDiceButton;
    var die1, die2;
    var P1C1, P1C2, P1C3, P1C4, P1C5, P1C6, P1C7, P1C8, P1C9, P1C10, P1C11, P1C12, P1C13;
    var P1Cards = [P1C1, P1C2, P1C3, P1C4, P1C5, P1C6, P1C7, P1C8, P1C9, P1C10, P1C11, P1C12, P1C13];
    
    /***************************** CREATE *****************************/
    function create() {
        createDice();
        
        console.log(P1Cards.length);
        for(var i = 1; i <= P1Cards.length; i++) {
            //P1Cards[i] = game.add.sprite(200, 200, 'CardsSpritesheet', 0);
        }
        
        /*
        P1C1 = game.add.sprite(200, 200, 'CardsSpritesheet', 1);
        P1C2 = game.add.sprite(200, 200, 'CardsSpritesheet', 2);
        P1C3 = game.add.sprite(200, 200, 'CardsSpritesheet', 3);
        P1C4 = game.add.sprite(200, 200, 'CardsSpritesheet', 4);
        P1C5 = game.add.sprite(200, 200, 'CardsSpritesheet', 5);
        P1C6 = game.add.sprite(200, 200, 'CardsSpritesheet', 6);
        P1C7 = game.add.sprite(200, 200, 'CardsSpritesheet', 7);
        P1C8 = game.add.sprite(200, 200, 'CardsSpritesheet', 8);
        P1C9 = game.add.sprite(200, 200, 'CardsSpritesheet', 9);
        P1C10 = game.add.sprite(200, 200, 'CardsSpritesheet', 10);
        P1C11 = game.add.sprite(200, 200, 'CardsSpritesheet', 11);
        P1C12 = game.add.sprite(200, 200, 'CardsSpritesheet', 12);
        P1C13 = game.add.sprite(200, 200, 'CardsSpritesheet', 13);
        */
    }
    /************************** END OF CREATE *************************/
    
    
    /***************************** UPDATE *****************************/
    function update() {
        
    }
    /************************** END OF UPDATE *************************/
    
    
    function createDice() {
        rollDiceButton = game.add.button(150, 50, 'RollDiceButtonSprite', rollDice, this, 3, 1, 2, 3);
        rollDiceButton.anchor.setTo(0.5, 0.5);
        
        function Die(x, y) {
            var die = {};
            
            die.value = 1;
            
            die.sprite = game.add.sprite(x, y, 'DiceSpritesheet', 0);
            die.sprite.anchor.setTo(0.5, 0.5);
            die.sprite.scale.set(0.7);
            
            die.sprite.animations.add('dieValue1', [0], 4, true, true);
            die.sprite.animations.add('dieValue2', [1], 4, true, true);
            die.sprite.animations.add('dieValue3', [2], 4, true, true);
            die.sprite.animations.add('dieValue4', [3], 4, true, true);
            die.sprite.animations.add('dieValue5', [4], 4, true, true);
            die.sprite.animations.add('dieValue6', [5], 4, true, true);
            
            return die;
        }
        
        die1 = Die(125, 100);
        die2 = Die(175, 100);
        
        console.log(die1);
        console.log(die2);
    }
    
    
    function rollDice() {
        console.log("rolling the dice!");
        
        die1.value = game.rnd.integerInRange(1, 6);
        die2.value = game.rnd.integerInRange(1, 6);
        
        changeDieSprite(die1.value, die1.sprite);
        changeDieSprite(die2.value, die2.sprite);
        
        function changeDieSprite(value, sprite) {
            switch(value) {
                case 1:
                    sprite.animations.play('dieValue1', 4, true);
                    break;
                case 2:
                    sprite.animations.play('dieValue2', 4, true);
                    break;
                case 3:
                    sprite.animations.play('dieValue3', 4, true);
                    break;
                case 4:
                    sprite.animations.play('dieValue4', 4, true);
                    break;
                case 5:
                    sprite.animations.play('dieValue5', 4, true);
                    break;
                case 6:
                    sprite.animations.play('dieValue6', 4, true);
                    break;
            }
        }
    }
    
    
    function render() {
        
    }
    
    
    
    
    return {"create": create, "update": update, "render": render};
}