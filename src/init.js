const config = {
    width: 320 * 3.5,
    height: 180 * 7,
    parent: "container",
    type: Phaser.AUTO,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade: {
           // gravity: { y: 0 },
        }
    }
}

var game = new Phaser.Game(config);

function preload() {
    this.load.image("escandalo", "./src/assets/escandalo.png");
}

function create() {
    console.log(Phaser.Input.Keyboard.KeyCodes);
    this.escandalo = this.add.image(100, 300, "escandalo"); // Añadir la imagen al juego en la posición (400, 300)
    this.escandalo.setScale(0.3); // Redimensionar la imagen al 30% de su tamaño original
    //this.escandalo.flipX = true; // Voltear la imagen horizontalmente para andar acia delante o atras
    //this.escandalo.setAngle(0); // Establecer el ángulo inicial a 0 grados
    //this.escandalo.setOrigin(0.5, 0.5);  // Cambiar el punto de origen al centro de la imagen
    //Fisicas
    //this.escandalo.setCollideWorldBounds(true); // Hacer que la imagen colisione con los límites del mundo
    //this.escandalo.setBounce(0.25); // Hacer que la imagen rebote al colisionar con los límites del mundo
    //this.escandalo.setAcceleration(50,0);   // Establecer una aceleración constante en el eje X
    //this.escandalo.setVelocity(100, -200); // Establecer una velocidad inicial en el eje X y Y
    this.input.keyboard.on("keydown_RIGHT", () => {
        this.escandalo.x++;
    });
}

function update(time, delta) {
    //this.escandalo.angle += 0; // Rotar la imagen nº grado por frame
    //this.escandalo.x += 0; // Mover la imagen nº píxel hacia abajo por frame

}
