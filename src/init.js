import floor from "./floor.js";
import Scene_play from "./scenes/scene_play.js";

const config = {
    width: 320 * 3.5,
    height: 180 * 7,
    parent: "container",
    type: Phaser.AUTO,
    scene: [
        floor,
        Scene_play
    ]
    
}

new Phaser.Game(config);

