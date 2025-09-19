class floor extends Phaser.Scene {
    constructor() {
        super({ key: "floor" });
    }
    preload() {
        this.load.image("earth", "./Objects/Floor/earth.png");
        this.load.image("boil", "./Objects/Floor/boil.png");
        this.load.image("earth2", "./Objects/Floor/earthstone.png");
        this.load.image("land", "./Objects/Floor/land.png");
        this.load.image("stone", "./Objects/Floor/stone.png");
    }
    create() {
        this.add.image(90, 90, "earth");
        this.earth.setScale(1);

    }

}

export default floor;