export default class Person extends Phaser.Physics.Arcade.Sprite {  // Clase Person con físicas Arcade
    constructor(scene, x, y) {                                        // Recibe la escena y una posición inicial
        super(scene, x, y, "escandalo_down");                           // Textura inicial mirando hacia abajo

        scene.add.existing(this);                                       // Añadimos el sprite a la escena (se renderiza)
        scene.physics.add.existing(this);                               // Registramos el sprite en Arcade Physics

        // ===== Visual =====
        this.setScale(0.15);                                             // Escala del PNG
        this.setCollideWorldBounds(true);                               // No salir de los límites del mundo
        this.setBounce(0);                                              // Sin rebote en colisiones
        this.body.setAllowDrag(false);                                  // Sin drag/inercia
        this.body.setFriction(0, 0);                                    // Sin fricción artificial

        // ===== Parámetros de movimiento =====
        this.SPEED = 200;                                               // Velocidad fija (px/s) mientras mantienes la tecla

        // ===== Teclas =====
        this.cursors = scene.input.keyboard.createCursorKeys();         // Flechas ↑ ↓ ← →
        this.space   = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Barra espaciadora (salto)

        // ===== Recuerda última dirección para textura en reposo =====
        this.lastDir = "down";                                          // "up" | "down" | "left" | "right"

        // ===== Sombra para salto visual (no afecta a colisiones) =====
        this.shadow = scene.add.ellipse(
        this.x,                                                       // x inicial (debajo del jugador)
        this.y + this.displayHeight * 0.45,                           // y inicial (bajo los “pies”)
        this.displayWidth * 0.55,                                     // ancho de la sombra
        this.displayHeight * 0.20,                                    // alto de la sombra
        0x000000,                                                     // color negro
        0.35                                                          // alfa (transparencia)
        );
        this.shadow.setDepth((this.y + this.displayHeight) | 0);        // Orden de pintado por Y
        this.isJumping = false;                                         // Flag para no encadenar saltos infinitos

        // ===== Feedback: cambia PNG en cuanto pulsas una dirección =====
        scene.input.keyboard.on("keydown", (ev) => {                    // Listener genérico al pulsar cualquier tecla
        if (ev.code === "ArrowUp")    this.setFacing("up");           // Cambia a PNG de arriba
        if (ev.code === "ArrowDown")  this.setFacing("down");         // Cambia a PNG de abajo
        if (ev.code === "ArrowLeft")  this.setFacing("left");         // Cambia a PNG de izquierda
        if (ev.code === "ArrowRight") this.setFacing("right");        // Cambia a PNG de derecha
        });
    }

    // Cambia textura según la dirección y la guarda como última dirección
    setFacing(dir) {
        if (dir === "up")    this.setTexture("escandalo_up");
        if (dir === "down")  this.setTexture("escandalo_down");
        if (dir === "left")  this.setTexture("escandalo_left");
        if (dir === "right") this.setTexture("escandalo_right");
        this.lastDir = dir;
    }

    // Salto visual (no altera colisiones ni velocidades): sube/baja levemente y aplasta la sombra
    doJump() {
        if (this.isJumping) return;                                      // Evita doble salto visual
        this.isJumping = true;                                           // Marca que está saltando

        const upOffset = 10;                                             // Altura visual del salto (px)
        const dur = 120;                                                 // Duración de subida/bajada (ms)

        // Tween del propio sprite: sube y baja rápido
        this.scene.tweens.timeline({
        targets: this,
        tweens: [
            { y: this.y - upOffset, duration: dur, ease: "sine.out" },   // Sube
            { y: this.y,            duration: dur, ease: "sine.in"  },   // Baja
        ],
        onStart: () => {
            // La sombra se hace más pequeña y densa mientras “sube”
            this.scene.tweens.add({
            targets: this.shadow,
            scaleX: 0.75, scaleY: 0.60, alpha: 0.45,
            duration: dur, ease: "sine.out"
            });
        },
        onComplete: () => {
            // La sombra vuelve a su tamaño original
            this.scene.tweens.add({
            targets: this.shadow,
            scaleX: 1, scaleY: 1, alpha: 0.35,
            duration: dur, ease: "sine.in",
            onComplete: () => { this.isJumping = false; }              // Permite un nuevo salto
            });
        }
        });
    }

    update() {
        // === 1) Calcula dirección de movimiento en base a teclas pulsadas ===
        let dx = 0, dy = 0;                                              // Dirección por eje (-1, 0, 1)
        if (this.cursors.left.isDown)  dx -= 1;                          // ←
        if (this.cursors.right.isDown) dx += 1;                          // →
        if (this.cursors.up.isDown)    dy -= 1;                          // ↑
        if (this.cursors.down.isDown)  dy += 1;                          // ↓

        // === 2) Normaliza para que en diagonal no vaya más rápido ===
        const len = Math.hypot(dx, dy);                                  // Longitud del vector
        if (len > 0) { dx /= len; dy /= len; }                           // Normalización (0->sin cambios)

        // === 3) Aplica velocidad inmediata (no hay aceleración ni drag) ===
        // Si hay teclas pulsadas, mueve. Si no, para en seco.
        this.setVelocity(dx * this.SPEED, dy * this.SPEED);

        // === 4) Si está parado, usa la última textura que tenía (ya se cambió en keydown) ===
        // (No hace falta cambiar nada aquí; la textura se actualiza en setFacing cuando pulsas)

        // === 5) Salto visual al pulsar SPACE (pulsación única) ===
        if (Phaser.Input.Keyboard.JustDown(this.space)) this.doJump();

        // === 6) Mantén la sombra bajo los pies y ordena por Y (efecto RPG) ===
        this.shadow.x = this.x;
        this.shadow.y = this.y + this.displayHeight * 0.45;
        this.shadow.setDepth((this.y + this.displayHeight) | 0);
    }
}
