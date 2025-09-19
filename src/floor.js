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
        // this.add.image(18, 18, "earth").setScale(0.25);
        // this.add.image(55, 18, "earth").setScale(0.25);
        // this.add.image(92, 18, "earth").setScale(0.25);
        // this.add.image(129, 18, "earth").setScale(0.25);
        // this.add.image(166, 18, "earth").setScale(0.25);
        // this.add.image(203, 18, "earth").setScale(0.25);
        // this.add.image(240, 18, "earth").setScale(0.25);
        // this.add.image(277, 18, "earth").setScale(0.25);
        // this.add.image(314, 18, "earth").setScale(0.25);
        // Crea un "tileSprite": una textura repetida en un área definida
        this.floor = this.add.tileSprite(
            0, // posición X
            0, // posición Y
            4500, // ancho (lo que quieras cubrir)
            5500, // alto (altura de la franja del suelo)
            "boil" // clave de la imagen
        );
        this.floor.setOrigin(0, 0); // Para que empiece arriba-izquierda
        this.floor.setScale(0.25); // Escala si la imagen es grande

        this.floor = this.add.tileSprite(
            350, // posición X
            350, // posición Y
            1500, // ancho (lo que quieras cubrir)
            1500, // alto (altura de la franja del suelo)
            "land" // clave de la imagen
        );
        this.floor.setOrigin(0, 0); // Para que empiece arriba-izquierda
        this.floor.setScale(0.25); // Escala si la imagen es grande

        this.floor = this.add.tileSprite(
            250, // posición X
            250, // posición Y
            500, // ancho (lo que quieras cubrir)
            500, // alto (altura de la franja del suelo)
            "stone" // clave de la imagen
        );

        this.floor.setOrigin(0, 0); // Para que empiece arriba-izquierda
        this.floor.setScale(0.25); // Escala si la imagen es grande
        
        this.floor = this.add.tileSprite(
            750, // posición X
            250, // posición Y
            500, // ancho (lo que quieras cubrir)
            500, // alto (altura de la franja del suelo)
            "earth" // clave de la imagen
        );

        this.floor.setOrigin(0, 0); // Para que empiece arriba-izquierda
        this.floor.setScale(0.25); // Escala si la imagen es grande
        
        this.floor = this.add.tileSprite(
            250, // posición X
            750, // posición Y
            250, // ancho (lo que quieras cubrir)
            500, // alto (altura de la franja del suelo)
            "earth2" // clave de la imagen
        );

        this.floor.setOrigin(0, 0); // Para que empiece arriba-izquierda
        this.floor.setScale(0.25); // Escala si la imagen es grande
    }

}


export default floor;