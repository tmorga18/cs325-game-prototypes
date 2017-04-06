function introState(game) {
    
    var oak;
    var text;
    var timer = 0;
    var counter = 0;
    var oakText = ["Hello there!", "Welcome to the world of Pokemon.", "My name is Professor Oak.", "What is your name?", " ", " **this will change** ", "This world is populated by creatures\n called Pokemon.", "Your job is to catch them all!", "Your very own Pokemon adventure\n is about to unfold.", "Let's go!", ""];
    
    function create() {
        game.stage.backgroundColor = "#ffffff";
        
        // Add Professor Oak image
        oak = game.add.sprite(game.width / 2, 250, 'Oak1');
        oak.anchor.setTo(0.5, 0.5);
        
        // Add the text
        var style = { font: "30px Verdana", fill: "#111111", align: "center" };
        text = game.add.text(game.width / 2, 500, "", style);
        text.anchor.setTo(0.5, 0.5);
        
        game.time.events.loop(Phaser.Timer.SECOND, incrementTimer);
    }
    
    function update() {
        if(counter >= oakText.length) {
            startGame();
        }
        
        if(timer >= 2 && counter < oakText.length) {
            if(counter === 4) {
                promptName();
            }
            text.setText(oakText[counter]);
            counter++;
            timer = 0;
        }
    }
    
    function promptName() {
        playerName = prompt("Please enter your name", "");
        
        sessionStorage.setItem("playerName", playerName);
        
        oakText[5] = "Nice to meet you " + playerName + ".";
    }
    
    function incrementTimer() {
        timer++;
    }
    
    function startGame() {
        introMusic.stop();
        game.state.start("mainGame");
    }
    
    return {"create": create, "update": update, "startGame": startGame};
}