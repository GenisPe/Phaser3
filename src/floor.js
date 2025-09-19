// floor.js — Escena del mapa con colisiones y pintado por Y.
// El personaje se mueve solo mientras mantienes la tecla (sin inercia) y tiene salto visual.

import Person from "./person.js";                                      // Personaje con control inmediato

class floor extends Phaser.Scene {
  constructor() { super({ key: "floor" }); }                            // Clave de la escena

  preload() {
    // ===== Suelos y caminos (solo visual) =====
    this.load.image("earth",  "./Objects/Floor/earth.png");
    this.load.image("boil",   "./Objects/Floor/boil.png");
    this.load.image("earth2", "./Objects/Floor/earthstone.png");
    this.load.image("land",   "./Objects/Floor/land.png");
    this.load.image("stone",  "./Objects/Floor/stone.png");

    // ===== Objetos del mapa =====
    this.load.image("banco",   "./Objects/Objects/Banco.png");
    this.load.image("farola",  "./Objects/Objects/Farola.png");
    this.load.image("arbusto", "./Objects/Objects/Arbusto.png");
    this.load.image("arbol",   "./Objects/Objects/Arbol.png");
    this.load.image("estatua", "./Objects/Objects/Estatua.png");
    this.load.image("teatro",  "./Objects/Objects/Teatro.png");
    this.load.image("galeria", "./Objects/Objects/Galeria.png");

    // ===== Personaje (PNG por dirección) =====
    this.load.image("escandalo_down",  "./Objects/DragQueen/escandalo.png");
    this.load.image("escandalo_up",    "./Objects/DragQueen/escandaloUP.png");
    this.load.image("escandalo_left",  "./Objects/DragQueen/escandaloLEFT.png");
    this.load.image("escandalo_right", "./Objects/DragQueen/escandaloRIGHT.png");
  }

  create() {
    // ================== 1) Suelos (pintura) ==================
    this.boil = this.add.tileSprite(0, 0, 4500, 5500, "boil")        // Suelo base
      .setOrigin(0, 0).setScale(0.25);

    this.land = this.add.tileSprite(350, 350, 1500, 1500, "land")    // Césped
      .setOrigin(0, 0).setScale(0.25);

    // Caminos de tierra (decoración)
    this.add.tileSprite(60,  500, 1160, 300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(60,  200, 300,  1300,"earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(725, 500, 800,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(875, 400, 700,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(975, 370, 300,  130, "earth").setOrigin(0,0).setScale(0.25);

    // ============== 2) Obstáculos estáticos (colisionan) ==============
    this.obstacles = this.physics.add.staticGroup();                 // Grupo para todo lo sólido

    // Helper para crear obstáculo con hitbox ajustado y depth por Y
    const addObstacle = (x, y, key, displayW, displayH, opts = {}) => {
      const obj = this.obstacles.create(x, y, key);                  // StaticImage con cuerpo Arcade
      obj.setOrigin(opts.originX ?? 0, opts.originY ?? 0);           // Origen visual
      obj.setDisplaySize(displayW, displayH);                        // Tamaño visual

      obj.body.setSize(opts.bodyW ?? displayW, opts.bodyH ?? displayH); // Tamaño del hitbox
      obj.body.setOffset(opts.offsetX ?? 0, opts.offsetY ?? 0);      // Offset del hitbox
      obj.refreshBody();                                             // Recalcular cuerpo estático

      obj.setDepth((obj.y + obj.displayHeight) | 0);                 // Pintado por Y (efecto RPG)
      return obj;
    };

    // Bancos (hitbox del asiento)
    addObstacle(250, 400, "banco",  90, 70, { bodyH: 50, offsetY: 20 });
    addObstacle(725, 400, "banco",  90, 70, { bodyH: 50, offsetY: 20 });

    // Farolas (hitbox estrecho del poste)
    addObstacle(700, 290, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(250, 290, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(380, 650, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(600, 650, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });

    // Árboles (solo tronco)
    addObstacle(130, 300, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(800, 300, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(250, 580, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(750, 580, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });

    // Estatua/fuente (oval bajo)
    addObstacle(450, 350, "estatua", 200, 220, { bodyW: 160, bodyH: 90, offsetX: 20, offsetY: 120 });

    // Edificios (pared casi completa)
    addObstacle(0,   0,   "teatro",  200, 220, { bodyH: 200, offsetY: 20 });
    addObstacle(910, 180, "galeria", 200, 220, { bodyH: 200, offsetY: 20 });

    // ============== 3) Decoración (no colisiona) ==============
    const deco1 = this.add.image(800, 395, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco1.setDepth((deco1.y + deco1.displayHeight) | 0);
    const deco2 = this.add.image(180, 395, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco2.setDepth((deco2.y + deco2.displayHeight) | 0);

    // ============== 4) Jugador (al final y con hitbox de pies) ==============
    this.player = new Person(this, 100, 300);                         // Crea el personaje
    this.player.setDepth((this.player.y + this.player.displayHeight) | 0); // Depth por Y

    // Hitbox reducido a la zona de los pies (colisión justa)
    this.player.body.setSize(this.player.displayWidth * 0.40, this.player.displayHeight * 0.30);
    this.player.body.setOffset(
      (this.player.displayWidth - this.player.body.width) / 2,        // Centrado en X
      this.player.displayHeight - this.player.body.height             // Pegado abajo (pies)
    );

    // Colisiones físicas jugador ↔ obstáculos
    this.physics.add.collider(this.player, this.obstacles);

    // Límites físicos del mundo = tamaño del canvas (ajusta si usas cámara)
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
  }

  update(time, delta) {
    this.player.update();                                             // Movimiento y salto visual
    this.player.setDepth((this.player.y + this.player.displayHeight) | 0); // Depth por Y cada frame
  }
}

export default floor;
