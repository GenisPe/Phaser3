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
    this.load.image("flores", "./Objects/Objects/Flores.png");

    // ===== Edificios =====
    this.load.image("teatro",  "./Objects/Edificios/Teatro.png");
    this.load.image("galeria", "./Objects/Edificios/Galeria.png");
    this.load.image("joyeria",   "./Objects/Edificios/joyeria.png");
    this.load.image("maquillaje",   "./Objects/Edificios/Maquillaje.png");
    this.load.image("pelucas",   "./Objects/Edificios/Pelucas.png");
    this.load.image("ropa",   "./Objects/Edificios/Ropa.png");
    this.load.image("manicura",   "./Objects/Edificios/SalonManicura.png");
    this.load.image("merch2",  "./Objects/Edificios/TiendaMerch2.png");
    this.load.image("zapateria",  "./Objects/Edificios/Zapateria.png");

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
    this.add.tileSprite(80, 500, 1080, 300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(80, 200, 300,  1300,"earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(200, 500, 300, 1700, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(100, 850, 500, 300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(350, 195, 250, 620, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(350, 264, 1500, 250, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(690, 220, 590, 250, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(775, 200, 250, 250, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(725, 500, 800,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(875, 400, 700,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(975, 370, 300,  130, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(450, 720, 300,  1600, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(450, 1100, 1300,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(350, 1100, 600,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(350, 1080, 300,  100, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(650, 1080, 300,  100, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(520, 780, 930,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(750, 880, 700,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(750, 780, 300,  400, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(850, 770, 300,  500, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(750, 1100, 300,  600, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(800, 1175, 870,  300, "earth").setOrigin(0,0).setScale(0.25);
    this.add.tileSprite(950, 1150, 300,  400, "earth").setOrigin(0,0).setScale(0.25);

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
    addObstacle(425, 180, "banco",  90, 70, { bodyH: 50, offsetY: 20 });
    addObstacle(590, 180, "banco",  90, 70, { bodyH: 50, offsetY: 20 });
    addObstacle(70, 1030, "banco",  90, 70, { bodyH: 50, offsetY: 20 });
    addObstacle(730, 1030, "banco",  90, 70, { bodyH: 50, offsetY: 20 });
    addObstacle(660, 700, "banco",  90, 70, { bodyH: 50, offsetY: 20 });

    //Flores
    //Camino POLVAZOS Y GARRITAS
    addObstacle(510,200, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(545,200, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(510,300, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(545,300, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(475,300, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(580,300, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(440,300, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(615,300, "flores", 50, 40, { bodyH:50, offsetY:20})
    
    //CAMINO PINCELADAS DE DIVA
    addObstacle(940,450, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(975,450, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(1010,450, "flores", 50, 40, { bodyH:50, offsetY:20})
    
    //CAMINO TEATRO
    addObstacle(100,550, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(135,550, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(65,550, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(265,550, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(300,550, "flores", 50, 40, { bodyH:50, offsetY:20})
    
    //CAMINO TODO UN ESCANDALO
    addObstacle(520,830, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(555,830, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(590,830, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(625,830, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(660,830, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(695,830, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(825,940, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(860,940, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(895,940, "flores", 50, 40, { bodyH:50, offsetY:20})
    
    //CAMINO PELUCAS,JOYERIA Y ZAPATOS
    addObstacle(350,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(385,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(420,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(455,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(490,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(525,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(560,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(595,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(630,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(665,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(700,1150, "flores", 50, 40, { bodyH:50, offsetY:20})
    

    //CAMINO TIENDA ROPA
    addObstacle(200,910, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(165,910, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(235,910, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(130,910, "flores", 50, 40, { bodyH:50, offsetY:20})
    addObstacle(95,910, "flores", 50, 40, { bodyH:50, offsetY:20})
    
    // Farolas (hitbox estrecho del poste)
    addObstacle(700, 290, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(250, 290, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(500, 100, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(380, 650, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(600, 650, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(0, 880, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(710, 890, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });
    addObstacle(200, 980, "farola", 120, 120, { bodyW: 30, bodyH: 90, offsetX: 45, offsetY: 20 });

    // Árboles (solo tronco)
    addObstacle(140, 300, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(800, 300, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(250, 580, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(750, 580, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(450, 80, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(600, 80, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(950, 780, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(350, 780, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(150, 980, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(800, 980, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(730, 650, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(30, 1100, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(0, 1150, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(150, 1120, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(210, 1140, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(650,1150, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(550,1150, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(450,1150, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(350,1150, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(975,550, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(1010,500, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(1030,565, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(15,220, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    addObstacle(15,420, "arbol", 80, 100, { bodyW: 30, bodyH: 45, offsetX: 25, offsetY: 55 });
    
    
    // Estatua/fuente (oval bajo)
    addObstacle(450, 350, "estatua", 200, 220, { bodyW: 160, bodyH: 90, offsetX: 20, offsetY: 120 });

    // Edificios (pared casi completa)
    addObstacle(0,   20,   "teatro",  230, 250, { bodyH: 200, offsetY: 20 });
    addObstacle(898, 140, "galeria", 230, 250, { bodyH: 200, offsetY: 20 });
    addObstacle(260, 880, "joyeria",   200, 220, { bodyH: 130, offsetY: 20 });
    addObstacle(250, 0, "maquillaje",   200, 220, { bodyH: 130, offsetY: 20 });
    addObstacle(545, 875, "pelucas",   200, 220, { bodyH: 130, offsetY: 20 });
    addObstacle(10, 640, "ropa",   200, 220, { bodyH: 130, offsetY: 20 });
    addObstacle(700, 50, "manicura",   150, 170, { bodyH: 130, offsetY: 20 });
    addObstacle(800, 510, "merch2",   200, 260, { bodyH: 130, offsetY: 20 });
    addObstacle(860, 945, "zapateria",   200, 220, { bodyH: 130, offsetY: 20 });

    // ============== 3) Decoración (no colisiona) ==============
    const deco1 = this.add.image(800, 395, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco1.setDepth((deco1.y + deco1.displayHeight) | 0);
    const deco2 = this.add.image(180, 395, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco2.setDepth((deco2.y + deco2.displayHeight) | 0);
    const deco3 = this.add.image(410, 130, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco3.setDepth((deco3.y + deco3.displayHeight) | 0);
    const deco4 = this.add.image(640, 130, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco4.setDepth((deco4.y + deco4.displayHeight) | 0);
    const deco5 = this.add.image(180, 395, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco5.setDepth((deco5.y + deco5.displayHeight) | 0);
    const deco6 = this.add.image(180, 395, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco6.setDepth((deco6.y + deco6.displayHeight) | 0);
    const deco7 = this.add.image(10, 1020, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco7.setDepth((deco7.y + deco7.displayHeight) | 0);
    const deco8 = this.add.image(770, 930, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco8.setDepth((deco8.y + deco8.displayHeight) | 0);
    const deco9 = this.add.image(940, 850, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco10 = this.add.image(340, 700, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco11 = this.add.image(560, 700, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco12 = this.add.image(740, 710, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco15 = this.add.image(600, 1170, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco17 = this.add.image(500, 1170, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco19 = this.add.image(400, 1170, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco21 = this.add.image(300, 1170, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco22 = this.add.image(700, 1170, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco23 = this.add.image(100, 1170, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco24 = this.add.image(200, 1100, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco25 = this.add.image(150, 230, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);
    deco9.setDepth((deco9.y + deco9.displayHeight) | 0);
    const deco26 = this.add.image(10, 330, "arbusto").setOrigin(0, 0).setDisplaySize(80, 80);


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
