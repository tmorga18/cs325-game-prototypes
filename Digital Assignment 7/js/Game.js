function mainGameState(game) {
    
    // World variables
    
    var rollDiceButton;
    var die1, die2;
    var sum;
    var sumTextStyle;
    var sumText;
    var mainTextStyle;
    var mainText;
    var sumOfCardsTextStyle;
    var sumOfCardsText;
    var P1C1, P1C2, P1C3, P1C4, P1C5, P1C6, P1C7, P1C8, P1C9, P1C10;
    var P1Cards = [P1C1, P1C2, P1C3, P1C4, P1C5, P1C6, P1C7, P1C8, P1C9, P1C10];
    var flipCardsButton;
    var sumOfCards = 0;
    var rollable = true;
    
    /***************************** CREATE *****************************/
    function create() {
        createDice();
        
        sumTextStyle = { font: "18px Verdana", fill: "#111111", align: "center" };
        sumText = game.add.text(100, 140, "Sum: ", sumTextStyle);
        sumText.stroke = '#000000';
        sumText.strokeThickness = 1;
        
        mainTextStyle = { font: "18px Verdana", fill: "#111111", align: "center" };
        mainText = game.add.text(375, 50, "", mainTextStyle);
        mainText.stroke = '#000000';
        mainText.strokeThickness = 1;
        
        sumOfCardsTextStyle = { font: "18px Verdana", fill: "#111111", align: "center" };
        sumOfCardsText = game.add.text(300, 200, "Total: ", sumOfCardsTextStyle);
        sumOfCardsText.stroke = '#000000';
        sumOfCardsText.strokeThickness = 1;
        
        P1C1 = Card(1, 75, 250);
        P1C2 = Card(2, 200, 250);
        P1C3 = Card(3, 325, 250);
        P1C4 = Card(4, 450, 250);
        P1C5 = Card(5, 575, 250);
        
        P1C6 = Card(6, 75, 400);
        P1C7 = Card(7, 200, 400);
        P1C8 = Card(8, 325, 400);
        P1C9 = Card(9, 450, 400);
        P1C10 = Card(10, 575, 400);
        
        flipCardsButton = game.add.button(280, 550, 'FlipCardsButtonSprite', flipAllCards, this, 3, 1, 2, 3);
        
    }
    /************************** END OF CREATE *************************/
    
    
    /***************************** UPDATE *****************************/
    function update() {
        sumOfCardsText.setText("Total: " + sumOfCards);
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
    }
    
    
    function rollDice() {
        if(rollable === true) {
            rollable = false;
            message("Rolling the dice!", 1000);

            die1.value = game.rnd.integerInRange(1, 6);
            die2.value = game.rnd.integerInRange(1, 6);

            sum = die1.value + die2.value;
            sumText.setText("Sum: " + sum);

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
        } else {
            message("You must flip the cards over first.", 1000);
        }
    }
    
    
    function Card(value, x, y) {
        var card = {};
        var chosen = false;
        var clickable = true;

        card.sprite = game.add.sprite(x, y, "CardsSpritesheet", value);
        var backside = card.sprite.animations.add('backside', [0], 4, true, true);

        card.value = value;

        game.physics.arcade.enable(card.sprite);
        card.sprite.inputEnabled = true;
        card.sprite.events.onInputDown.add(clickCard, card);
        
        function clickCard() {
            if(rollable === false) {
                if(clickable === true) {
                    if(chosen === false) {
                        chosen = true;
                        card.sprite.tint = 0xa7ff8b;
                        sumOfCards += card.value;

                    } else {
                        chosen = false;
                        card.sprite.tint = 0xffffff;
                        sumOfCards -= card.value;
                    }
                }
            } else {
                message("You must roll the dice first.", 1000);
            }
        }
        
        function flipCards() {
            if(rollable === false) {
                if(sumOfCards === sum) {
                    message("Flipping the cards!", 1000);
                    if(chosen === true) {
                        chosen = false;
                        card.sprite.animations.play('backside', 4, true);
                        card.sprite.tint = 0xffffff;
                        clickable = false;
                        total = 0;
                        console.log(card);
                    }
                    rollable = true;
                } else {
                    message("You must flip cards equal to the sum\nthat you rolled." , 2000);
                }
            } else {
                message("You must roll the dice first.", 1000);
            }
        }

        return card;
    }
    
    
    function message(text, delay) {
        mainText.alpha = 1;
        mainText.setText(text);
        game.add.tween(mainText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1000);
    }
    
    
    function flipAllCards() {
        for(var i = 0; i < P1Cards.length; i++) {
            console.log(P1Cards.children[i]);
            //P1Cards[i].flipCards();
        }
    }
    
    
    function render() {
        
    }
    
    
    return {"create": create, "update": update, "render": render};
}