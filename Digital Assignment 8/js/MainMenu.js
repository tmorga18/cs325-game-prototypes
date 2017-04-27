function mainMenuState(game) {    
    
    function create() {
        game.state.start("mainGame");
    }
    
    function update() {
        
    }
    
    return {"create": create, "update": update};
}