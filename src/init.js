import floor from "./floor.js";

const config = {
    type: Phaser.AUTO,
        width: 320 * 3.5,
        height: 180 * 7,

    parent: "container",
    physics: { 
        default: "arcade", 
        arcade: { 
            gravity: { y: 0 }, 
            debug: false } },
    scene: [floor]
    };
new Phaser.Game(config);
